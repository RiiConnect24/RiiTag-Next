import path from 'node:path';
import { ncWithSession } from '@/lib/routing';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import logger from '@/lib/logger';
import { saveFile } from '@/lib/utils/fileUtils';
import { DATA } from '@/lib/constants/filePaths';
import { userIsAdmin } from '@/lib/utils/databaseUtils';

async function download(txtname) {
  const url = `https://www.gametdb.com/${txtname}.txt?LANG=ORIG`;

  logger.info(`Downloading ${txtname}.txt from ${url}`);
  const response = await fetch(url);

  if (response.status !== 200) {
    logger.error(`Failed downloading ${txtname}.txt`);
    return Promise.reject();
  }

  return saveFile(path.resolve(DATA.GAMETDB, `${txtname}.txt`), response.body);
}

async function updateGameTdb(request, response) {
  const username = request.session?.username;

  if (!username) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' });
  }

  if (!(await userIsAdmin(username))) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' });
  }

  await Promise.allSettled([
    download('wiitdb'),
    download('wiiutdb'),
    download('3dstdb'),
  ]);

  return response.status(HTTP_CODE.OK).send('OK!');
}

const handler = ncWithSession().post(updateGameTdb);

export default handler;
