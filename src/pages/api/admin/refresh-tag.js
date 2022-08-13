import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { isBlank } from '@/lib/utils/utils';
import { getUserByUsername, userIsAdmin } from '@/lib/utils/databaseUtils';
import { makeBanner } from '@/lib/riitag/banner';
import logger from '@/lib/logger';
import { ncWithSession } from '@/lib/routing';

async function refreshTag(request, response) {
  const { username } = request.body;
  const actionUser = request.session?.username;

  if (!actionUser) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' });
  }

  if (isBlank(username)) {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' });
  }

  if (!(await userIsAdmin(actionUser))) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' });
  }

  const user = await getUserByUsername(username);

  if (!user) {
    return response.status(HTTP_CODE.NOT_FOUND).send({
      error: 'This user does not exist.',
    });
  }

  try {
    await makeBanner(user);
  } catch (error) {
    logger.error(error);
    return response.status(HTTP_CODE.INTERNAL_SERVER_ERROR).json({
      error: 'Error while creating tag.',
    });
  }

  return response.status(HTTP_CODE.OK).json({ success: true });
}

const handler = ncWithSession().post(refreshTag);

export default handler;
