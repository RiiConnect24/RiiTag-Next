import { React, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import useInfo from '@/lib/swr-hooks/useInfo'
import ConfirmationModal from '../shared/ConfirmationModal'
import { Button, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default function BanAccountButton ({ isBanned, id }) {
  const router = useRouter()
  const { mutate } = useInfo()

  const [show, setShow] = useState(false)

  const toggleModal = () => setShow(!show)

  let reason = ''

  const deleteAccount = async () => {
    const response = await fetch('/api/account/ban', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason,
        user: id
      })
    })
    if (response.status === 200) {
      toast.success('The account has been banned.')
      mutate()
      router.reload()
    } else {
      toast.error('An error occured, please try again later.')
    }
  }

  const undeleteAccount = async () => {
    const response = await fetch('/api/account/unban', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: id
      })
    })
    if (response.status === 200) {
      toast.success('The account has been unbanned.')
      mutate()
      router.reload()
    } else {
      toast.error('An error occured, please try again later.')
    }
  }

  return (
    <>
      <ConfirmationModal
        title='Ban Account'
        cancelText='Cancel'
        confirmText='Confirm'
        confirmVariant='danger'
        show={show}
        toggleModal={toggleModal}
        onSubmit={deleteAccount}
      >
        Do you really want to{' '}
        <strong>
          <u>ban this account</u>
        </strong>
        ?
        <br />
        <ul className='d-block mt-3'>
          <li>This user will not be able to re-register under the same IP address or account.</li>
          <li>Content by this user will be preserved but hidden.</li>
        </ul>
        <b>Reason:</b>
        <Form.Control className='mt-2' onKeyUp={(e) => { reason = e.target.value }} as='textarea' rows={3} />
      </ConfirmationModal>
      <Button variant='danger' onClick={() => isBanned ? undeleteAccount() : toggleModal()}>
        {isBanned ? 'Unban Account' : 'Ban Account'}
      </Button>
    </>
  )
}

BanAccountButton.propTypes = {
  id: PropTypes.number.isRequired,
  isBanned: PropTypes.bool.isRequired
}
