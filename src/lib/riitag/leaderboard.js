import prisma from '@/lib/db';

export async function getGameLeaderboard(page, limit) {
  return prisma.$transaction([
    prisma.game.count({
      where: {
        playcount: {
          gt: 5,
        },
      },
    }),
    prisma.game.findMany({
      where: {
        playcount: {
          gt: 5,
        },
      },
      take: limit,
      skip: limit * (page - 1),
      orderBy: {
        playcount: 'desc',
      },
    }),
  ]);
}
