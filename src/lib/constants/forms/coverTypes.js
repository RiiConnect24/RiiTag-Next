export const COVER_TYPES = Object.freeze([
  {
    value: 'cover3D',
    label: '3D Cover'
  },
  {
    value: 'cover',
    label: '2D Cover'
  },
  {
    value: 'disc',
    label: 'Discs & Cartridges'
  }
])

export const isValidCoverType = (value) =>
  COVER_TYPES.some((coverType) => coverType.value === value)
