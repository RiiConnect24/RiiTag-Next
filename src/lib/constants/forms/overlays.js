export const OVERLAYS = Object.freeze([
  {
    value: 'overlay1',
    label: 'Modern Dark',
  },
  {
    value: 'overlay2',
    label: 'Modern Light',
  },
  {
    value: 'overlay3',
    label: 'Small',
  },
  {
    value: 'overlay4',
    label: 'Bottom Bar Dark',
  },
  {
    value: 'overlay5',
    label: 'Bottom Bar Light',
  },
  {
    value: 'overlay6',
    label: 'Wii Menu',
  },
  {
    value: 'overlay7',
    label: 'Flat Dark',
  },
]);

export const isValidOverlay = (value) =>
  OVERLAYS.some((overlay) => overlay.value === value);
