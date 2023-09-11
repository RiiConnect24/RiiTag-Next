import { Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';
import ENV from '@/lib/constants/environmentVariables';

function AppFooter() {
  return (
    <Container fluid className="mt-auto py-2 bg-secondary">
      <Row>
        <Col className="text-muted text-start">
          &copy; RiiConnect24 2020 - {new Date().getFullYear()}
          &nbsp;
          <a
            className="text-muted"
            href="https://rc24.xyz"
            rel="external noopener noreferrer"
            target="_blank"
          >
          </a>{' '}
          -{' '}
          <Link href="/credits" className="text-muted">
            Credits
          </Link>{' '}
          -{' '}
          <Link href="/about" className="text-muted">
            About
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
            href="https://github.com/RiiConnect24/RiiTag-Next"
            rel="external noopener noreferrer"
            target="_blank"
          >
            Source
          </a>
        </Col>
      </Row>
    </Container>
  );
}

export default AppFooter;
