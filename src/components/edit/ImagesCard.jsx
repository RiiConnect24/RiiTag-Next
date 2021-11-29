import PropTypes from 'prop-types';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { createOptionNodes } from '@/lib/utils/utils';
import { OVERLAYS } from '@/lib/constants/forms/overlays';
import { FLAGS } from '@/lib/constants/forms/flags';
import { COINS } from '@/lib/constants/forms/coins';
import { BACKGROUNDS } from '@/lib/constants/forms/backgrounds';

const overlays = createOptionNodes(OVERLAYS);
const flags = createOptionNodes(FLAGS);
const coins = createOptionNodes(COINS);

const backgrounds = BACKGROUNDS.map((background) => (
  <option key={background}>{background}</option>
));

function ImagesCard({ values, errors, handleChange }) {
  return (
    <Card className="mb-3" bg="secondary" text="white">
      <Card.Header as="h5">Images</Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={5}>
            <Form.Group className="mb-3" controlId="overlay">
              <Form.Label>Overlay</Form.Label>
              <Form.Select
                required
                placeholder="Overlay"
                name="overlay"
                onChange={handleChange}
                value={values.overlay}
                isInvalid={!!errors.overlay}
              >
                {overlays}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.overlay}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                This is the overlay that will be shown above the image and will
                contain your info.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={7}>
            <img
              alt="Overlay Preview"
              className="img-thumbnail mx-auto d-block"
              src={`/img/overlay/${values.overlay}.png`}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={5}>
            <Form.Group className="mb-3" controlId="background">
              <Form.Label>Background</Form.Label>
              <Form.Select
                required
                placeholder="Background"
                name="background"
                onChange={handleChange}
                value={values.background}
                isInvalid={!!errors.background}
              >
                {backgrounds}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.background}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={7}>
            <img
              alt="Background Preview"
              className="img-thumbnail mx-auto d-block"
              src={`/img/background/${values.background}`}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={5}>
            <Form.Group className="mb-3" controlId="flag">
              <Form.Label>Flag</Form.Label>
              <Form.Select
                required
                placeholder="Flag"
                name="flag"
                onChange={handleChange}
                value={values.flag}
                isInvalid={!!errors.flag}
              >
                {flags}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.flag}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={7}>
            <img
              alt="Flag Preview"
              className="img-fluid mx-auto d-block no-shadow mt-3"
              src={`/img/flag/${values.flag}.png`}
            />
          </Col>
        </Row>

        <Row>
          <Col md={5}>
            <Form.Group className="mb-3" controlId="coin">
              <Form.Label>Coin</Form.Label>
              <Form.Select
                required
                placeholder="Coin"
                name="coin"
                onChange={handleChange}
                value={values.coin}
                isInvalid={!!errors.coin}
              >
                {coins}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.coin}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          {values.coin !== 'default' && (
            <Col md={7}>
              <img
                alt="Coin Preview"
                className="img-fluid mx-auto d-block no-shadow mt-3"
                src={`/img/coin/${values.coin}.png`}
              />
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
}

ImagesCard.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ImagesCard;
