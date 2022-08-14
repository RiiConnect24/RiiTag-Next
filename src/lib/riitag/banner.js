import fs from 'node:fs';
import path from 'node:path';
import Canvas from 'canvas';
import { CACHE, DATA, PUBLIC } from '@/lib/constants/filePaths';
import { exists, saveFile } from '@/lib/utils/fileUtils';
import logger from '@/lib/logger';
import prisma from '@/lib/db';
import CONSOLE from '@/lib/constants/console';
import COVER_TYPE from '@/lib/constants/coverType';
import { isBlank } from '@/lib/utils/utils';
import { getCover } from '@/lib/riitag/cover';
import { getMiiFromHexData, getMiiHexDataFromCMOC } from '@/lib/riitag/mii';

async function loadFonts() {
  const fontJsons = await fs.promises.readdir(DATA.FONTS);

  await Promise.all(
    fontJsons.map(async (fontJson) => {
      const font = JSON.parse(
        await fs.promises.readFile(path.resolve(DATA.FONTS, fontJson), 'utf8')
      );

      font.styles.map(async (fontStyle) => {
        Canvas.registerFont(path.resolve(DATA.FONTFILES, fontStyle.file), {
          family: font.family,
          weight: fontStyle.weight,
          style: fontStyle.style,
        });
      });
    })
  );
}

function getFont(overlay, user, type) {
  const defaultFont = 'RodinNTLG';

  if (overlay[type].font_family) {
    if (user.font === 'default' || overlay[type].force_font === 'true') {
      return overlay[type].font_family;
    }
    if (user.font) {
      return user.font;
    }
    return defaultFont;
  }
  return defaultFont;
}

/**
 *
 * @param {CanvasRenderingContext2D} context
 * @param {*} font
 * @param {*} size
 * @param {*} style
 * @param {*} color
 * @param {*} text
 * @param {*} x
 * @param {*} y
 * @param {*} align
 */
async function drawText(context, font, size, style, color, text, x, y, align) {
  context.font = `${style} ${size}px ${font}`;
  context.fillStyle = color;
  context.textAlign = align || 'left';
  context.fillText(text, size + x, size + y);
}

export async function getAvatar(username, image) {
  const filepath = path.resolve(CACHE.AVATAR, `${username}.png`);

  if (!(await exists(filepath))) {
    logger.info('Downloading avatar', image);
    const response = await fetch(image);
    if (!response.ok) {
      throw new Error(
        `Image download failed, got HTTP error ${response.status} from: ${image}`
      );
    }

    await saveFile(filepath, response.body);
  }

  return filepath;
}

