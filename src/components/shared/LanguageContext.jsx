import React from 'react'

const languages = {
  en: require('../../../locales/en.json'),
  en_uk: require('../../../locales/en_uk.json'),
  jp: require('../../../locales/jp.json')
}

const Helper = React.createContext('en')

export default {
  Helper,
  languages
}
