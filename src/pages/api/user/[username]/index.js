import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { nc } from '@/lib/routing';
import prisma from '@/lib/db';

async function getUserByUsername(request, response) {
  const { username } = request.query;
  const user = await prisma.user.findUnique({
    where: {
      username: username.toString(),
    },
    select: {
      username: true,
      name_on_riitag: true,
      image: true,
    },
  });

  if (user === null) {
    return response
      .status(HTTP_CODE.NOT_FOUND)
      .send({ error: 'User not found' });
  }

  return response.status(HTTP_CODE.OK).json(user);
}

const handler = nc().get(getUserByUsername);

export default handler;
