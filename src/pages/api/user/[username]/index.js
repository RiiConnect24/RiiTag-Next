import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { nc } from '@/lib/routing';
import prisma from '@/lib/db';
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

  const lastPlayed =
    playlog !== null
      ? [
          `${playlog[0].game.console}-${playlog[0].game.game_id}`,
          new Date(playlog[0].played_on).getTime(),
        ]
      : null;

  const json = {
    name: user.name_on_riitag,
    id: user.username,
    games: playlog.map(({ game }) => `${game.console}-${game.game_id}`),
    coins: user.coins,
    friend_code: user.comment,
    region: user.flag,
    overlay: user.overlay,
    bg: user.background,
    avatar: user.image,
    coin: user.coin,
    lastplayed: lastPlayed,
    useavatar: user.show_avatar,
    covertype: user.cover_type,
    coverregion: user.cover_region,
    font: user.font,
    usemii: user.show_mii,
    miitype: user.mii_type,
    miidata: user.mii_data,
    cmocentryno: user.mii_type === MII_TYPE.CMOC ? user.cmoc_entry_no : null,
  };

  return response.status(HTTP_CODE.OK).json(json);
}

const handler = nc().get(getUserByUsername);

export default handler;
