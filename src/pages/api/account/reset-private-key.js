import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { ncWithSession } from '@/lib/routing';
import prisma from '@/lib/db';
import { generateRandomKey } from '@/lib/utils/utils';
import logger from '@/lib/logger';

async function resetKey(request, response) {
  const username = request.session?.username;

  if (!username) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.update({
      where: {
        username,
      },
      data: {
        randkey: generateRandomKey(128),
      },
    });
    return response.status(HTTP_CODE.OK).json({
      randkey: user.randkey,
    });
  } catch (error) {
    logger.error(error);
    return response.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send();
  }
}

const handler = ncWithSession().post(resetKey);

export default handler;
