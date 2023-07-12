import React from 'react'
import PropTypes from 'prop-types'

function Contributor ({ name, link, children }) {
  return (
    <li>
      <strong>
        {link
          ? (
            <a href={link} target='_blank' rel='external noopener noreferrer'>
              {name}
            </a>
            )
          : (
              name
            )}
      </strong>
      : {children}
    </li>
  )
}

Contributor.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string,
  children: PropTypes.node.isRequired
}

Contributor.defaultProps = {
  link: null
}

export default Contributor
