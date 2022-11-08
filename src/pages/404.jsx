import { Button, Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

export default function Error404() {
  return (
    <Container>
      <NextSeo title="404 Error" />
      <Row>
        <Col className="text-center">
          <h1>404 - Page not found</h1>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <p>This page was not found.</p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col className="text-center">
          <Link href="/" passHref>
            <Button variant="success" size="lg">
              Go Home
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
