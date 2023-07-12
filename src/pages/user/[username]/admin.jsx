import React from 'react'
import { Container } from 'react-bootstrap'
import safeJsonStringify from 'safe-json-stringify'
import PropTypes from 'prop-types'
import { withSession } from '@/lib/iron-session'
import prisma from '@/lib/db'
import GeneralUserAdminCard from '@/components/user/admin/GeneralUserAdminCard'

export const getServerSideProps = withSession(async ({ req, query }) => {
  const { username } = query
  const loggedInUsername = req.session?.username
  const loggedInUser = await prisma.user.findFirst({
    where: {
      username: loggedInUsername
    },
    select: {
      role: true
    }
  })

  const user = await prisma.user.findUnique({
    where: {
      username: username.toString()
    },
    select: {
      username: true,
      badge: true,
      name_on_riitag: true
    }
  })

  if (!user) {
    return { notFound: true }
  }

  if (!loggedInUser || loggedInUser.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      user: JSON.parse(safeJsonStringify(user)),
      isLoggedIn: user.username === loggedInUser
    }
  }
})

function ProfileAdminPage ({ user, isLoggedIn }) {
  return (
    <Container>
      <GeneralUserAdminCard
        user={user}
      />
    </Container>
  )
}

ProfileAdminPage.propTypes = {
  user: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}

export default ProfileAdminPage
