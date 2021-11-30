import { withIronSessionSsr } from 'iron-session/next';
import { ironSession } from 'iron-session/express';
import ENV from './constants/environmentVariables';

const sessionOptions = {
  cookieName: 'session',
  password: ENV.IRON_SECRET || '',
  cookieOptions: {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: !ENV.IS_DEV,
  },
};

export const session = ironSession(sessionOptions);

export function withSession(handler) {
  return withIronSessionSsr(handler, sessionOptions);
}
