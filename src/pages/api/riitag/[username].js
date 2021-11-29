import path from 'node:path';
import fs from 'node:fs';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { nc } from '@/lib/routing';
import prisma from '@/lib/db';
import { CACHE } from '@/lib/constants/filePaths';
import { exists } from '@/lib/utils/fileUtils';
import { makeBanner } from '@/lib/riitag/banner';
import logger from '@/lib/logger';
import { setFileHeaders } from '@/lib/utils/utils';

async function getRiitag(request, response) {
  const { username } = request.query;
  const max = request.query.max === 'true';

  const user = await prisma.user.findUnique({
    where: {
      username: username.toString(),
    },
  });

  if (user === null) {
    return response
      .status(HTTP_CODE.NOT_FOUND)
      .send({ error: 'User not found' });
  }

  const filepath = path.resolve(
    CACHE.TAGS,
    max ? `${user.username}.max.png` : `${user.username}.png`
  );

  if (!(await exists(filepath))) {
    try {
      await makeBanner(user);
    } catch (error) {
      logger.error(error);
      return response
        .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
        .send({ error: 'Error while creating tag.' });
    }
  }

  response.setHeader('Content-Type', 'image/png');
  setFileHeaders(response, `riitag-${username}.png`);
  return response.status(200).send(await fs.promises.readFile(filepath));
}

const handler = nc().get(getRiitag);

export default handler;
