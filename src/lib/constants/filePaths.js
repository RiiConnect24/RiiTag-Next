import path from 'node:path';

const DATA_PATH = path.resolve(process.cwd(), 'data');
const CACHE_PATH = path.resolve(DATA_PATH, 'cache');

const PUBLIC_PATH = path.resolve(process.cwd(), 'public');
const IMG_PATH = path.resolve(PUBLIC_PATH, 'img');

export const CACHE = Object.freeze({
  AVATAR: path.resolve(CACHE_PATH, 'avatar'),
  CMOC_MIIS: path.resolve(CACHE_PATH, 'mii', 'cmoc'),
  COVER: path.resolve(CACHE_PATH, 'cover'),
  TAGS: path.resolve(CACHE_PATH, 'tags'),
  WADS: path.resolve(CACHE_PATH, 'wads'),
});

export const PUBLIC = Object.freeze({
  BACKGROUND: path.resolve(IMG_PATH, 'background'),
  COIN: path.resolve(IMG_PATH, 'coin'),
  FLAG: path.resolve(IMG_PATH, 'flag'),
  GUEST_MIIS: path.resolve(IMG_PATH, 'miis', 'guests'),
  OVERLAY_IMAGE: path.resolve(IMG_PATH, 'overlay'),
  NOCOVER: path.resolve(PUBLIC_PATH, 'nocover.png'),
  UNKNOWN_MII: path.resolve(IMG_PATH, 'miis', 'guests', 'unknown.png'),
});

export const DATA = Object.freeze({
  FONTFILES: path.resolve(DATA_PATH, 'fontfiles'),
  FONTS: path.resolve(DATA_PATH, 'fonts'),
  GAMETDB: path.resolve(DATA_PATH, 'gametdb'),
  IDS: path.resolve(DATA_PATH, 'ids'),
  OVERLAYS: path.resolve(DATA_PATH, 'overlays'),
  WADS: path.resolve(DATA_PATH, 'wads'),
});
