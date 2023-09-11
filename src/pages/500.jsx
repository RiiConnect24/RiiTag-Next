import { Button, Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

export default function Error500() {
  return (
    <Container>
      <NextSeo title="500 Error" />
      <Row>
        <Col className="text-center">
          <h1>500 Internal Server Error</h1>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <p>
            There was an error while processing your request server-side. Please
            try again.
          </p>
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
