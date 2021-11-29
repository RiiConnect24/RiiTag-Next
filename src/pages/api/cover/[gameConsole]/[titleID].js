import fs from 'node:fs';
import { nc } from '@/lib/routing';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { setFileHeaders } from '@/lib/utils/utils';
import CONSOLE from '@/lib/constants/console';
import COVER_TYPE from '@/lib/constants/coverType';
import { getCover, getGameRegion } from '@/lib/riitag/cover';
import logger from '@/lib/logger';
import { PUBLIC } from '@/lib/constants/filePaths';

const validConsoles = new Set([CONSOLE.WII, CONSOLE.WII_U, CONSOLE.THREEDS]);

function getCoverType(gameConsole) {
  if (gameConsole === CONSOLE.THREEDS) {
    return COVER_TYPE.BOX;
  }
  return COVER_TYPE.COVER_3D;
}

/* Endpoint examples:
 * /api/cover/wii/RSBP01
 * /api/cover/wiiu/ARDE01
 * /api/cover/3ds/AREE
 * /api/cover/abc/ABC <- should return invalid data
 * /api/cover/wii/AAAA <- should return nocover
 */
async function cover(request, response) {
  const { gameConsole, titleID } = request.query;

  if (titleID.length < 4 || !validConsoles.has(gameConsole)) {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' });
  }

  let filepath = null;
  try {
    filepath = await getCover(
      gameConsole,
      getCoverType(gameConsole),
      titleID,
      getGameRegion(gameConsole, titleID)
    );
  } catch (error) {
    logger.error(error.message);
    response.setHeader('Content-Type', 'image/png');
    setFileHeaders(response, 'nocover.png');
    return response
      .status(HTTP_CODE.NOT_FOUND)
      .send(await fs.promises.readFile(PUBLIC.NOCOVER));
  }

  const filename = filepath.endsWith('png')
    ? `${titleID}.png`
    : `${titleID}.jpg`;
  response.setHeader(
    'Content-Type',
    filepath.endsWith('png') ? 'image/png' : 'image/jpeg'
  );
  setFileHeaders(response, filename);
  return response
    .status(HTTP_CODE.OK)
    .send(await fs.promises.readFile(filepath));
}

const handler = nc().get(cover);

export default handler;
