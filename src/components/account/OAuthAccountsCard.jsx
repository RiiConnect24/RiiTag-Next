import React from 'react'
import PropTypes from 'prop-types'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import dayjs from '@/lib/dayjs'
import { DATE_FORMAT } from '@/lib/constants/miscConstants'
import { Card, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function OAuthAccountsCard ({ accounts }) {
  const getProvider = ({ created_at: createdAt, provider_id: providerId }) => (
    <Row key={providerId}>
      <Col>
        {providerId === 'discord'
          ? OAuthAccountsCard.Account(faDiscord, 'Discord')
          : OAuthAccountsCard.Account(faQuestion, 'Unknown')}{' '}
        - Linked on {dayjs(createdAt).format(DATE_FORMAT)}

        {accounts.length === 1 && (
          <>
            <br />
            <i>You cannot unlink your only account.</i>
          </>
        )}
      </Col>
    </Row>
  )

  return (
    <Card className='mb-3' bg='secondary' text='white'>
      <Card.Header className='h5'>Linked accounts</Card.Header>
      <Card.Body>
        {accounts.map((account) => getProvider(account))}
        {/* <hr /> */}
      </Card.Body>
    </Card>
  )
}

OAuthAccountsCard.Account = function Account (icon, text) {
  return (
    <>
      <FontAwesomeIcon className='me-1' icon={icon} />
      <strong>{text}</strong>
    </>
  )
}

OAuthAccountsCard.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default OAuthAccountsCard
