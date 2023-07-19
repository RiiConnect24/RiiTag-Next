import React from 'react'
import { Card } from 'react-bootstrap'
import RefreshTagButton from './RefreshTagButton'
import ExportButton from './ExportButton'
import DeleteAccountButton from './DeleteAccountButton'

export default function AccountCard () {
  return (
    <Card className='mb-3' bg='secondary' text='light'>
      <Card.Header className='h5'>LinkTag Account</Card.Header>
      <Card.Body>
        <div className='d-flex gap-1 flex-column flex-sm-row'>
          <RefreshTagButton />
          <ExportButton />
          <DeleteAccountButton />
        </div>
      </Card.Body>
    </Card>
  )
}
