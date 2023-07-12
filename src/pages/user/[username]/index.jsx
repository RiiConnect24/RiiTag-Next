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

export const getServerSideProps = withSession(async ({ req, query }) => {
  const { username } = query
  const loggedInUsername = req.session?.username

  const user = await prisma.user.findUnique({
    where: {
      username: username.toString()
    },
    select: {
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
      }
    }
  }
})

function ProfilePage ({ user, isLoggedIn, loggedInUser, event }) {
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

          {isLoggedIn && <ShowYourTagCard username={user.username} />}
        </Col>

        <Col lg={5}>
          <Alert variant='info'>An event is currently ongoing: {event.name}.<br />Until {event.date}, you will recieve {event.bonus + 1}x more coins.</Alert>
          <UserInformationCard user={user} isLoggedIn={isLoggedIn} isAdmin={loggedInUser.role === 'admin'} />
        </Col>
      </Row>
    </Container>
  )
}

ProfilePage.propTypes = {
  user: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired
}

export default ProfilePage
