import PropTypes from 'prop-types'
import { React, useState } from 'react'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap'

function SelectCoinModal ({ options, field, form }) {
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
        Select Coin
      </Button>

      <Modal size='lg' fullscreen='lg-down' show={show} onHide={handleClose}>
        <Modal.Header closeButton closeVariant='white'>
          <Modal.Title>Select a coin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><b>NOTE:</b> Coins are used to indicate how many games you have played. You cannot spend your coins.</p>
          <Row xs={4} className='g-3'>
            {options.map((option, index) => (
              <Col key={index}>
                <Card bg='dark border-0'>
                  <Card.Body>
                    <Card.Title>
                      {option.value !== 'default' && (
                        <p className='text-center'>
                          <img
                            alt={`${option.label} Preview`}
                            src={`/img/coin/${option.value}.png`}
                          />
                        </p>
                      )}
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

SelectCoinModal.propTypes = {
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

export default SelectCoinModal
