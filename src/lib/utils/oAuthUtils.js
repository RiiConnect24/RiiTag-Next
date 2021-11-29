import Twitter from 'twitter-lite';
import ENV from '@/lib/constants/environmentVariables';
import prisma from '@/lib/db';

export const LOGIN_ERROR_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/?error=1`;

export async function linkAccount(provider_id, provider_account_id, username) {
  await prisma.account.create({
    data: {
      provider_id,
      provider_account_id,
      user: {
        connect: {
          username,
        },
      },
    },
  });
}

export const twitter = new Twitter({
  consumer_key: ENV.TWITTER_API_KEY,
  consumer_secret: ENV.TWITTER_API_SECRET,
});
