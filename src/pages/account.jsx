import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import safeJsonStringify from 'safe-json-stringify'
import PropTypes from 'prop-types'
import { NextSeo } from 'next-seo'
import { withSession } from '@/lib/iron-session'
import prisma from '@/lib/db'
import PrivateKeyCard from '@/components/account/PrivateKeyCard'
import OAuthAccountsCard from '@/components/account/OAuthAccountsCard'
import AccountCard from '@/components/account/AccountCard'
import ENV from '@/lib/constants/environmentVariables'

export const getServerSideProps = withSession(async ({ req }) => {
  const username = req.session?.username

  if (!username) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const accountInfo = await prisma.user.findFirst({
    where: {
      username
    },
    select: {
      randkey: true,
      accounts: {
        select: {
          provider_id: true,
          provider_account_id: true,
          created_at: true
        }
      }
    }
  })

  return { props: { accountInfo: JSON.parse(safeJsonStringify(accountInfo)) } }
})

function AccountPage ({ accountInfo }) {
  return (
    <Container>
      <NextSeo
        title='Account'
        openGraph={{
          url: `${ENV.BASE_URL}/account`
        }}
      />
      <Row>
        <Col lg={6}>
          <OAuthAccountsCard accounts={accountInfo.accounts} />
          <AccountCard />
        </Col>
        <Col lg={6}>
          <PrivateKeyCard randkey={accountInfo.randkey} />
        </Col>
      </Row>
    </Container>
  )
}

AccountPage.propTypes = {
  accountInfo: PropTypes.object.isRequired
}

export default AccountPage
