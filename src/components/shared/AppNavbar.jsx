import React from 'react'
import { useRouter } from 'next/router'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import UserMenu from './UserMenu'
import LanguageContext from './LanguageContext'
import LocalizedString from './LocalizedString'

const flags = {
  en: '/img/flag/us.png',
  en_uk: '/img/flag/eu.png',
  jp: '/img/flag/jp.png'
}

function AppNavbar () {
  const router = useRouter()

  function updateLanguage (lang) {
    fetch('/api/account/language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ language: lang })
    }).then(() => { window.location.reload() })
  }

  return (
    <LanguageContext.Helper.Consumer>
      {(lang) => (
        <Navbar
          className='mb-3'
          collapseOnSelect
          expand='lg'
          bg='secondary'
          variant='dark'
        >
          <Container fluid>
            <Link href='/' passHref>
              <Navbar.Brand>RiiTag
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls='navbar' />
            <Navbar.Collapse id='navbar'>
              <Nav className='me-auto'>
                <Link href='/' passHref legacyBehavior>
                  <Nav.Link active={router.pathname === '/'}><LocalizedString string='home' /></Nav.Link>
                </Link>
                <Link href='/game-leaderboard' passHref legacyBehavior>
                  <Nav.Link active={router.pathname === '/game-leaderboard'}>Leaderboard</Nav.Link>
                </Link>
              </Nav>
              <Nav className='ms-auto'>
                <Nav>
                  <NavDropdown
                    align='end'
                    title={<img src={flags[lang]} width='24' />}>
                    {Object.entries(flags).map((entry, index) => (
                      <Link href='#' onClick={() => updateLanguage(entry[0])} key={entry[0]}>
                        <NavDropdown.Item>
                          <img src={entry[1]} width='24' /> {LanguageContext.languages[entry[0]].name}
                        </NavDropdown.Item>
                      </Link>
                    ))}
                  </NavDropdown>
                </Nav>
                <UserMenu />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </LanguageContext.Helper.Consumer>
  )
}

export default AppNavbar
