import { Container, Nav, Navbar } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UserMenu from '@/components/shared/UserMenu';

function AppNavbar() {
  const router = useRouter();

  return (
    <Navbar
      className="mb-3"
      collapseOnSelect
      expand="lg"
      bg="secondary"
      variant="dark"
    >
      <Container fluid>
        <Link href="/" passHref>
          <Navbar.Brand>
            <img
              alt="RiiTag Logo"
              className="d-inline-block align-text-top no-shadow"
              height={46}
              src="/logo.svg"
              width={128}
            />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="me-auto">
            <Link href="/" passHref>
              <Nav.Link active={router.pathname === '/'}>Home</Nav.Link>
            </Link>
            <Link href="/game-leaderboard" passHref>
              <Nav.Link active={router.pathname === '/game-leaderboard'}>
                Leaderboard
              </Nav.Link>
            </Link>
          </Nav>
          <Nav className="ms-auto">
            <UserMenu />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
