import fs from 'node:fs';
import path from 'node:path';
import COVER_TYPE from '@/lib/constants/coverType';
import CONSOLE from '@/lib/constants/console';
import { CACHE } from '@/lib/constants/filePaths';
import { DATA } from '@/lib/constants/filePaths';
import { exists, saveFile } from '@/lib/utils/fileUtils';
import { isBlank } from '@/lib/utils/utils';
import logger from '@/lib/logger';
import { getUserByRandKey } from '@/lib/utils/databaseUtils';
const xml2js = require('xml2js');

function getCoverUrl(gameConsole, coverType, region, gameId, extension) {
  return `https://art.gametdb.com/${gameConsole}/${coverType}/${region}/${gameId}.${extension}`;
}

function getExtension(coverType, gameConsole) {
  if (gameConsole !== CONSOLE.WII && coverType === COVER_TYPE.COVER) {
    return 'jpg';
  }
  return 'png';
}

function getWiiGameRegion(gameId) {
  switch (gameId.charAt(3)) {
    case 'P': {
      return 'EN';
    }
    case 'E': {
      return 'US';
    }
    case 'J': {
      return 'JA';
    }
    case 'K': {
      return 'KO';
    }
    case 'W': {
      return 'TW';
    }
    default: {
      return 'EN';
    }
  }
}

function get3DSGameRegion(gameId) {
  switch (gameId.charAt(3)) {
    case 'P': {
      return 'EN';
    }
    case 'E': {
      return 'US';
    }
    case 'J': {
      return 'JA';
    }
    case 'K': {
      return 'KO';
    }
    case 'W': {
      return 'ZH';
    }
    default: {
      return 'EN';
    }
  }
}

export async function getSwitchGameRegion(gameId) {
  const ids = JSON.parse(
    await fs.promises.readFile(path.resolve(DATA.IDS, 'switchtdb.json'), 'utf8')
  );

  try {
    const data = await fs.promises.readFile(
      path.resolve(DATA.IDS, 'switchtdb.xml'),
      'utf-8'
    );

    const result = await new Promise((resolve, reject) => {
      xml2js.parseString(data, (parseErr, parseResult) => {
        if (parseErr) {
          reject(parseErr);
        } else {
          resolve(parseResult);
        }
      });
    });

    const games = result.datafile.game;

    async function findRegionByGameId(gameId) {
      let regions = null;
      games.forEach(game => {
        if (game.id[0] === gameId) {
          regions = game.region[0].split(',').map(region => region.trim());
        }
      });
      return regions;
    }

    const region = await findRegionByGameId(gameId);

    for (const gameRegion of region) {
      // Europe
      if (gameRegion === "FRA") {
        return "FR";
      }
      if (gameRegion === "DEU") {
        return "DE";
      }
      if (gameRegion === "ESP") {
        return "ES";
      }
      if (gameRegion === "AUS") {
        return "AU";
      }
      if (gameRegion === "EUR") {
        return "EN";
      }
      if (gameRegion === "KOR") {
        return "KO";
      }
      if (gameRegion === "TWN") {
        return "TW";
      }

      // Japan
      if (gameRegion === "JPN") {
        return "JP";
      }

      // USA
      if (gameRegion === "USA") {
        return "US";
      }

      if (gameRegion === "ALL") {
        return "EN";
      }
    }

    return null; // Game ID not found
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Returns the game's region from the TID
export async function getGameRegion(gameConsole, gameId) {
  switch (gameConsole) {
    case CONSOLE.THREEDS: {
      return get3DSGameRegion(gameId);
    }
    case CONSOLE.WII:
    case CONSOLE.WII_U: {
      return getWiiGameRegion(gameId);
    }
    case CONSOLE.SWITCH: {
      return getSwitchGameRegion(gameId);
    }
    default: {
      throw new Error('Console must be one of wii, wiiu, 3ds');
    }
  }
}

// Downloads a given cover - doesn't handle fallbacks!
async function downloadCover(gameConsole, coverType, region, gameId) {
  const filepath = path.resolve(
    CACHE.COVER,
    gameConsole,
    coverType,
    region,
    `${gameId}.${getExtension(coverType, gameConsole)}`
  );

  if (await exists(filepath)) {
    return filepath;
  }

  const url = getCoverUrl(
    gameConsole,
    coverType,
    region,
    gameId,
    getExtension(coverType, gameConsole)
  );
  logger.info(`Downloading cover ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Image download failed, got HTTP error ${response.status} from GameTDB: ${url}`,
      false
    );
  }

  await saveFile(filepath, response.body);
  return filepath;
}

// Handles cover fallbacks
export async function getCover(gameConsole, coverType, gameId, region) {
  if (gameConsole === CONSOLE.THREEDS && coverType === COVER_TYPE.COVER_3D || gameConsole === CONSOLE.SWITCH && coverType === COVER_TYPE.COVER_3D) {
    // 3DS has no 'cover3D'; it's named 'box' instead
    coverType = COVER_TYPE.BOX;
  }

  if (gameConsole === CONSOLE.THREEDS && coverType === COVER_TYPE.DISC || gameConsole === CONSOLE.SWITCH && coverType === COVER_TYPE.DISC) {
    // 3DS has no discs obviously
    coverType = COVER_TYPE.CART;
  }

  const gameRegion = await getGameRegion(gameConsole, gameId);

  if (region === gameRegion) {
    try {
      // Default region for game
      logger.debug('Cover DL: Default region for game');
      return await downloadCover(gameConsole, coverType, region, gameId);
    } catch {
      try {
        // Fallback to EN
        logger.debug('Cover DL: Falling back to EN');
        return await downloadCover(gameConsole, coverType, 'EN', gameId);
      } catch {
        // Fallback to US
        logger.debug('Cover DL: Falling back to US');
        return downloadCover(gameConsole, coverType, 'US', gameId);
      }
    }
  } else {
    try {
      // User-provided region that's not the same from the game
      // (e.g. japanese cover for korean game)
      logger.debug(
        "Cover DL: User-provided region doesn't match game's region"
      );

      // US games
      if (gameRegion === 'US') {
        logger.debug('Cover DL: Game region is US -> using US!');
        region = 'US';
      }

      // Japanese games
      if (gameRegion === 'JA') {
        logger.debug('Cover DL: Game region is JA -> using JA!');
        region = 'JA';
      }

      // Korean games
      if (gameRegion === 'KO') {
        logger.debug('Cover DL: Game region is KO -> using KO!');
        region = 'KO';
      }

      return await downloadCover(gameConsole, coverType, region, gameId);
    } catch {
      try {
        // Now we try the default cover-region (e.g. korea for korean game)
        logger.debug("Cover DL: Trying default region for game's region");
        return await downloadCover(
          gameConsole,
          coverType,
          getGameRegion(gameConsole, gameId),
          gameId
        );
      } catch {
        try {
          // Fallback to EN
          logger.debug('Cover DL: Falling back to EN');
          return await downloadCover(gameConsole, coverType, 'EN', gameId);
        } catch {
          // Fallback to US
          logger.debug('Cover DL: Falling back to US');
          return downloadCover(gameConsole, coverType, 'US', gameId);
        }
      }
    }
  }
}
