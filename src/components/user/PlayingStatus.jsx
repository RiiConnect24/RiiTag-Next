import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import moment from 'moment/moment'

function PlayingStatus ({ session, games: sessions }) {
  return (
    sessions.map((session, index) => (
      <Card key={index} className='mb-3' bg='success' text='white'>
        <Card.Header as='h5'>Now Playing</Card.Header>
        <Card.Body>
          <ul className='list-unstyled m-0'>
            <li><b>Game:</b> {session.game.name}</li>
            <li><b>Started Playing:</b> {moment(session.game.start_time).from()}</li>
          </ul>
        </Card.Body>
      </Card>
    ))
  )
}

PlayingStatus.propTypes = {
  session: PropTypes.object.isRequired,
  game: PropTypes.array.isRequired
}

export default PlayingStatus
