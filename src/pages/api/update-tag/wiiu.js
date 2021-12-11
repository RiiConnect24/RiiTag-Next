import fs from 'node:fs';
import path from 'node:path';
import rateLimit from '@/lib/rate-limit';
import ENV from '@/lib/constants/environmentVariables';
import { nc } from '@/lib/routing';
import { isBlank } from '@/lib/utils/utils';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import {
  getWiiGameName,
  getWiiUGameIdByNameAndRegion,
  getWiiUGameName,
  updateRiiTag,
} from '@/lib/utils/riitagUtils';
import { DATA } from '@/lib/constants/filePaths';
import CONSOLE from '@/lib/constants/console';
import { makeBanner } from '@/lib/riitag/banner';
import logger from '@/lib/logger';
import { getUserByRandKey } from '@/lib/utils/databaseUtils';

const limiter = rateLimit({
  interval: ENV.IS_DEV ? 1 : 60_000, // 60 Seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

/*
 * Endpoint examples:
 * Cemu: /wiiu?key=dev&origin=Cemu&gameTID=SUPER%20MARIO%203D%20WORLD
 * Wii U: /wiiu?key=dev&gameTID=00050000101C9500
 * Wii U with VC Inject: /wiiu?key=dev&game=0005000252535050
 */
async function addWiiUGame(request, response) {
  const { key, origin, game } = request.query;
  let gameTID = isBlank(request.query.gameTID) ? game : request.query.gameTID;

  if (isBlank(key) || isBlank(gameTID) || gameTID.length > 255) {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .json({ error: 'Invalid data' });
  }

  try {
    await limiter.check(response, 3, key);
  } catch {
    return response
      .status(HTTP_CODE.TOO_MANY_REQUESTS)
      .json({ error: 'Rate limit exceeded' });
  }

  const user = await getUserByRandKey(key);

  if (!user) {
    return response.status(HTTP_CODE.UNAUTHORIZED).send({
      error: 'Invalid key.',
    });
  }

  gameTID = gameTID.replaceAll('%26', '&').replaceAll(' - ', '\n');

  if (!isBlank(origin) && origin === 'Cemu') {
    // Cemu uses the game title only, so we need to grab the titleid first
    gameTID = await getWiiUGameIdByNameAndRegion(gameTID, user.cover_region);
    if (!gameTID) {
      return response
        .status(HTTP_CODE.BAD_REQUEST)
        .send({ error: 'Game not found.' });
    }
  }

  gameTID = gameTID.toUpperCase();

  const wiiuIds = JSON.parse(
    await fs.promises.readFile(path.resolve(DATA.IDS, 'wiiu.json'), 'utf-8')
  );
  let gameConsole = CONSOLE.WII_U;
  let id6 = wiiuIds[gameTID];
  let gameName;

  if (!id6) {
    // Not found, likely a VC inject
    const wiiVCIds = JSON.parse(
      await fs.promises.readFile(path.resolve(DATA.IDS, 'wiiVC.json'), 'utf-8')
    );
    id6 = wiiVCIds[gameTID];
    if (!id6) {
      return response
        .status(HTTP_CODE.BAD_REQUEST)
        .send({ error: 'Game not found.' });
    }
    gameName = await getWiiGameName(id6);
    gameConsole = CONSOLE.WII;
  } else {
    gameName = await getWiiUGameName(id6);
  }

  try {
    const updatedUser = await updateRiiTag(user, id6, gameName, gameConsole);
    makeBanner(updatedUser);
  } catch (error) {
    logger.error(error);
    return response
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error updating RiiTag' });
  }

  return response.status(HTTP_CODE.OK).send();
}

const handler = nc().get(addWiiUGame);

export default handler;
