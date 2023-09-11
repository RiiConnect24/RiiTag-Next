import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

function CmocForm({ value, handleChange, handleBlur, error, touched }) {
  return (
    <Form.Group className="text-center" controlId="cmoc-entry-no">
      <Form.Label>Check Mii Out Channel Entry Number</Form.Label>
      <Form.Control
        type="text"
        placeholder="Check Mii Out Channel Entry Number"
        name="cmocEntryNo"
        onChange={handleChange}
        onBlur={handleBlur}
        isInvalid={!!error}
        isValid={touched && !error}
        value={value}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      <Form.Text className="text-muted">
        You can browse all Miis from the Check Mii Out Channel on{' '}
        <a
          href="https://mii.rc24.xyz/"
          rel="noopener noreferrer"
          target="_blank"
        >
          mii.rc24.xyz
        </a>
        . The entry number can be entered with or without dashes
      </Form.Text>
    </Form.Group>
  );
}

CmocForm.propTypes = {
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
  touched: PropTypes.object.isRequired,
};

CmocForm.defaultProps = {
  error: null,
};

export default CmocForm;
