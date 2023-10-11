import { Card, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import dayjs from '@/lib/dayjs';
import { DATE_FORMAT } from '@/lib/constants/miscConstants';

function GameLeaderboardCard({ game, position }) {
  return (
    <Col key={game.game_pk}>
      <Card className="h-100 contain-content" bg="secondary" text="white">
        <Card.Header as="h5" className="h-100">
          #{position} - {game.name === null ? 'Unknown Game' : game.name}
        </Card.Header>
        <Card.Body className="d-flex justify-content-center">
          <img
            alt={game.name === null ? 'Unknown Game' : game.name}
            src={`/api/cover/${game.console}/${game.game_id}`}
            height="225"
          />
        </Card.Body>
        <Card.Footer>
          Played <strong>{game.playcount}</strong>{' '}
          {game.playcount === 1 ? 'time' : 'times'} since{' '}
          {dayjs(game.first_played).format(DATE_FORMAT)}
          <br />
          Last played on {dayjs(game.last_played).format(DATE_FORMAT)}
        </Card.Footer>
      </Card>
    </Col>
  );
}

GameLeaderboardCard.propTypes = {
  game: PropTypes.object.isRequired,
  position: PropTypes.number.isRequired,
};

export default GameLeaderboardCard;
