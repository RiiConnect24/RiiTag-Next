import React from 'react'
import { useRouter } from 'next/router'
import { Container, Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import UserMenu from './UserMenu'

function AppNavbar () {
  const router = useRouter()

  return (
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
              <Nav.Link active={router.pathname === '/'}>Home</Nav.Link>
            </Link>
          </Nav>
          <Nav className='ms-auto'>
            <UserMenu />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
