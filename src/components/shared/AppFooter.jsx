import { Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';
import ENV from '@/lib/constants/environmentVariables';

function AppFooter() {
  return (
    <Container fluid className="mt-auto py-2 bg-secondary">
      <Row>
        <Col className="text-muted text-start">
          &copy; 2020 - {new Date().getFullYear()}&nbsp;
          <a
            className="text-muted"
            href="https://rc24.xyz"
            rel="external noopener noreferrer"
            target="_blank"
          >
            RiiConnect24
          </a>{' '}
          -{' '}
          <Link href="/credits">
            <a className="text-muted">Credits</a>
          </Link>
        </Col>
        {ENV.STAGING === 'true' && (
          <Col className="text-danger">
            This is a PREVIEW. Data may be deleted at any time!
          </Col>
        )}
        <Col className="text-muted text-end">
          <Link href="/privacy-policy">
            <a className="text-muted">Privacy Policy</a>
          </Link>{' '}
          -{' '}
          <Link href="/tos">
            <a className="text-muted">Terms of Service</a>
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
