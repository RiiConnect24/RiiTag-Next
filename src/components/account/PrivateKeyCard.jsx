import PropTypes from 'prop-types'
import { React, useState } from 'react'
import { Alert, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import ConfirmationModal from '../shared/ConfirmationModal'
import PrivateKey from './PrivateKey'

function PrivateKeyCard ({ randkey }) {
  const [show, setShow] = useState(false)
  const [key, setKey] = useState(randkey)

  const toggleModal = () => setShow(!show)

  const resetKey = async () => {
    toggleModal()

    const response = await fetch('/api/account/reset-private-key', {
      method: 'POST'
    })

    if (response.status === 200) {
      const data = await response.json()
      setKey(data.randkey)
      toast.success('Private Key has been reset!')
    } else {
      toast.error('An error occured, please try again later.')
    }
  }

  return (
    <Card className='mb-3' bg='secondary' text='white'>
      <ConfirmationModal
        title='Reset Private Key'
        confirmText='Yes, reset Private Key'
        confirmVariant='danger'
        toggleModal={toggleModal}
        show={show}
        onSubmit={resetKey}
      >
        Do you really want to <strong>reset your LinkTag Private Key</strong>?
        You will need to reconfigure your USB loaders, etc!
      </ConfirmationModal>
      <Card.Header className='h5'>linktag Private Key</Card.Header>
      <Card.Body>
        <Alert variant='warning'>
          Do not share this key with anyone, as it can be used to update your
          linktag!
        </Alert>
        <hr />
        <PrivateKey randkey={key} toggleModal={toggleModal} />
        <hr />
        <i>
          You can also{' '}
          <a rel='external' href='/Wiinnertag.xml' download='Wiinnertag.xml'>
            download your Wiinnertag.xml
          </a>
          .
        </i>
      </Card.Body>
    </Card>
  )
}

PrivateKeyCard.propTypes = {
  randkey: PropTypes.string.isRequired
}

export default PrivateKeyCard
