import { Col, Container, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { React, useState } from 'react'
import { NextSeo } from 'next-seo'
import { getGameLeaderboard, getGameLeaderboardSearch } from '@/lib/linktag/leaderboard'
import GameLeaderboardCard from '@/components/leaderboard/GameLeaderboardCard'
import { TOTAL_GAMES_ON_LEADERBOARD } from '@/lib/constants/miscConstants'
import Pagination from '@/components/shared/Pagination'
import ENV from '@/lib/constants/environmentVariables'
import LanguageContext from '@/components/shared/LanguageContext'
import AppNavbar from '@/components/shared/AppNavbar'
import { withSession } from '@/lib/iron-session'
import prisma from '@/lib/db'
import LocalizedString from '@/components/shared/LocalizedString'

const limit = TOTAL_GAMES_ON_LEADERBOARD

export const getServerSideProps = withSession(async ({ req, query }) => {
  // Get user session and their language
  const session = req.session?.username

  const sessionUser = await prisma.user.findUnique({
    where: {
      username: session
    },
    select: {
      language: true
    }
  })

  let { page, search } = query

  page = Number.parseInt(page, 10) || 1

  if (Number.isNaN(page) || page <= 0) page = 1

  // Add logic for the search handler
  const [totalGames, leaderboard] = search ? await getGameLeaderboardSearch(page, limit, search) : await getGameLeaderboard(page, limit)

  const totalPages = Math.ceil(totalGames / limit)

  return {
    props: {
      page,
      totalPages,
      language: sessionUser?.language ?? 'en',
      leaderboard: JSON.parse(JSON.stringify(leaderboard))
    }
  }
})

function GameLeaderboardPage ({ page, totalPages, language, leaderboard }) {
  const [currentPage] = useState(page)
  const [games] = useState(leaderboard)
  const [total] = useState(totalPages)

  const handlePageClick = async (event) => {
    const newPage = event.selected + 1
    const searchParams = new URLSearchParams(window.location.search)
    const searchQuery = searchParams.get('search')

    updateURLPageParameter(newPage, searchQuery)
  }

  const [searchQuery, setSearchQuery] = useState('')

  function updateURLPageParameter (search, page) {
    const params = new URLSearchParams(window.location.search)

    params.set('page', page)
    params.set('search', search)

    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
    window.location.reload()
  }

  function handleFormSubmit (event) {
    event.preventDefault()
    updateURLPageParameter(searchQuery, currentPage)
  }

  function handleInputChange (event) {
    setSearchQuery(event.target.value)
  }

  return (
    <LanguageContext.Helper.Provider value={language}>
    <AppNavbar />
    <Container>
      <NextSeo
        title='Leaderboard'
        description='See what people have played the most while connected to their linktag!'
        canonical={`${ENV.BASE_URL}/game-leaderboard?page=${currentPage}&search=${searchQuery}`}
        openGraph={{
          url: `${ENV.BASE_URL}/game-leaderboard?page=${currentPage}&search=${searchQuery}`
        }}
      />
      <Row>
        <Col className='text-center'>
          <form onSubmit={handleFormSubmit}>
            <input
              type='text'
              value={searchQuery}
              onChange={handleInputChange}
              placeholder={LanguageContext.languages[language].search + '...'}
            />
            <button type='submit'><LocalizedString string='search'/></button>
          </form>
        </Col>
      </Row>

      <br />

      <Row className='mb-4 row-cols-1 row-cols-xl-3 row-cols-md-2 g-4'>
        {games.map((game, index) => (
          <GameLeaderboardCard
            key={game.game_pk}
            game={game}
            position={limit * (currentPage - 1) + index + 1}
          />
        ))}
      </Row>

      <Pagination
        currentPage={currentPage - 1}
        handlePageClick={handlePageClick}
        totalPages={total}
      />
    </Container>
    </LanguageContext.Helper.Provider>
  )
}

GameLeaderboardPage.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  leaderboard: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default GameLeaderboardPage
