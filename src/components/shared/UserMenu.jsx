import React from 'react'
import {
  faCog,
  faImage,
  faKey,
  faPen,
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { toast } from 'react-toastify'
import useInfo from '@/lib/swr-hooks/useInfo'
import { isBlank } from '@/lib/utils/utils'
import useRouterRefresh from '../../hooks/useRefreshRoute'
import { Button, Nav, NavDropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

function UserMenu () {
  const { user, isLoading, isError, mutate } = useInfo()
  const refresh = useRouterRefresh()

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).then(() => {
      mutate()
      refresh()
      toast.success('Logout successful! Bye!')
    })
  }

  if (isLoading) {
    return null
  }

  if (isError || user === null || isBlank(user.username)) {
    return (
      <form method='POST' action='/api/auth/login/discord'>
        <Button variant='success' size='md' type='submit'>
          <FontAwesomeIcon className='me-2' icon={faDiscord} />
          Login
        </Button>
      </form>
    )
  }

  return (
    <Nav>
      <NavDropdown
        align='end'
        title={
          <img
            className='me-1 ms-auto'
            style={{ width: 25, height: 25 }}
            src={user.image}
            alt='User Avatar'
          />
        }
      >
        <Link href={`/user/${user.username}`} passHref legacyBehavior>
          <NavDropdown.Item>
            <FontAwesomeIcon className='me-2' icon={faUser} />
            <span>Profile</span>
          </NavDropdown.Item>
        </Link>
        {/* <Link href={`/user/${user.username}/playlog`} passHref> */}
        {/*  <NavDropdown.Item> */}
        {/*    <FontAwesomeIcon className="me-1" icon={faGamepad} /> */}
        {/*    <span>Playlog</span> */}
        {/*  </NavDropdown.Item> */}
        {/* </Link> */}
        <Link href='/account' passHref legacyBehavior>
          <NavDropdown.Item>
            <FontAwesomeIcon className='me-2' icon={faKey} />
            <span>Account</span>
          </NavDropdown.Item>
        </Link>
        {user.role === 'admin' && (
          <Link href='/admin' passHref legacyBehavior>
            <NavDropdown.Item>
              <FontAwesomeIcon className='me-2' icon={faCog} />
              <span>Administration</span>
            </NavDropdown.Item>
          </Link>
        )}
        <NavDropdown.Divider />
        <Link href='/edit' passHref legacyBehavior>
          <NavDropdown.Item>
            <FontAwesomeIcon className='me-2' icon={faPen} />
            <span>Edit RiiTag</span>
          </NavDropdown.Item>
        </Link>
        <Link href='/mii' passHref legacyBehavior>
          <NavDropdown.Item>
            <FontAwesomeIcon className='me-2' icon={faImage} />
            <span>Edit Mii</span>
          </NavDropdown.Item>
        </Link>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={logout}>
          <FontAwesomeIcon className='me-2' icon={faSignOutAlt} />
          <span>Log Out</span>
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  )
}

export default UserMenu
