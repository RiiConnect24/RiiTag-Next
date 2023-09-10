import { ncWithSession } from '@/lib/routing'
import { generateRandomKey, isBlank } from '@/lib/utils/utils'
import { LOGIN_ERROR_URI } from '@/lib/utils/oAuthUtils'
import logger from '@/lib/logger'
import prisma from '@/lib/db'
import ENV from '@/lib/constants/environmentVariables'
import HTTP_CODE from '@/lib/constants/httpStatusCodes'

const PROVIDER_ID = 'discord'
const BASE_URL = 'https://discord.com/api'
const REDIRECT_URI = `${ENV.BASE_URL}/api/auth/login/discord`

async function generateAuthorizeUrl (request, response) {
  const authUri = new URL(`${BASE_URL}/oauth2/authorize`)
  authUri.searchParams.set('client_id', ENV.DISCORD_CLIENT_ID)
  authUri.searchParams.set('redirect_uri', REDIRECT_URI)
  authUri.searchParams.set('prompt', 'none')
  authUri.searchParams.set('response_type', 'code')
  authUri.searchParams.set('scope', 'identify')

  return response.redirect(HTTP_CODE.FOUND, authUri.toString())
}

async function exchangeCode (code) {
  const formData = new URLSearchParams()
  formData.set('client_id', ENV.DISCORD_CLIENT_ID)
  formData.set('client_secret', ENV.DISCORD_CLIENT_SECRET)
  formData.set('grant_type', 'authorization_code')
  formData.set('code', code)
  formData.set('redirect_uri', REDIRECT_URI)

  const response = await fetch(new URL(`${BASE_URL}/oauth2/token`).toString(), {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    body: formData
  }).then((data) => data.json())

  if (!response || isBlank(response.access_token)) {
    throw new Error('Getting Discord Access Token failed')
  }
  return response
}

async function getAuthorizationInformation (accessToken) {
  const response = await fetch(new URL(`${BASE_URL}/oauth2/@me`).toString(), {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`
    })
  }).then((data) => data.json())

  if (!response.application || !response.user) {
    throw new Error('Getting authorization information failed')
  }

  if (response.application.id !== ENV.DISCORD_CLIENT_ID) {
    throw new Error('Got information from another client id!?!?')
  }

  return response
}

function getAvatarUrl (authInfo) {
  if (authInfo.user.avatar === null) {
    const defaultAvatarNumber =
      Number.parseInt(authInfo.user.discriminator, 10) % 5
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png?size=512`
  }
  const format = authInfo.user.avatar.startsWith('a_') ? 'gif' : 'png'
  return `https://cdn.discordapp.com/avatars/${authInfo.user.id}/${authInfo.user.avatar}.${format}?size=512`
}

async function oAuthCallback (request, response) {
  const { code } = request.query

  if (isBlank(code)) {
    return response.redirect(LOGIN_ERROR_URI)
  }

  let accessTokenResponse
  try {
    accessTokenResponse = await exchangeCode(code.toString())
  } catch (error) {
    logger.error(error)
    return response.redirect(LOGIN_ERROR_URI)
  }

  let authInfo
  try {
    authInfo = await getAuthorizationInformation(
      accessTokenResponse.access_token
    )
  } catch (error) {
    logger.error(error)
    return response.redirect(LOGIN_ERROR_URI)
  }

  const imageUrl = getAvatarUrl(authInfo)

  let user = await prisma.user.findFirst({
    where: {
      accounts: {
        some: {
          provider_id: PROVIDER_ID,
          provider_account_id: authInfo.user.id
        }
      }
    },
    select: {
      username: true
    }
  })

  if (user) {
    await prisma.user.update({
      where: {
        username: user.username
      },
      data: {
        image: imageUrl
      }
    })
  } else {
    user = await prisma.user.create({
      data: {
        username: authInfo.user.id,
        display_name: authInfo.user.username,
        image: imageUrl,
        randkey: generateRandomKey(128),
        accounts: {
          create: {
            provider_id: PROVIDER_ID,
            provider_account_id: authInfo.user.id
          }
        }
      }
    })
  }

  request.session.username = user.username
  await request.session.save()

  return response.redirect(ENV.BASE_URL)
}

const handler = ncWithSession().get(oAuthCallback).post(generateAuthorizeUrl)

export default handler
