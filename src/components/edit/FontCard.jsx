import { Alert, Card, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FONTS } from '@/lib/constants/forms/fonts';
import { Field } from 'formik';
import SelectFontModal from '@/components/edit/SelectFontModal';

function FontCard({ values, errors }) {
  return (
    <Card className="mb-3" bg="secondary" text="white">
      <Card.Header as="h5">Font</Card.Header>
      <Card.Body>
        <Row>
          <Col md={5} className="mb-3">
            <Field name="font" component={SelectFontModal} options={FONTS} />
            {errors.font && (
              <Alert className="mt-2 p-2" variant="danger">
                {errors.font}
              </Alert>
            )}
          </Col>
          <Col md={7}>
            <img
              className="img-fluid mx-auto d-block"
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
};

export default FontCard;
