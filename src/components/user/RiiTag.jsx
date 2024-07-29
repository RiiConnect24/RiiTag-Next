import React from 'react'
import PropTypes from 'prop-types'

function LinkTag ({ username, name, updated_at: updatedAt }) {
  let source = `/${username}/tag.png`

  if (updatedAt) {
    source += `?${new Date(updatedAt).getTime()}`
  }

  return (
    <a href={`/${username}/tag.png`}>
      <img
        className='img-fluid'
        alt={`LinkTag of ${name}`}
        src={source}
        height={450}
        width={1200}
      />
    </a>
  )
}

LinkTag.propTypes = {
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  updated_at: PropTypes.string
}

LinkTag.defaultProps = {
  updated_at: null
}

export default LinkTag
