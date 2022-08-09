import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { nc } from '@/lib/routing';
import prisma from '@/lib/db';
import ENV from '@/lib/constants/environmentVariables';
import { getGameRegion } from '@/lib/riitag/cover';
import { MII_TYPE } from '@/lib/constants/miiType';

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
          name: true,
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

  const games = [];
  for (const game of playlog) {
    games.push({
      game_id: game.game.game_id,
      console: game.game.console,
      name: game.game.name,
      region: getGameRegion(game.game.console, game.game.game_id),
      cover_url: `${ENV.BASE_URL}/api/cover/${game.game.console}/${game.game.game_id}`,
      played_on: game.played_on,
    });
  }

  const json = {
    NOTE: '!!! This API is still in BETA and some fields may be removed in the future !!!',
    user: {
      id: user.username,
      name: user.name_on_riitag,
      coins: user.coins,
      avatar_url: user.image,
      profile_url: `${ENV.BASE_URL}/user/${user.username}`,
      member_since: user.created_at,
    },
    mii: {
      type: user.mii_type,
      data: user.mii_data,
      cmocEntryNo: user.mii_type === MII_TYPE.CMOC ? user.cmoc_entry_no : null,
    },
    tag: {
      url: {
        normal: `${ENV.BASE_URL}/${user.username}/tag.png`,
        max: `${ENV.BASE_URL}/${user.username}/tag.max.png`,
      },
      settings: {
        comment: user.comment,
        flag: user.flag,
        overlay: user.overlay,
        background: user.background,
        coin: user.coin,
        font: user.font,
        coverType: user.cover_type,
        coverRegion: user.cover_region,
        showAvatar: user.show_avatar,
        showMii: user.show_mii,
      },
    },
    games,
  };

  return response.status(HTTP_CODE.OK).json(json);
}

const handler = nc().get(getUserByUsername);

export default handler;
