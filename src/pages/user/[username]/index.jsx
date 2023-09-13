import React from 'react'
import { Alert, Col, Container, Row } from 'react-bootstrap'
import safeJsonStringify from 'safe-json-stringify'
import PropTypes from 'prop-types'
import { NextSeo } from 'next-seo'
import { withSession } from '@/lib/iron-session'
import prisma from '@/lib/db'
import LinkTag from '@/components/user/LinkTag'
import UserInformationCard from '@/components/user/UserInformationCard'
import ShowYourTagCard from '@/components/user/ShowYourTagCard'
import ENV from '@/lib/constants/environmentVariables'
import PlayLog from '@/components/user/PlayLog'
import PlayingStatus from '@/components/user/PlayingStatus'
import LanguageContext from '@/components/shared/LanguageContext'
import LocalizedString from '@/components/shared/LocalizedString'
import AppNavbar from '@/components/shared/AppNavbar'

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
      display_name: true,
      created_at: true,
      updated_at: true,
      overlay: true,
      background: true,
      coin: true,
      flag: true,
      font: true,
      cover_region: true,
      cover_type: true,
      role: true,
      isBanned: true,
      isPublic: true,
      publicOverride: true
    }
  })

  const banReason = await prisma.banned_user.findFirst({
    where: {
      user_id: user.id
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

  const loggedInUser = loggedInUsername != null
    ? await prisma.user.findUnique({
      where: {
        username: loggedInUsername
      },
      select: {
        role: true,
        language: true
      }
    })
    : { role: 'guest' }

  if (!user) {
    return { notFound: true }
  }

  return {
    props: {
      user: JSON.parse(safeJsonStringify(user)),
      isLoggedIn: user.username === loggedInUsername,
      loggedInUser,
      language: loggedInUser?.language || 'en',
      banReason: JSON.parse(safeJsonStringify(banReason)),
      event: JSON.parse(safeJsonStringify(event)),
      playlog: JSON.parse(safeJsonStringify(playlog)),
      session: JSON.parse(safeJsonStringify(session)),
      game: JSON.parse(safeJsonStringify(sessionGame))
    }
  }
})

function ProfilePage ({ user, isLoggedIn, banReason, loggedInUser, event, playlog, language, session, game }) {
  return (
    <LanguageContext.Helper.Provider value={language}>
      <AppNavbar />
      <Container>
        <NextSeo
          title={user.display_name}
          description={`See what ${user.display_name} has played`}
          openGraph={{
            url: `${ENV.BASE_URL}/user/${user.username}`,
            images: [
              {
                url: `${ENV.BASE_URL}/${user.username}/tag.max.png?${new Date(
                  user.updated_at
                ).getTime()}`,
                width: 1200,
                height: 450,
                alt: `linktag of ${user.display_name}`,
                type: 'image/png'
              }
            ],
            profile: {
              username: user.display_name
            }
          }}
        />
        <Row>
          {user.isBanned === true ? <Alert variant='danger'><LocalizedString string='banned_reason' values={[banReason.reason]}/></Alert> : ''}

          {user.isBanned === false
            ? <Col lg={7}>
              <div className='mb-3'>
                <LinkTag
                  username={user.username}
                  name={user.display_name}
                  updated_at={user.updated_at}
                />
              </div>

              <PlayLog playlog={playlog} current={game} />
            </Col>
            : ''}

          <Col lg={user.isBanned ? 12 : 5}>
            {event && <Alert variant='info'>An event is currently ongoing: {event.name}.<br />Until {event.date}, you will recieve {event.bonus + 1}x more coins.</Alert>}
            {session && <PlayingStatus session={session} game={game} />}

            <UserInformationCard user={user} isLoggedIn={isLoggedIn} isAdmin={loggedInUser.role === 'admin'} isMod={loggedInUser.role === 'admin' || loggedInUser.role === 'mod'} />
            {isLoggedIn && <ShowYourTagCard username={user.username} />}
          </Col>
        </Row>
      </Container>
    </LanguageContext.Helper.Provider>
  )
}

ProfilePage.propTypes = {
  user: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  event: PropTypes.object.isRequired,
  banReason: PropTypes.object.isRequired,
  playlog: PropTypes.array.isRequired,
  session: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired
}

export default ProfilePage
