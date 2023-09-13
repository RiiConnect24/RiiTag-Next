import React from 'react'

const languages = {
  en: require('../../../locales/en.json'),
  jp: require('../../../locales/jp.json')
}

const Helper = React.createContext('en')

export default {
  Helper,
  languages
}
