import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { nc } from '@/lib/routing';
import prisma from '@/lib/db';
import ENV from '@/lib/constants/environmentVariables';
import { getGameRegion } from '@/lib/riitag/cover';

async function getUserByUsername(request, response) {
  const { username } = request.query;
  const user = await prisma.user.findUnique({
    where: {
      username: username.toString(),
    },
  });

  if (user === null) {
    return response
      .status(HTTP_CODE.NOT_FOUND)
      .send({ error: 'User not found' });
  }

  const playlog = await prisma.playlog.findMany({
    where: {
      user: {
        id: user.id,
      },
    },
    select: {
      played_on: true,
      game: {
        select: {
          game_id: true,
          console: true,
        },
      },
    },
    orderBy: {
      played_on: 'desc',
    },
    distinct: ['game_pk'],
    take: 10,
  });

  let lastPlayed = null;
  if (playlog !== null && playlog.length > 0) {
    const lastGame = playlog[0];
    lastPlayed = {
      game_id: lastGame.game.game_id,
      console: lastGame.game.console,
      region: getGameRegion(lastGame.game.console, lastGame.game.game_id),
      cover_url: `${ENV.BASE_URL}/api/cover/${lastGame.game.console}/${lastGame.game.game_id}`,
      time: new Date(playlog[0].played_on).getTime(),
    };
  }

  const json = {
    user: {
      name: user.name_on_riitag,
      id: user.username,
    },
    tag_url: {
      normal: `${ENV.BASE_URL}/${user.username}/tag.png`,
      max: `${ENV.BASE_URL}/${user.username}/tag.max.png`,
    },
    game_data: {
      last_played: lastPlayed,
      games:
        playlog !== null && playlog.length > 0
          ? playlog.map(({ game }) => `${game.console}-${game.game_id}`)
          : [],
    },
  };

  return response.status(HTTP_CODE.OK).json(json);
}

const handler = nc().get(getUserByUsername);

export default handler;
