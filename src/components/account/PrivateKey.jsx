import { Button, Col, Form, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faCopy,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

function PrivateKey({ randkey, toggleModal }) {
  const [show, setShow] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const copy = () => {
    navigator.clipboard
      .writeText(randkey)
      .then(() => setCopySuccess(true))
      .then(() => setTimeout(() => setCopySuccess(false), 1500));
  };

  return (
    <>
      <Row className="mb-1">
        <Col>
          <Form.Control
            type={show ? 'text' : 'password'}
            readOnly
            value={randkey}
          />
        </Col>
      </Row>

      <Row>
        <div className="d-flex gap-1 justify-content-between">
          <Button variant="primary" onClick={() => setShow(!show)}>
            <FontAwesomeIcon
              className="me-1"
              icon={show ? faEyeSlash : faEye}
            />
            {show ? 'Hide' : 'Show'}
          </Button>{' '}
          <Button variant={copySuccess ? 'success' : 'light'} onClick={copy}>
            <FontAwesomeIcon
              className="me-1"
              icon={copySuccess ? faCheck : faCopy}
            />
            {copySuccess ? 'Copied!' : 'Copy'}
          </Button>
          <Button variant="danger" onClick={toggleModal}>
            Reset Key
          </Button>
        </div>
      </Row>
    </>
  );
}

PrivateKey.propTypes = {
  randkey: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default PrivateKey;
