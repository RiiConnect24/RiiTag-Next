import fs from 'node:fs';
import path from 'node:path';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { ncWithSession } from '@/lib/routing';
import prisma from '@/lib/db';
import logger from '@/lib/logger';
import { CACHE } from '@/lib/constants/filePaths';

async function exportData(request, response) {
  const username = request.session?.username;

  if (!username) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' });
  }

  try {
    await prisma.user.delete({
      where: {
        username,
      },
    });

    try {
      await fs.promises.rm(path.resolve(CACHE.AVATAR, `${username}.png`));
      await fs.promises.rm(path.resolve(CACHE.TAGS, `${username}.png`));
      await fs.promises.rm(path.resolve(CACHE.TAGS, `${username}.max.png`));
      await fs.promises.rm(path.resolve(CACHE.WADS, username), {
        recursive: true,
      });
    } catch {
      // It's okay when the above files don't exist
    }

    request.session.destroy();
    return response.status(HTTP_CODE.OK).send(null);
  } catch (error) {
    logger.error(error);
    return response.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send();
  }
}

const handler = ncWithSession().post(exportData);

export default handler;
