import prisma from '@/lib/db'

export async function getGameLeaderboard (page, limit) {
  return prisma.$transaction([
    prisma.playlog.count({
      where: {
        play_time: {
          gt: 5
        }
      }
    }),
    prisma.playlog.findMany({
      // only show playlogs with the same game_id once
      distinct: ['game_pk'],
      where: {
        play_time: {
          gt: 5
        }
      },
      select: {
        play_time: true,
        play_count: true,
        user: {
          select: {
            display_name: true,
            username: true,
            image: true
          }
        },
        game: {
          select: {
            name: true,
            game_id: true,
            console: true,
            playcount: true,
            first_played: true
          }
        }
      },
      take: limit,
      skip: limit * (page - 1),
      orderBy: {
        play_time: 'desc'
      }
    })
  ])
}

export async function getGameLeaderboardSearch (page, limit, search) {
  return prisma.$transaction([
    prisma.playlog.count({
      where: {
        play_time: {
          gt: 5
        },
        game: {
          name: {
            contains: search
          }
        }
      }
    }),
    prisma.playlog.findMany({
      where: {
        game: {
          name: {
            contains: search
          }
        }
      },
      select: {
        play_time: true,
        play_count: true,
        user: {
          select: {
            display_name: true,
            username: true,
            image: true
          }
        },
        game: {
          select: {
            name: true,
            game_id: true,
            console: true,
            playcount: true,
            first_played: true
          }
        }
      },
      take: limit,
      skip: limit * (page - 1),
      orderBy: {
        play_time: 'desc'
      }
    })
  ])
}
