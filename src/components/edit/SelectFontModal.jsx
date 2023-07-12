import PropTypes from 'prop-types'
import { React, useState } from 'react'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap'

function SelectFontModal ({ options, field, form }) {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const select = (value) => {
    form.setFieldValue(field.name, value)
    handleClose()
  }

  return (
    <>
      <Button variant='primary' onClick={handleShow}>
        Select Font
      </Button>

      <Modal size='lg' fullscreen='lg-down' show={show} onHide={handleClose}>
        <Modal.Header closeButton closeVariant='white'>
          <Modal.Title>Select a font</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row md={4} className='g-3'>
            {options.map((option, index) => (
              <Col key={index}>
                <Card bg='dark border-0'>
                  <Card.Img
                    alt={`${option.label} Preview`}
                    className='img-thumbnail'
                    variant='top'
                    src={`/img/font/${
                      option.value === 'default' ? 'RodinNTLG' : option.value
                    }.png`}
                  />
                  <Card.Body>
                    <Card.Title>
                      <a
                        href='#'
                        className='stretched-link text-decoration-none text-white'
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
          <Button variant='light' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

SelectFontModal.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onBlur: PropTypes.func.isRequired
  }).isRequired,
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired
  }).isRequired
}

export default SelectFontModal
