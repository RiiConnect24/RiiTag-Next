import React from 'react'
import PropTypes from 'prop-types'

function LinkTag ({ username, name, updated_at: updatedAt }) {
  let source = `/${username}/tag.max.png`

  source += `?${new Date(updatedAt || new Date().getDate()).getTime()}`

  return (
    <a href={`/${username}/tag.max.png`}>
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
