import fs from 'node:fs';
import { exec } from 'node:child_process';
import path from 'node:path';

import { promisify } from 'node:util';
import { nc } from '@/lib/routing';
import prisma from '@/lib/db';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { setFileHeaders } from '@/lib/utils/utils';
import { CACHE, DATA } from '@/lib/constants/filePaths';
import ENV from '@/lib/constants/environmentVariables';
import { exists } from '@/lib/utils/fileUtils';
import logger from '@/lib/logger';

const execAsync = promisify(exec);
const writeAsync = promisify(fs.write);

const BASE_WAD = Object.freeze(path.resolve(DATA.WADS, 'riitag.wad'));
const BASE_URL = ENV.BASE_URL.replace('https://', '').replace('http://', '');

async function getRiiTagChannel(request, response) {
  const { username } = request.query;
  const user = await prisma.user.findUnique({
    where: {
      username: username.toString(),
    },
    select: {
      username: true,
    },
  });

  if (user === null) {
    return response
      .status(HTTP_CODE.NOT_FOUND)
      .send({ error: 'User not found' });
  }
  const filepath = path.resolve(CACHE.WADS, user.username, 'riitag.wad');
  const workdir = path.resolve(CACHE.WADS, user.username, 'workdir');

  let file = null;
  if (!(await exists(filepath))) {
    try {
      const text = `${BASE_URL}/${user.username}/tag.max.png`;
      await execAsync(`sharpii WAD -u ${BASE_WAD} ${workdir}`);

      file = await fs.promises.open(
        path.resolve(workdir, '00000001.app'),
        'r+'
      );
      await writeAsync(file.fd, text, 0x1_f3_a4, 'utf8');
      await file.close();

      await execAsync(`sharpii WAD -p ${workdir} ${filepath} `);
    } catch (error) {
      logger.error(error);
      return response
        .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
        .send({ error: 'Error while creating WAD.' });
    } finally {
      if (file !== null) {
        try {
          file.close();
        } catch {
          // shrug
        }
      }
      try {
        if (await exists(workdir)) {
          await fs.promises.rm(workdir, { maxRetries: 3, recursive: true });
        }
      } catch {
        logger.error(`Error while deleting ${workdir}`);
      }
    }
  }

  response.setHeader('Content-Type', 'application/octet-stream');
  setFileHeaders(response, 'riitag.wad');
  return response
    .status(HTTP_CODE.OK)
    .send(await fs.promises.readFile(filepath));
}

const handler = nc().get(getRiiTagChannel);

export default handler;
