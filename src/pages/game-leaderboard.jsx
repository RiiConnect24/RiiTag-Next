import { Col, Container, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { React, useState } from 'react'
import { NextSeo } from 'next-seo'
import { getGameLeaderboard, getGameLeaderboardSearch } from '@/lib/linktag/leaderboard'
import GameLeaderboardCard from '@/components/leaderboard/GameLeaderboardCard'
import { TOTAL_GAMES_ON_LEADERBOARD } from '@/lib/constants/miscConstants'
import Pagination from '@/components/shared/Pagination'
import ENV from '@/lib/constants/environmentVariables'

const limit = TOTAL_GAMES_ON_LEADERBOARD

export async function getServerSideProps ({ query }) {
  let { page, search } = query
  page = page === undefined ? 1 : Number.parseInt(page, 10)
  if (Number.isNaN(page) || page <= 0) {
    page = 1
  }

  // Add logic for the search handler
  let leaderboard
  let totalGames
  if (search) {
    // Call your search function here and pass the search parameter
    [totalGames, leaderboard] = await getGameLeaderboardSearch(page, limit, search)
  } else {
    // Call the game leaderboard function here
    [totalGames, leaderboard] = await getGameLeaderboard(page, limit)
  }

  const totalPages = Math.ceil(totalGames / limit)

  return {
    props: {
      page,
      totalPages,
      leaderboard: JSON.parse(JSON.stringify(leaderboard))
    }
  }
}

function GameLeaderboardPage ({ page, totalPages, leaderboard }) {
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

  const updateURLParameter = (query) => {
    const params = new URLSearchParams(window.location.search)
    params.set('search', query)
    const newURL = window.location.pathname + '?' + params.toString()
    window.history.replaceState({}, '', newURL)
    window.location.reload()
  }

  const updateURLPageParameter = (page, search) => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', page)
    params.set('search', search)
    const newURL = window.location.pathname + '?' + params.toString()
    window.history.replaceState({}, '', newURL)
    window.location.reload()
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    updateURLParameter(searchQuery)
    // Perform search logic or other actions
  }

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  return (
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
              placeholder='Search...'
            />
            <button type='submit'>Search</button>
          </form>
        </Col>
      </Row>

      <br />

      {games.length === 0
        ? (
          <Row>
            <Col className='text-center'>
              <p className='h2'>No games were played yet!</p>
            </Col>
          </Row>
          )
        : (
          <>
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
          </>
          )}
    </Container>
  )
}

GameLeaderboardPage.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  leaderboard: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default GameLeaderboardPage
