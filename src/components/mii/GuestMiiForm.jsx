import React from 'react'
import PropTypes from 'prop-types'
import { GUEST_MIIS } from '@/lib/constants/forms/guestMiis'
import { Form } from 'react-bootstrap'

function GuestMiiForm ({ value, handleChange }) {
  return (
    <Form.Group className='text-center'>
      {GUEST_MIIS.map((guestMii) => (
        <Form.Check
          key={guestMii.value}
          id={`guest-mii-${guestMii.value}`}
          type='radio'
          inline
        >
          <Form.Check.Input
            className='me-1'
            type='radio'
            name='guestMii'
            value={guestMii.value}
            checked={value === guestMii.value}
            onChange={handleChange}
          />
          <Form.Check.Label>
            <img
              className='d-block'
              alt={guestMii.label}
              src={`/img/miis/guests/${guestMii.value}.png`}
              height={128}
              width={128}
            />
            {guestMii.label}
          </Form.Check.Label>
        </Form.Check>
      ))}
    </Form.Group>
  )
}

GuestMiiForm.propTypes = {
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
}

export default GuestMiiForm
