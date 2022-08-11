export const COINS = Object.freeze([
  {
    value: 'default',
    label: 'Overlay Default',
  },
  {
    value: 'animalcrossing',
    label: 'Animal Crossing Bell Bag',
  },
  {
    value: 'animalcrossing2',
    label: 'Animal Crossing Bell Coin',
  },
  {
    value: 'fortnite',
    label: 'Fortnite V-Bucks',
  },
  {
    value: 'justdance',
    label: 'Just Dance Mojo',
  },
  {
    value: 'mario',
    label: 'Mario Coin (2D)',
  },
  {
    value: 'mario2',
    label: 'Mario Coin (3D)',
  },
  {
    value: 'mario3',
    label: 'Mario Star Coin',
  },
  {
    value: 'money1',
    label: 'Dollar Bill',
  },
  {
    value: 'money2',
    label: 'Money Bag',
  },
  {
    value: 'reddit',
    label: 'Reddit Silver',
  },
  {
    value: 'reddit2',
    label: 'Reddit Gold',
  },
  {
    value: 'reddit3',
    label: 'Reddit Platinum',
  },
  {
    value: 'shekel',
    label: 'Shekel',
  },
  {
    value: 'zelda',
    label: 'Zelda Rupee',
  },
  {
    value: 'rhythmheaven',
    label: 'Rhythm Heaven (DS) Tutorial Coin',
  },
]);

export const isValidCoin = (value) =>
  COINS.some((coin) => coin.value === value);
