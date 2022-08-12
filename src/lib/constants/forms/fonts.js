export const FONTS = Object.freeze([
  {
    value: 'default',
    label: 'Overlay Default',
  },
  {
    value: 'RodinNTLG',
    label: 'RodinNTLG',
  },
  {
    value: 'NintendoLabo',
    label: 'Nintendo Labo',
  },
  {
    value: 'NintendoU',
    label: 'Nintendo Font U',
  },
  {
    value: 'NSMFU',
    label: 'New Super Mario Font U',
  },
  {
    value: 'Humming',
    label: 'Humming',
  },
  {
    value: 'PopHappiness',
    label: 'PopHappiness',
  },
  {
    value: 'Seurat',
    label: 'Seurat',
  },
  {
    value: 'SMMExtended',
    label: 'Super Mario Maker Extended',
  },
  {
    value: 'Splatfont',
    label: 'Splatfont',
  },
  {
    value: 'Splatfont2',
    label: 'Splatfont 2',
  },
]);

export const isValidFont = (value) =>
  FONTS.some((font) => font.value === value);
