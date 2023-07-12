export const COVER_REGIONS = Object.freeze([
  {
    value: 'EN',
    label: 'English (General)'
  },
  {
    value: 'AU',
    label: 'Australia'
  },
  {
    value: 'DK',
    label: 'Denmark'
  },
  {
    value: 'FR',
    label: 'France'
  },
  {
    value: 'DE',
    label: 'Germany'
  },
  {
    value: 'FI',
    label: 'Finland'
  },
  {
    value: 'IT',
    label: 'Italy'
  },
  {
    value: 'JP',
    label: 'Japan'
  },
  {
    value: 'NL',
    label: 'Netherlands'
  },
  {
    value: 'NO',
    label: 'Norway'
  },
  {
    value: 'PT',
    label: 'Poland'
  },
  {
    value: 'KO',
    label: 'South Korea'
  },
  {
    value: 'ES',
    label: 'Spain'
  },
  {
    value: 'SE',
    label: 'Sweden'
  },
  {
    value: 'TW',
    label: 'Taiwan'
  },
  {
    value: 'TR',
    label: 'Turkey'
  }
])

export const isValidCoverRegion = (value) =>
  COVER_REGIONS.some((coverRegion) => coverRegion.value === value)
