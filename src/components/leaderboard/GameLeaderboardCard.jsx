import React from 'react'
import PropTypes from 'prop-types'
import dayjs from '@/lib/dayjs'
import { Card, Col } from 'react-bootstrap'
import moment from 'moment'
import LocalizedString from '../shared/LocalizedString'
import LanguageContext from '../shared/LanguageContext'

function GameLeaderboardCard ({ game }) {
  function getTimeStamp (time) {
    const duration = moment.duration(time, 'seconds')
    return duration.humanize()
  }

  return (
    <LanguageContext.Helper.Consumer>
      {(lang) => (
        <Col key={game.game_pk}>
          <Card className='h-100 contain-content' bg='secondary' text='white'>
            <Card.Header as='h5' className='h-100'>
              {game.game_pk === null ? 'Unknown Game' : game.game.name} - <a href={`/user/${game.user.username}`}>{game.user.display_name}</a>
            </Card.Header>
            <Card.Body className='d-flex justify-content-center'>
              <img
                alt={game.name === null ? 'Unknown Game' : game.game.name}
                src={`/api/cover/${game.game.console}/${game.game.game_id}`}
              />
              <a href={`/user/${game.user.username}`}>
                <img
                  style={{ borderRadius: '50%' }}
                  src={game.user.image}
                  width={96}
                  height={96}
                />
              </a>
            </Card.Body>
            <Card.Footer>
              <LocalizedString string='playtimes_since' values={[game.play_count, dayjs(game.played_on).format(LanguageContext.languages[lang].date_format)]} />
              <br />
              <LocalizedString string='total_playtime' values={[getTimeStamp(game.play_time)]} />
            </Card.Footer>
          </Card>
        </Col>
      )}
    </LanguageContext.Helper.Consumer>
  )
}

GameLeaderboardCard.propTypes = {
  game: PropTypes.object.isRequired,
  position: PropTypes.number.isRequired
}

export default GameLeaderboardCard
