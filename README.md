# RiiTag Next

This is [RiiTag](https://tag.rc24.xyz) rewritten in [Next.js](https://nextjs.org/).

## Features

- Customizable Gamertag with a lot of options like backgrounds, fonts, etc.
- Automatically updating the tag works for Wii, Wii U, Cemu and Citra
- Game Leaderboards
- Collect coins when you play a game and show everyone what you have been playing!
- Shows every game with a cover from [GameTDB](https://gametdb.com)

## Requirements

- [NodeJS](https://nodejs.org/) v16+
- MySQL or MariaDB database
- [Sharpii .NET Core](https://github.com/TheShadowEevee/Sharpii-NetCore/releases) in `PATH` as `sharpii`
- Active internet connection

## Developing

1. `git clone https://github.com/...`
2. `npm i`
3. Copy `.env` to `.env.development.local` and fill it in (at least `DATABASE_URL` and `IRON_SECRET`, see table below)
4. `npm run dev:db-reset`
5. `npm run dev:start`
6. If you have changed the db scheme, create a migration with `npm run dev:db-create-migration`

## Deploy

1. Copy `.env` to `.env.production.local` and fill it in according to the table below
2. `npm ci --production`
3. `npm run prod:migrate`
4. `npm run prod:build`
5. `./node_modules/.bin/next start -p PORT`

In the "`deploy`" folder you can find configuration files for NGINX, Caddy and Systemd.

### Update

1. `git pull`
2. `npm ci --production`
3. `npm run prod:migrate`
4. `npm run prod:build`

### OAuth Setup

#### Discord

1. Visit https://discord.com/developers/applications
2. Create an application and edit it
3. Select "OAuth2" in the sidebar
4. Here you can find your Client ID and Secret
5. Add as a redirect: `http://localhost:3000/api/auth/login/discord` plus the equivalent production URL

#### Administration notes

You can set yourself as an administrator by chaing the "role" column to "admin" for your user. This will unlock an administration panel where you can add Terms of Services, a Privacy Policy and update the GameTDB titles list.

## Environment Variables

| Key                       | Description                                                     | Example                                        |
| ------------------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| NEXT_PUBLIC_BASE_URL      | Base URL of your instance                                       | https://tag.example.com                        |
| DATABASE_URL              | Connection String                                               | mysql://USER:PASSWORD@127.0.0.1:3306/DATABASE  |
| IRON_SECRET               | Secret for Iron to encrypt the cookie                           | stringwithatleast64chars                       |
| DISCORD_CLIENT_ID         | Discord Client ID                                               |                                                |
| DISCORD_CLIENT_SECRET     | Discord Client Secret                                           |                                                |
| TWITTER_API_KEY           | Twitter API Key                                                 |                                                |
| TWITTER_API_SECRET_KEY    | Twitter API Secret Key                                          |                                                |
| WEBPACK_ANALYZE           | Runs Webpack Analyzer on start                                  | true                                           |
| NEXT_PUBLIC_LOGGING_LEVEL | Logging Level                                                   | TRACE, DEBUG, INFO, WARNING, ERROR or CRITICAL |
| NEXT_PUBLIC_STAGING       | If the instance is a staging instance where data may be deleted | true                                           |
