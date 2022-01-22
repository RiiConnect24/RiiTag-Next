export const MII_TYPE = Object.freeze({
  GUEST: 'guest',
  CMOC: 'cmoc',
  UPLOAD: 'upload',
});

export const isValidMiiType = (value) =>
  [MII_TYPE.GUEST, MII_TYPE.CMOC, MII_TYPE.UPLOAD].includes(value);
