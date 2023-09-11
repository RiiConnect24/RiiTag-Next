import { ncWithSession } from '@/lib/routing';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import prisma from '@/lib/db';
import { isBlank } from '@/lib/utils/utils';
import logger from '@/lib/logger';
import { userIsAdmin } from '@/lib/utils/databaseUtils';

const validPaths = Object.freeze(['about', 'privacy-policy', 'tos']);

async function updateText(request, response) {
  const { text, path } = request.body;
  const username = request.session?.username;

  if (!username) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' });
  }

  if (isBlank(text) || isBlank(path) || !validPaths.includes(path)) {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' });
  }

  if (!(await userIsAdmin(username))) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' });
  }

  try {
    await prisma.sys.upsert({
      where: {
        key: path,
      },
      update: {
        value: text,
      },
      create: {
        key: path,
        value: text,
      },
    });
  } catch (error) {
    logger.error(error);
    return response
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error updating RiiTag' });
  }

  return response.status(HTTP_CODE.OK).json({ success: 'Text updated.' });
}

const handler = ncWithSession().patch(updateText);

export default handler;
