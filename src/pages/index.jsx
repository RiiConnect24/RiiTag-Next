import { Button, Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { React, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import useInfo from '@/lib/swr-hooks/useInfo'
import prisma from '@/lib/db'
import LinkTagCarousel from '@/components/index/LinkTagCarousel'
import safeJsonStringify from 'safe-json-stringify'
import { withSession } from '@/lib/iron-session'
import LanguageContext from '@/components/shared/LanguageContext'
import LocalizedString from '@/components/shared/LocalizedString'
import AppNavbar from '@/components/shared/AppNavbar'

export const getServerSideProps = withSession(async ({ req, query }) => {
  const userCount = await prisma.user.count()
  const playCountResult = await prisma.$queryRaw`
      SELECT SUM(coins)
      FROM user
  `

  const loggedInUsername = req.session?.username
  const loggedInUser = await prisma.user.findFirst({
    where: {
      username: loggedInUsername
    },
    select: {
      language: true
    }
  })

  const playCount = Number(playCountResult[0]['SUM(coins)'])
  const randomUsers = await prisma.$queryRaw`
      SELECT user.username, user.display_name, user.updated_at
      FROM user
      WHERE user.coins > 10 AND user.isPublic = 1 AND user.publicOverride IS NULL
      ORDER BY RAND()
      LIMIT 5
  `

  return {
    props: {
      userCount,
      playCount,
      language: loggedInUser.language,
      randomUsers: JSON.parse(safeJsonStringify(randomUsers))
    }
  }
})

function IndexPage ({ userCount, playCount, language, randomUsers }) {
  const router = useRouter()

  const { user, isLoading } = useInfo()

  useEffect(() => {
    if (router.query.error) {
      window.history.replaceState(null, null, '/')
      toast.error(
        'There was an error while logging you in. Please try again later.'
      )
    }
  }, [router.query.error])

  return (
    <LanguageContext.Helper.Provider value={language}>
    <AppNavbar />
    <Container>
      <NextSeo />
      <Row>
        <Col className='text-center'>
          <h1><LocalizedString string={'welcome'} values={[]}/></h1>
        </Col>
      </Row>

      {
        isLoading === false
          ? (
            <Row>
              <Col className='d-flex gap-1 flex-column flex-sm-row align-items-center justify-content-center'>
                {user?.username === undefined && (
                  <>
                    <form method='POST' action='/api/auth/login/discord'>
                      <Button variant='success' size='lg' type='submit'>
                        <FontAwesomeIcon className='me-2' icon={faDiscord} />
                        <LocalizedString string='discord' />
                      </Button>
                    </form>{' '}
                  </>
                )}
                <a
                  href='https://wii.guide/linktag'
                  target='_blank'
                  rel='noreferrer noopener'
                >
                </a>
              </Col>
            </Row>
            )
          : null
      }

      {
        isLoading === false && user?.username === undefined && (
          <Row className='mt-1'>
            <Col>
              <p className='text-center'>
                If an account does not exist, it will be created. You agree to our{' '}
                <Link href='/privacy-policy'>Privacy Policy</Link> and our{' '}
                <Link href='tos'>Terms of Service</Link>.
              </p>
            </Col>
          </Row>
        )
      }

      {
        userCount !== 0 && (
          <Row className='mt-2 text-center'>
            <Col>
              <h3>
                <LocalizedString string={'join_others'} values={[userCount, playCount]} />{' '}
              </h3>
            </Col>
          </Row>
        )
      }

      {
        randomUsers.length > 0 && (
          <Row className='text-center'>
            <Col>
              <LinkTagCarousel randomUsers={randomUsers} />
            </Col>
          </Row>
        )
      }

      <Row>
        <h3 className='mt-4 text-center'>
          <LocalizedString string='supported_platforms' />
        </h3>
        <Row className='mt-4'>
          <Col>
            <h5 className='text-center'>Wii</h5>
            <ul>
              <li>Dolphin Discord RPC</li>
              <li>USB Loaders</li>
              <ul>
                <li>Configurable USB Loader</li>
                <li>USB Loader GX</li>
                <li>WiiFlow</li>
              </ul>
            </ul>
          </Col>
          <Col>
            <h5 className='text-center'>Wii U</h5>
            <ul>
              <li>Aroma Plugin</li>
              <li>Cemu Discord RPC</li>
            </ul>
          </Col>
        </Row>
      </Row>
    </Container>
    </LanguageContext.Helper.Provider>
  )
}

IndexPage.propTypes = {
  userCount: PropTypes.number.isRequired,
  randomUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
  language: PropTypes.string.isRequired,
  playCount: PropTypes.number.isRequired
}

export default IndexPage
