import path from 'node:path';
import COVER_TYPE from '@/lib/constants/coverType';
import CONSOLE from '@/lib/constants/console';
import { CACHE } from '@/lib/constants/filePaths';
import { exists, saveFile } from '@/lib/utils/fileUtils';
import logger from '@/lib/logger';

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
    case 'P':
      return 'EN';
    case 'E':
      return 'US';
    case 'J':
      return 'JA';
    case 'K':
      return 'KO';
    case 'W':
      return 'TW';
    default:
      return 'EN';
  }
}

function get3DSGameRegion(gameId) {
  switch (gameId.charAt(3)) {
    case 'P':
      return 'EN';
    case 'E':
      return 'US';
    case 'J':
      return 'JA';
    case 'K':
      return 'KO';
    case 'W':
      return 'ZH';
    default:
      return 'EN';
  }
}

// Returns the game's region from the TID
export function getGameRegion(gameConsole, gameId) {
  switch (gameConsole) {
    case CONSOLE.THREEDS:
      return get3DSGameRegion(gameId);
    case CONSOLE.WII:
    case CONSOLE.WII_U:
      return getWiiGameRegion(gameId);
    default:
      throw new Error('Console must be one of wii, wiiu, 3ds');
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
  if (gameConsole === CONSOLE.THREEDS && coverType === COVER_TYPE.COVER_3D) {
    // 3DS has no 'cover3D'; it's named 'box' instead
    coverType = COVER_TYPE.BOX;
  }

  if (gameConsole === CONSOLE.THREEDS && coverType === COVER_TYPE.DISC) {
    // 3DS has no discs obviously
    coverType = COVER_TYPE.CART;
  }

  if (region !== getGameRegion(gameConsole, gameId)) {
    try {
      // User-provided region that's not the same from the game
      // (e.g. japanese cover for korean game)
      return await downloadCover(gameConsole, coverType, region, gameId);
    } catch {
      try {
        // Now we try the default cover-region (e.g. korea for korean game)
        return await downloadCover(
          gameConsole,
          coverType,
          getGameRegion(gameConsole, gameId),
          gameId
        );
      } catch {
        try {
          // Fallback to EN
          return await downloadCover(gameConsole, coverType, 'EN', gameId);
        } catch {
          // Fallback to US
          return downloadCover(gameConsole, coverType, 'US', gameId);
        }
      }
    }
  } else {
    try {
      // Default region for game
      return await downloadCover(gameConsole, coverType, region, gameId);
    } catch {
      try {
        // Fallback to EN
        return await downloadCover(gameConsole, coverType, 'EN', gameId);
      } catch {
        // Fallback to US
        return downloadCover(gameConsole, coverType, 'US', gameId);
      }
    }
  }
}
