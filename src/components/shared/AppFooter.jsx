import React from 'react'
import ENV from '@/lib/constants/environmentVariables'
import { Col, Container, Row } from 'react-bootstrap'
import Link from 'next/link'
import LanguageContext from './LanguageContext'
import LocalizedString from './LocalizedString'

function AppFooter () {
  return (
    <LanguageContext.Helper.Consumer>
      {(lang) => (
        <Container fluid className='mt-auto py-2 bg-secondary'>
          <Row>
            <Col className='text-muted text-start'>
              &copy; LinkTag 2023 - {new Date().getFullYear()}
              {' '}
              -{' '}
              <Link href='/credits' className='text-muted'>
                <LocalizedString string={'credits'} values={[]}/>
              </Link>{' '}
              -{' '}
              <Link href='/about' className='text-muted'>
                About
              </Link>
            </Col>
            {ENV.STAGING === 'true' && (
              <Col className='text-danger'>
                This is a PREVIEW. Data may be deleted at any time!
              </Col>
            )}
            <Col className='text-muted text-end'>
              <Link href='/privacy-policy' className='text-muted'>
                Privacy Policy
              </Link>{' '}
              -{' '}
              <Link href='/tos' className='text-muted'>
                Terms of Service
              </Link>{' '}
              -{' '}
              <a
                className='text-muted'
                href='https://github.com/bennyman123abc/LinkTag'
                rel='external noopener noreferrer'
                target='_blank'
              >
                Source
              </a>
            </Col>
          </Row>
        </Container>
      )}
    </LanguageContext.Helper.Consumer>
  )
}

export default AppFooter
