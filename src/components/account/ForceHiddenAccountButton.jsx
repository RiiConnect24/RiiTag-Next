import { React, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import useInfo from '@/lib/swr-hooks/useInfo'
import ConfirmationModal from '../shared/ConfirmationModal'
import { Button, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default function ForceHiddenAccountButton ({ isHidden, id }) {
  const router = useRouter()
  const { mutate } = useInfo()

  const [show, setShow] = useState(false)

  const toggleModal = () => setShow(!show)

  let reason = ''
  let shadow = false

  const deleteAccount = async () => {
    const response = await fetch('/api/account/hide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason,
        shadow,
        user: id
      })
    })
    if (response.status === 200) {
      toast.success('The account has been hidden.')
      mutate()
      router.reload()
    } else {
      toast.error('An error occured, please try again later.')
    }
  }

  const undeleteAccount = async () => {
    const response = await fetch('/api/account/unhide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: id
      })
    })
    if (response.status === 200) {
      toast.success('The account has been unhidden.')
      mutate()
      router.reload()
    } else {
      toast.error('An error occured, please try again later.')
    }
  }

  return (
    <>
      <ConfirmationModal
        title='Hide Account'
        cancelText='Cancel'
        confirmText='Confirm'
        confirmVariant='danger'
        show={show}
        toggleModal={toggleModal}
        onSubmit={deleteAccount}
      >
        Do you really want to{' '}
        <strong>
          <u>hide this account</u>
        </strong>
        ?
        <br />
        <ul className='d-block mt-3'>
          <li>This user will not appear on the public listing or front page.</li>
          <li>They will still be able to use the platform normally.</li>
        </ul>
        <b>Reason:</b>
        <Form.Control className='mt-2' onKeyUp={(e) => { reason = e.target.value }} as='textarea' rows={3} />
        <Form.Check className='mt-2' type='checkbox' label='Do not notify the user of this action.' onChange={(e) => { shadow = e.target.checked }} />
      </ConfirmationModal>
      <Button variant='danger' onClick={() => isHidden ? undeleteAccount() : toggleModal()}>
        {isHidden ? 'Unhide' : 'Force Hidden'}
      </Button>
    </>
  )
}

ForceHiddenAccountButton.propTypes = {
  id: PropTypes.number.isRequired,
  isHidden: PropTypes.bool.isRequired
}
