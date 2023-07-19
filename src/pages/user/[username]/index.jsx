import React from 'react'
import { Alert, Col, Container, Row } from 'react-bootstrap'
import safeJsonStringify from 'safe-json-stringify'
import PropTypes from 'prop-types'
import { NextSeo } from 'next-seo'
import { withSession } from '@/lib/iron-session'
import prisma from '@/lib/db'
import RiiTag from '@/components/user/RiiTag'
import UserInformationCard from '@/components/user/UserInformationCard'
import ShowYourTagCard from '@/components/user/ShowYourTagCard'
import ENV from '@/lib/constants/environmentVariables'
import PlayLog from '@/components/user/PlayLog'
import PlayingStatus from '@/components/user/PlayingStatus'

export const getServerSideProps = withSession(async ({ req, query }) => {
  const { username } = query
  const loggedInUsername = req.session?.username

  const user = await prisma.user.findUnique({
    where: {
      username: username.toString()
    },
    select: {
      id: true,
      username: true,
      image: true,
      name_on_riitag: true,
      created_at: true,
      updated_at: true,
      overlay: true,
      background: true,
      coin: true,
      flag: true,
      font: true,
      cover_region: true,
      cover_type: true,
      role: true
    }
  })

  const event = await prisma.events.findFirst({
    where: {
      start_time: {
        lte: new Date()
      },
      end_time: {
        gte: new Date()
      }
    }
  })

  const playlog = await prisma.playlog.findMany({
    where: {
      user: {
        username: username.toString()
      }
    },
    select: {
      play_time: true,
      play_count: true,
      played_on: true,
      game: {
        select: {
          game_id: true,
          name: true
        }
      }
    },
    orderBy: {
      played_on: 'desc'
    },
    take: 10
  })

  const session = await prisma.game_sessions.findFirst({
    where: {
      user_id: user.username
    }
  })

  const sessionGame = await prisma.game.findFirst({
    where: {
      game_id: session?.game_id || '0'
    }
  })

  const loggedInUser = await prisma.user.findUnique({
    where: {
      username: loggedInUsername
    },
    select: {
      role: true
    }
  })

  if (!user) {
    return { notFound: true }
  }

  return {
    props: {
      user: JSON.parse(safeJsonStringify(user)),
      isLoggedIn: user.username === loggedInUsername,
      loggedInUser,
      event: {
        name: event.name,
        date: `${event.end_time.getMonth() + 1}/${event.end_time.getDate()}/${event.end_time.getFullYear()}`,
        bonus: event.bonus_coins
      },
      playlog: JSON.parse(safeJsonStringify(playlog)),
      session: JSON.parse(safeJsonStringify(session)),
      game: JSON.parse(safeJsonStringify(sessionGame))
    }
  }
})

function ProfilePage ({ user, isLoggedIn, loggedInUser, event, playlog, session, game }) {
  return (
    <Container>
      <NextSeo
        title={user.name_on_riitag}
        description={`See what ${user.name_on_riitag} has played`}
        openGraph={{
          url: `${ENV.BASE_URL}/user/${user.username}`,
          images: [
            {
              url: `${ENV.BASE_URL}/${user.username}/tag.max.png?${new Date(
                user.updated_at
              ).getTime()}`,
              width: 1200,
              height: 450,
              alt: `RiiTag of ${user.name_on_riitag}`,
              type: 'image/png'
            }
          ],
          profile: {
            username: user.name_on_riitag
          }
        }}
      />
      <Row>
        <Col lg={7}>
          <div className='mb-3'>
            <RiiTag
              username={user.username}
              name={user.name_on_riitag}
              updated_at={user.updated_at}
            />
          </div>

          <PlayLog playlog={playlog} current={game} />
        </Col>

        <Col lg={5}>
          { event && <Alert variant='info'>An event is currently ongoing: {event.name}.<br />Until {event.date}, you will recieve {event.bonus + 1}x more coins.</Alert> }
          { session && <PlayingStatus session={session} game={game} /> }

          <UserInformationCard user={user} isLoggedIn={isLoggedIn} isAdmin={loggedInUser.role === 'admin'} />
          {isLoggedIn && <ShowYourTagCard username={user.username} />}
        </Col>
      </Row>
    </Container>
  )
}

ProfilePage.propTypes = {
  user: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  playlog: PropTypes.array.isRequired,
  session: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired
}

export default ProfilePage
