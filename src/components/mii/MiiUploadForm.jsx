import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

function MiiUploadForm ({ setFieldValue, error }) {
  return (
    <Form.Group controlId='miiFile' className='mb-3'>
      <Form.Label>Upload your Mii binary file or QR code.</Form.Label>
      <Form.Control
        accept='.jpg,.mae'
        name='file'
        type='file'
        isInvalid={!!error}
        onChange={(event) => {
          setFieldValue('file', event.currentTarget.files[0])
        }}
      />
      <Form.Control.Feedback type='invalid'>{error}</Form.Control.Feedback>
      <Form.Text>
        Some QR codes may not be supported. Known working codes are from 3DS,
        Wii U, Miitomo, Tomodachi Life and Miitopia (.jpg). Known working binary
        files are in Wii format (.mae).
      </Form.Text>
    </Form.Group>
  )
}

MiiUploadForm.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  error: PropTypes.string
}

MiiUploadForm.defaultProps = {
  error: null
}

export default MiiUploadForm
