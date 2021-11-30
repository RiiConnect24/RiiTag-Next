import { Container, Row } from 'react-bootstrap';
import safeJsonStringify from 'safe-json-stringify';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { NextSeo } from 'next-seo';
import { getGameLeaderboard } from '@/lib/riitag/leaderboard';
import GameLeaderboardCard from '@/components/leaderboard/GameLeaderboardCard';
import { TOTAL_GAMES_ON_LEADERBOARD } from '@/lib/constants/miscConstants';
import Pagination from '@/components/shared/Pagination';
import ENV from '@/lib/constants/environmentVariables';

const limit = TOTAL_GAMES_ON_LEADERBOARD;

export async function getServerSideProps({ query }) {
  let { page } = query;
  page = page === undefined ? 1 : Number.parseInt(page, 10);
  if (Number.isNaN(page) || page <= 0) {
    page = 1;
  }
  const [totalGames, leaderboard] = await getGameLeaderboard(page, limit);
  const totalPages = Math.ceil(totalGames / limit);

  return {
    props: {
      page,
      totalPages,
      leaderboard: JSON.parse(safeJsonStringify(leaderboard)),
    },
  };
}

function GameLeaderboardPage({ page, totalPages, leaderboard }) {
  const [currentPage, setCurrentPage] = useState(page);
  const [games, setGames] = useState(leaderboard);
  const [total, setTotal] = useState(totalPages);

  const handlePageClick = async (event) => {
    const newPage = event.selected + 1;

    fetch(`/api/leaderboard/game-leaderboard?page=${newPage}`)
      .then((result) => result.json())
      .then((data) => {
        window.history.pushState(
          null,
          null,
          `/game-leaderboard?page=${newPage}`
        );
        window.scrollTo({
          top: 0,
          left: 0,
        });
        setGames(data.leaderboard);
        setCurrentPage(newPage);
        setTotal(data.totalPages);
      })
      .catch(() =>
        toast.error('There was an error while getting the leaderboard.')
      );
  };

  return (
    <Container>
      <NextSeo
        title="Leaderboard"
        description="See what people have played the most while connected to their RiiTag!"
        canonical={`${ENV.BASE_URL}/game-leaderboard?page=${currentPage}`}
        openGraph={{
          url: `${ENV.BASE_URL}/game-leaderboard?page=${currentPage}`,
        }}
      />
      <Row className="mb-4 row-cols-1 row-cols-xl-3 row-cols-md-2 g-4">
        {games.map((game, index) => (
          <GameLeaderboardCard
            key={game.game_pk}
            game={game}
            position={limit * (currentPage - 1) + index + 1}
          />
        ))}
      </Row>

      <Pagination
        currentPage={currentPage - 1}
        handlePageClick={handlePageClick}
        totalPages={total}
      />
    </Container>
  );
}

GameLeaderboardPage.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  leaderboard: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GameLeaderboardPage;
