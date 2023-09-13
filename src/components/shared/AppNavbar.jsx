import React from 'react'
import { useRouter } from 'next/router'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import UserMenu from './UserMenu'
import LanguageContext from './LanguageContext'
import LocalizedString from './LocalizedString'

const flags = {
  en: '/img/flag/us.png',
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
              <Navbar.Brand>LinkTag
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls='navbar' />
            <Navbar.Collapse id='navbar'>
              <Nav className='me-auto'>
                <Link href='/' passHref legacyBehavior>
                  <Nav.Link active={router.pathname === '/'}><LocalizedString string='home' /></Nav.Link>
                </Link>
              </Nav>
              <Nav className='ms-auto'>
                <Nav>
                  <NavDropdown
                    align='end'
                    title={<img src={flags[lang]} width='24' />}>
                    <Link href='#' onClick={() => updateLanguage('en')}>
                      <NavDropdown.Item>
                        <img src='/img/flag/us.png' width='24' /> English
                      </NavDropdown.Item>
                    </Link>
                    <Link href='#' onClick={() => updateLanguage('jp')}>
                      <NavDropdown.Item>
                        <img src='/img/flag/jp.png' width='24' /> 日本語
                      </NavDropdown.Item>
                    </Link>
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
