import { React, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import useInfo from '@/lib/swr-hooks/useInfo'
import ConfirmationModal from '../shared/ConfirmationModal'
import { Button } from 'react-bootstrap'

export default function DeleteAccountButton () {
  const router = useRouter()
  const { mutate } = useInfo()

  const [show, setShow] = useState(false)

  const toggleModal = () => setShow(!show)

  const deleteAccount = async () => {
    const response = await fetch('/api/account/delete-account', {
      method: 'POST'
    })
    if (response.status === 200) {
      toast.success('Your account has been deleted.')
      mutate()
      router.push('/')
    } else {
      toast.error('An error occured, please try again later.')
    }
  }

  return (
    <>
      <ConfirmationModal
        title='Delete Account'
        cancelText='No, I want to stay!'
        confirmText='Yes, delete my account'
        confirmVariant='danger'
        show={show}
        toggleModal={toggleModal}
        onSubmit={deleteAccount}
      >
        Do you really want to{' '}
        <strong>
          <u>delete your account all of its contents</u>
        </strong>
        ?
        <br />
        <ul className='d-block mt-3'>
          <li>Your username won&apos;t be reserved</li>
          <li>Make sure to remove your LinkTag from forum signatures, etc.</li>
          <li>You can re-register at any time</li>
          <li>
            You can export your data on the account page beforehand if you like
          </li>
          <li>
            You should remove LinkTag in the settings of the social media
            provider (e.g. Discord)
          </li>
        </ul>
        <strong>This cannot be undone!</strong>
      </ConfirmationModal>
      <Button variant='danger' onClick={() => toggleModal()}>
        Delete your Account
      </Button>
    </>
  )
}
