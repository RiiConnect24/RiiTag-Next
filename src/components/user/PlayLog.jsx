import React from 'react'
import PropTypes from 'prop-types'
import { Card, Table } from 'react-bootstrap'
import moment from 'moment/moment'
import LanguageContext from '../shared/LanguageContext'
import LocalizedString from '../shared/LocalizedString'

function PlayLog ({ playlog, current }) {
  function getTimeStamp (time) {
    const duration = moment.duration(time, 'seconds')
    return duration.humanize()
  }

  const [hydrated, setHydrated] = React.useState(false)
  React.useEffect(() => {
    // This forces a rerender, so the date is rendered
    // the second time but not the first
    setHydrated(true)
  }, [])
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null
  }

  return (
    <LanguageContext.Helper.Consumer>
      {(lang) => (
        <Card className='mb-3' bg='secondary' text='white'>
          <Card.Header as='h5'><LocalizedString string='play_log'/></Card.Header>
          <Card.Body>
            <Table style={{ color: 'white' }}>
              <thead>
                <tr>
                  <th><LocalizedString string='game_id'/></th>
                  <th><LocalizedString string='play_time'/></th>
                  <th><LocalizedString string='play_count'/></th>
                  <th><LocalizedString string='last_played'/></th>
                </tr>
              </thead>
              <tbody>
                {playlog.map((log) => (
                  <tr key={log.game.game_id}>
                    <td>{log.game.name === null ? log.game.game_id : log.game.name}</td>
                    <td>{log.play_time > 0 ? `${getTimeStamp(log.play_time)}` : 'Not Tracked'}</td>
                    <td>{log.play_count} times</td>
                    <td>{current && current.game_id === log.game.game_id ? 'Now' : moment(log.played_on).from()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </LanguageContext.Helper.Consumer>
  )
}

PlayLog.propTypes = {
  playlog: PropTypes.array,
  current: PropTypes.object.isRequired
}

PlayLog.defaultProps = {
  updated_at: null
}

export default PlayLog
