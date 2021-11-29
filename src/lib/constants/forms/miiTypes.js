export const MII_TYPES = Object.freeze([
  {
    value: 'guest',
    label: 'Guest Mii',
  },
  {
    value: 'cmoc',
    label: 'Check Mii Out Channel',
  },
]);

export const isValidMiiType = (value) =>
  MII_TYPES.some((miiType) => miiType.value === value);
