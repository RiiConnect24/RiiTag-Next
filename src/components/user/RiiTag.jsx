import React from 'react'
import PropTypes from 'prop-types'

function RiiTag ({ username, name, updated_at: updatedAt }) {
  let source = `/${username}/tag.max.png`

  if (updatedAt) {
    source += `?${new Date(updatedAt).getTime()}`
  }

  return (
    <a href={`/${username}/tag.max.png`}>
      <img
        className='img-fluid'
        alt={`RiiTag of ${name}`}
        src={source}
        height={450}
        width={1200}
      />
    </a>
  )
}

RiiTag.propTypes = {
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  updated_at: PropTypes.string
}

RiiTag.defaultProps = {
  updated_at: null
}

export default RiiTag
