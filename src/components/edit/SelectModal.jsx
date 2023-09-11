import PropTypes from 'prop-types';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { useState } from 'react';
import { Field } from 'formik';

function SelectComponent({ btnTitle, title, img, options, field, form }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const select = (value) => {
    form.setFieldValue(field.name, value);
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {btnTitle}
      </Button>

      <Modal size="lg" fullscreen="lg-down" show={show} onHide={handleClose}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row xs={1} md={2} lg={3} className="g-3">
            {options.map((option, index) => (
              <Col key={index}>
                <Card bg="dark border-0">
                  <Card.Img
                    alt={`${option.label} Preview`}
                    className="img-thumbnail"
                    variant="top"
                    src={img(option.value)}
                  />
                  <Card.Body>
                    <Card.Title>
                      <a
                        href="#"
                        className="stretched-link text-decoration-none text-white"
                        onClick={() => select(option.value)}
                      >
                        {option.label}
                      </a>
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function SelectModal({ btnTitle, title, img, options, name }) {
  return (
    <Field
      btnTitle={btnTitle}
      title={title}
      img={img}
      name={name}
      component={SelectComponent}
      options={options}
    />
  );
}

SelectComponent.propTypes = {
  btnTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  img: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onBlur: PropTypes.func.isRequired,
  }).isRequired,
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};

SelectModal.propTypes = {
  btnTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  img: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  name: PropTypes.string.isRequired,
};

SelectModal.defaultProps = {
  btnTitle: 'Select',
};

export default SelectModal;
