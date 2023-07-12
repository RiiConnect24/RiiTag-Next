const ENV = Object.freeze({
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  IRON_SECRET: process.env.IRON_SECRET,
  IS_DEV: process.env.NODE_ENV === 'development',
  STAGING: process.env.NEXT_PUBLIC_STAGING,
  TWITTER_API_KEY: process.env.TWITTER_API_KEY,
  TWITTER_API_SECRET: process.env.TWITTER_API_SECRET_KEY
})

export default ENV
