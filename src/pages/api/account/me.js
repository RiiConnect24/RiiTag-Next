import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { ncWithSession } from '@/lib/routing';
import prisma from '@/lib/db';

async function getInfo(request, response) {
  const username = request.session?.username;

  if (!username) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      username: true,
      role: true,
      name_on_riitag: true,
      image: true,
      randkey: true,
      accounts: {
        select: {
          provider_id: true,
          provider_account_id: true,
          created_at: true,
        },
      },
    },
  });

  return response.status(HTTP_CODE.OK).json(user);
}

const handler = ncWithSession().get(getInfo);

export default handler;
