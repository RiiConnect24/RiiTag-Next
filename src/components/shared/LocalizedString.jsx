import React from 'react'
import PropTypes from 'prop-types'
import LanguageContext from './LanguageContext'
import parse from 'html-react-parser'

function LocalizedString ({ string, values = [] }) {
  return (
    <LanguageContext.Helper.Consumer>
        {(lang) => {
          return parse(formatString(LanguageContext.languages[lang][string], values))
        }}
    </LanguageContext.Helper.Consumer>
  )
}

function formatString (string, values) {
  let formattedString = string
  for (let i = 0; i < values.length; i++) {
    formattedString = formattedString.replace(`{${i}}`, values[i])
  }
  return formattedString
}

LocalizedString.propTypes = {
  string: PropTypes.string.isRequired,
  values: PropTypes.array
}

export default LocalizedString
