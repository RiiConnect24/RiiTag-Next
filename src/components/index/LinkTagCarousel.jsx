import React from 'react'
import PropTypes from 'prop-types'
import { Carousel } from 'react-bootstrap'
import Link from 'next/link'

function LinkTagCarousel ({ randomUsers }) {
  return (
    <Carousel variant='light' fade>
      {randomUsers.map((randomUser) => (
        <Carousel.Item key={randomUser.username}>
          <img
            className='d-block w-75 mx-auto mt-2'
            alt={`linktag of ${randomUser.display_name}`}
            src={`/${randomUser.username}/tag.max.png?${new Date(
              randomUser.updated_at
            ).getTime()}`}
          />
          <Carousel.Caption className='mb-3 text-light'>
            <p className='h4'>
              LinkTag of{' '}
              <Link href={`/user/${randomUser.username}`}>
                {randomUser.display_name}
              </Link>
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

LinkTagCarousel.propTypes = {
  randomUsers: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default LinkTagCarousel
