import React from 'react'
import PropTypes from 'prop-types'
import { Col, Container, Row } from 'react-bootstrap'
import { NextSeo } from 'next-seo'
import prisma from '@/lib/db'
import styles from '@/styles/modules/editor-text.module.scss'
import ENV from '@/lib/constants/environmentVariables'
import { isBlank } from '@/lib/utils/utils'

export async function getStaticProps () {
  const tos = await prisma.sys.findUnique({
    where: {
      key: 'tos'
    }
  })

  return {
    props: {
      tos: isBlank(tos?.value) ? '<i>No TOS defined...</i>' : tos.value
    },
    revalidate: 1
  }
}

function TosPage ({ tos }) {
  return (
    <Container>
      <NextSeo
        title='Terms of Service'
        openGraph={{
          url: `${ENV.BASE_URL}/tos`
        }}
      />
      <Row>
        <Col>
          <h1>Terms of Service</h1>
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col
          className={styles.editorText}
          dangerouslySetInnerHTML={{ __html: tos }}
        />
      </Row>
    </Container>
  )
}

TosPage.propTypes = {
  tos: PropTypes.string.isRequired
}

export default TosPage