export async function makeBanner(user) {
  await loadFonts();

  const overlayPath = path.resolve(DATA.OVERLAYS, `${user.overlay}.json`);
  if (!(await exists(overlayPath))) {
    throw new Error(`Overlay ${user.overlay}.json does not exist`);
  }
  const overlay = JSON.parse(await fs.promises.readFile(overlayPath, 'utf8'));

  const covStartX = overlay.cover_start_x;
  let covStartY = overlay.cover_start_y;
  const coverType = user.cover_type;

  if (coverType === COVER_TYPE.COVER) {
    covStartY += 24;
  } else if (coverType === COVER_TYPE.DISC) {
    covStartY += 88;
  }

  const covIncX = overlay.cover_increment_x;
  const covIncY = overlay.cover_increment_y;

  let covCurrentX = covStartX;
  let covCurrentY = covStartY;

  const canvas = new Canvas.Canvas(overlay.width, overlay.height);
  const context = canvas.getContext('2d');

  // Background image
  const bgPath = path.resolve(PUBLIC.BACKGROUND, user.background);
  if (!(await exists(bgPath))) {
    throw new Error(`Background ${user.background} does not exist`);
  }
  await context.drawImage(await Canvas.loadImage(bgPath), 0, 0);

  // Covers
  const playlog = await prisma.playlog.findMany({
    where: {
      user: {
        id: user.id,
      },
    },
    select: {
      game: {
        select: {
          game_id: true,
          console: true,
        },
      },
    },
    orderBy: {
      played_on: 'desc',
    },
    distinct: ['game_pk'],
    take: overlay.max_covers * 2,
  });

  if (playlog.length > 0) {
    const coverDownloads = playlog.map((logEntry) =>
      getCover(
        logEntry.game.console,
        coverType,
        logEntry.game.game_id,
        user.cover_region
      )
    );

    const coverPaths = await Promise.allSettled(coverDownloads).then(
      (results) =>
        results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value)
          .reverse()
          .slice(-overlay.max_covers)
    );

    // Need reducer for async in for-loop
    await coverPaths.reduce(async (promise, coverPath) => {
      await promise; // resolve last promise / skip for the first
      let inc = 0;
      const coverPathSegments = coverPath.split(path.sep);
      const consoleType = coverPathSegments[coverPathSegments.length - 4];

      if (consoleType === CONSOLE.THREEDS) {
        if (coverType === COVER_TYPE.COVER_3D) {
          inc = 15;
        } else if (coverType === COVER_TYPE.COVER) {
          inc = 80;
        }
      }

      await (consoleType === CONSOLE.THREEDS && coverType === COVER_TYPE.DISC
        ? // 3DS Cartridges need to be made smaller
        context.drawImage(
          await Canvas.loadImage(coverPath),
          covCurrentX,
          covCurrentY + inc,
          160,
          160
        )
        : context.drawImage(
          await Canvas.loadImage(coverPath),
          covCurrentX,
          covCurrentY + inc
        ));

      covCurrentX += covIncX;
      covCurrentY += covIncY;
    }, Promise.resolve());
  }

  // Overlay
  await context.drawImage(
    await Canvas.loadImage(
      path.resolve(PUBLIC.OVERLAY_IMAGE, overlay.overlay_img)
    ),
    0,
    0
  );

  // Flag
  const flagPath = path.resolve(PUBLIC.FLAG, `${user.flag}.png`);
  if (!(await exists(flagPath))) {
    throw new Error(`Flag ${user.flag}.png does not exist`);
  }
  await context.drawImage(
    await Canvas.loadImage(flagPath),
    overlay.flag.x,
    overlay.flag.y
  );

  // Coin Image
  const coinImage = user.coin === 'default' ? overlay.coin_icon.img : user.coin;
  const coinPath = path.resolve(PUBLIC.COIN, `${coinImage}.png`);
  if (!(await exists(coinPath))) {
    throw new Error(`Coin ${coinImage}.png does not exist`);
  }
  await context.drawImage(
    await Canvas.loadImage(coinPath),
    overlay.coin_icon.x,
    overlay.coin_icon.y
  );

  // Username
  await drawText(
    context,
    getFont(overlay, user, 'username'),
    overlay.username.font_size,
    overlay.username.font_style,
    overlay.username.font_color,
    user.name_on_riitag,
    overlay.username.x,
    overlay.username.y
  );

  // Comment / Friend Code
  if (!isBlank(user.comment)) {
    await drawText(
      context,
      getFont(overlay, user, 'friend_code'),
      overlay.friend_code.font_size,
      overlay.friend_code.font_style,
      overlay.friend_code.font_color,
      user.comment,
      overlay.friend_code.x,
      overlay.friend_code.y,
      overlay.friend_code.align || undefined
    );
  }

  // Coin Count
  await drawText(
    context,
    getFont(overlay, user, 'coin_count'),
    overlay.coin_count.font_size,
    overlay.coin_count.font_style,
    overlay.coin_count.font_color,
    user.coins > 9_999_999 ? 9_999_999 : user.coins, // Lars cheated again
    overlay.coin_count.x,
    overlay.coin_count.y
  );

  // Avatar
  if (user.show_avatar && overlay.avatar) {
    try {
      const avatarPath = await getAvatar(user.username, user.image);

      if (overlay.avatar.background) {
        await context.drawImage(
          await Canvas.loadImage(
            path.resolve(PUBLIC.OVERLAY_IMAGE, overlay.avatar.background)
          ),
          overlay.avatar.background_x,
          overlay.avatar.background_y,
          overlay.avatar.background_width,
          overlay.avatar.background_height
        );
      }

      await context.drawImage(
        await Canvas.loadImage(avatarPath),
        overlay.avatar.x,
        overlay.avatar.y,
        overlay.avatar.size,
        overlay.avatar.size
      );
    } catch {
      // Error handled beforehand
    }
  }

  // Mii
  if (user.show_mii && overlay.mii) {
    let miiPath = PUBLIC.BLANK_MII;

    switch (user.mii_type) {
      case 'guest':
        if (user.mii_data !== null) {
          miiPath = path.resolve(PUBLIC.GUEST_MIIS, `${user.mii_data}.png`);
        }
        break;
      case 'cmoc':
        miiPath = path.resolve(CACHE.CMOC_MIIS, `${user.cmoc_entry_no}.png`);
        if (!(await exists(miiPath))) {
          try {
            let miiHexData = user.mii_data;
            if (isBlank(miiHexData)) {
              miiHexData = await getMiiHexDataFromCMOC(user.cmoc_entry_no);
            }
            const mii = await getMiiFromHexData(miiHexData);
            await saveFile(miiPath, mii);
          } catch {
            miiPath = PUBLIC.BLANK_MII;
          }
        }
        break;
      case 'upload':
        miiPath = path.resolve(CACHE.MIIS, `${user.username}.png`);
        if (!(await exists(miiPath))) {
          try {
            const mii = await getMiiFromHexData(user.mii_data);
            await saveFile(miiPath, mii);
          } catch {
            miiPath = PUBLIC.BLANK_MII;
          }
        }
        break;
      default:
        throw new Error('Unsupported Mii Type.');
    }

    if (!(await exists(miiPath))) {
      logger.error(`Mii ${user.mii_data}.png does not exist`);
      miiPath = PUBLIC.BLANK_MII;
    }

    if (overlay.mii.background) {
      await context.drawImage(
        await Canvas.loadImage(
          path.resolve(PUBLIC.OVERLAY_IMAGE, overlay.avatar.background)
        ),
        overlay.mii.background_x,
        overlay.mii.background_y,
        overlay.mii.background_width,
        overlay.mii.background_height
      );
    }

    await context.drawImage(
      await Canvas.loadImage(miiPath),
      overlay.mii.x,
      overlay.mii.y,
      overlay.mii.size,
      overlay.mii.size
    );
  }

  await saveFile(
    path.resolve(CACHE.TAGS, `${user.username}.max.png`),
    canvas.createPNGStream()
  );

  const smallCanvas = new Canvas.Canvas(overlay.width / 3, overlay.height / 3);
  const smallContext = smallCanvas.getContext('2d');
  await smallContext.drawImage(
    canvas,
    0,
    0,
    overlay.width / 3,
    overlay.height / 3
  );

  await saveFile(
    path.resolve(CACHE.TAGS, `${user.username}.png`),
    smallCanvas.createPNGStream()
  );
}
