import { nc } from '@/lib/routing';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { getGameLeaderboard } from '@/lib/riitag/leaderboard';
import { TOTAL_GAMES_ON_LEADERBOARD } from '@/lib/constants/miscConstants';

const limit = TOTAL_GAMES_ON_LEADERBOARD;

async function gameLedarboard(request, response) {
  let { page } = request.query;
  page = page == null ? 1 : Number.parseInt(page, 10);
  if (Number.isNaN(page) || page <= 0) {
    page = 1;
  }
  const [totalGames, leaderboard] = await getGameLeaderboard(page, limit);
  const totalPages = Math.ceil(totalGames / limit);

  return response.status(HTTP_CODE.OK).json({ leaderboard, totalPages });
}

const handler = nc().get(gameLedarboard);

export default handler;
