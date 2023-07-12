import HTTP_CODE from '@/lib/constants/httpStatusCodes'
import { ncWithSession } from '@/lib/routing'
import ENV from '@/lib/constants/environmentVariables'
import logger from '@/lib/logger'
import { getRandKeyByUsername } from '@/lib/utils/databaseUtils'

const createTagXML = (key) =>
  `<?xml version="1.0" encoding="UTF-8"?><Tag URL="${ENV.BASE_URL}/wii?game={ID6}&amp;key={KEY}" Key="${key}"/>`

async function wiinnertag (request, response) {
  const username = request.session?.username

  if (!username) {
    return response.redirect(ENV.BASE_URL)
  }

  try {
    const user = await getRandKeyByUsername(username)

    response.setHeader('Content-Type', 'application/xml')
    return response.status(HTTP_CODE.OK).send(createTagXML(user.randkey))
  } catch (error) {
    logger.error(error)
    return response.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send()
  }
}

const handler = ncWithSession().get(wiinnertag)

export default handler
