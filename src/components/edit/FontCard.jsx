import { Card, Col, Form, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { createOptionNodes } from '@/lib/utils/utils';
import { FONTS } from '@/lib/constants/forms/fonts';

const fonts = createOptionNodes(FONTS);

function FontCard({ values, errors, handleChange }) {
  return (
    <Card className="mb-3" bg="secondary" text="white">
      <Card.Header as="h5">Font</Card.Header>
      <Card.Body>
        <Form.Group className="mb-3" controlId="coverRegion">
          <Form.Label className="d-none">Font</Form.Label>
          <Form.Select
            required
            placeholder="Font"
            name="font"
            onChange={handleChange}
            value={values.font}
            isInvalid={!!errors.font}
          >
            {fonts}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.font}
          </Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col>
            <img
              className="w-50 d-block mx-auto"
              src={`/img/font/${
                values.font === 'default' ? 'RodinNTLG' : values.font
              }.png`}
              alt="Font Preview"
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

FontCard.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default FontCard;
