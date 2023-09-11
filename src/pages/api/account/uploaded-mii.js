import fs from 'node:fs';
import path from 'node:path';
import { ncWithSession } from '@/lib/routing';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import prisma from '@/lib/db';
import { MII_TYPE } from '@/lib/constants/miiType';
import { setFileHeaders } from '@/lib/utils/utils';
import { CACHE, PUBLIC } from '@/lib/constants/filePaths';
import { exists, saveFile } from '@/lib/utils/fileUtils';
import { getMiiFromHexData } from '@/lib/riitag/mii';
import logger from '@/lib/logger';

async function getMyUploadedMii(request, response) {
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
      mii_type: true,
      mii_data: true,
    },
  });

  if (user.mii_type !== MII_TYPE.UPLOAD) {
    response.setHeader('Content-Type', 'image/png');
    setFileHeaders(response, 'unknown.png');
    return response
      .status(HTTP_CODE.NOT_FOUND)
      .send(await fs.promises.readFile(PUBLIC.UNKNOWN_MII));
  }

  const filepath = path.resolve(CACHE.MIIS, `${user.username}.png`);
  if (!(await exists(filepath))) {
    // Download first
    try {
      const mii = await getMiiFromHexData(user.mii_data);
      await saveFile(filepath, mii);
    } catch (error) {
      logger.error(error);
      response.setHeader('Content-Type', 'image/png');
      setFileHeaders(response, 'unknown.png');
      return response
        .status(HTTP_CODE.NOT_FOUND)
        .send(await fs.promises.readFile(PUBLIC.UNKNOWN_MII));
    }
  }

  response.setHeader('Content-Type', 'image/png');
  setFileHeaders(response, `${user.username}.png`);
  return response
    .status(HTTP_CODE.OK)
    .send(await fs.promises.readFile(filepath));
}

const handler = ncWithSession().get(getMyUploadedMii);

export default handler;
