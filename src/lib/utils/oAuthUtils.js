import Twitter from 'twitter-lite'
import ENV from '@/lib/constants/environmentVariables'
import prisma from '@/lib/db'

export const LOGIN_ERROR_URI = `${ENV.BASE_URL}/?error=1`

export async function linkAccount (providerId, providerAccountId, username) {
  await prisma.account.create({
    data: {
      provider_id: providerId,
      provider_account_id: providerAccountId,
      user: {
        connect: {
          username
        }
      }
    }
  })
}

export const twitter = new Twitter({
  consumer_key: ENV.TWITTER_API_KEY,
  consumer_secret: ENV.TWITTER_API_SECRET
})
