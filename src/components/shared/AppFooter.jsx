import { Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';
import ENV from '@/lib/constants/environmentVariables';

function AppFooter() {
  return (
    <Container fluid className="mt-auto py-2 bg-secondary">
      <Row>
        <Col className="text-start">
          <Link className="text-muted" href="/about">
            &copy; 2020 - {new Date().getFullYear()}
          </Link>
          &nbsp;
          <a
            className="text-muted"
            href="https://rc24.xyz"
            rel="external noopener noreferrer"
            target="_blank"
          >
            RiiConnect24
          </a>{' '}
          -{' '}
          <Link href="/credits" className="text-muted">
            Credits
          </Link>
        </Col>
        {ENV.STAGING === 'true' && (
          <Col className="text-danger">
            This is a PREVIEW. Data may be deleted at any time!
          </Col>
        )}
        <Col className="text-muted text-end">
          <Link href="/privacy-policy" className="text-muted">
            Privacy Policy
          </Link>{' '}
          -{' '}
          <Link href="/tos" className="text-muted">
            Terms of Service
          </Link>{' '}
          -{' '}
          <a
            className="text-muted"
            href="https://github.com/WiiDatabase/RiiTag-Next"
            rel="external noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </Col>
      </Row>
    </Container>
  );
}

export default AppFooter;
