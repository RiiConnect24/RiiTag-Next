import PropTypes from 'prop-types'
import { React, useState } from 'react'
import {
  faCheck,
  faCopy,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import ENV from '@/lib/constants/environmentVariables'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Copying to clipboard does NOT work on HTTP, only HTTPS + localhost
const canCopy = ENV.BASE_URL.startsWith('https://') || ENV.IS_DEV

function PrivateKey ({ randkey, toggleModal }) {
  const [show, setShow] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const copy = () => {
    navigator.clipboard
      .writeText(randkey)
      .then(() => setCopySuccess(true))
      .then(() => setTimeout(() => setCopySuccess(false), 1500))
  }

  return (
    <>
      <Row className='mb-1'>
        <Col>
          <Form.Control
            type={show ? 'text' : 'password'}
            readOnly
            value={randkey}
          />
        </Col>
      </Row>

      <Row>
        <div className='d-flex gap-4 justify-content-between'>
          <Button variant='primary' onClick={() => setShow(!show)}>
            <FontAwesomeIcon
              className='me-1'
              icon={show ? faEyeSlash : faEye}
            />
            {show ? 'Hide' : 'Show'}
          </Button>{' '}
          {canCopy && (
            <Button variant={copySuccess ? 'success' : 'light'} onClick={copy}>
              <FontAwesomeIcon
                className='me-1'
                icon={copySuccess ? faCheck : faCopy}
              />
              {copySuccess ? 'Copied!' : 'Copy'}
            </Button>
          )}
          <Button variant='danger' onClick={toggleModal}>
            Reset Key
          </Button>
        </div>
      </Row>
    </>
  )
}

PrivateKey.propTypes = {
  randkey: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired
}

export default PrivateKey
