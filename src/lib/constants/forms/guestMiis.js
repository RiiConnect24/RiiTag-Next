export const GUEST_MIIS = Object.freeze([
  {
    value: 'unknown',
    label: 'Unknown',
  },
  {
    value: 'guestA',
    label: 'Guest A',
  },
  {
    value: 'guestB',
    label: 'Guest B',
  },
  {
    value: 'guestC',
    label: 'Guest C',
  },
  {
    value: 'guestD',
    label: 'Guest D',
  },
  {
    value: 'guestE',
    label: 'Guest E',
  },
  {
    value: 'guestF',
    label: 'Guest F',
  },
]);

export const isValidGuestMii = (value) =>
  GUEST_MIIS.some((mii) => mii.value === value);
