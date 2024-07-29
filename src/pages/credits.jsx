import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import PropTypes from 'prop-types'
import styles from '@/styles/modules/credits.module.scss'
import ENV from '@/lib/constants/environmentVariables'
import { withSession } from '@/lib/iron-session'
import prisma from '@/lib/db'
import Contributor from '@/components/credits/Contributor'

export const getServerSideProps = withSession(async ({ req }) => {
  const username = req.session?.username

  if (!username) {
    return {
      props: {
        display_name: 'You'
      }
    }
  }

  const accountInfo = await prisma.user.findFirst({
    where: {
      username
    },
    select: {
      display_name: true
    }
  })

  return { props: { display_name: accountInfo.display_name } }
})

function CreditsPage ({ display_name: wiitagName }) {
  return (
    <Container>
      <NextSeo
        title='Credits'
        openGraph={{
          url: `${ENV.BASE_URL}/credits`
        }}
      />
      <Row className='mb-3'>
        <Col xs={9}>
          <p className='h2'>Without these people, LinkTag would not exist:</p>
          <ul>
            <Contributor name='Matthe815'>
              Lead Developer for LinkTag
              {Math.floor(Math.random() * 100_000) === 1
                ? ' (and dominating the entire world!)'
                : ''}
            </Contributor>
            <Contributor name='Artuto'>
              Added LinkTag support to the RiiConnect24 Bot
            </Contributor>
            <Contributor name='bendevnull'>
              Prior developer and designer of LinkTag
            </Contributor>
            <Contributor name='blackb0x'>
              Added official LinkTag support to his modification of USB Loader GX
            </Contributor>
            <Contributor name='Brawl345' link='https://wiidatabase.de'>
              Completely rewrote LinkTag into version 2.0 (LinkTag-Next)
            </Contributor>
            <Contributor name='daileon'>
              Created Wiinnertag (no longer available), which heavily inspired
              LinkTag
            </Contributor>
            <Contributor name='dhtdht020'>
              Created some of the LinkTag overlays
            </Contributor>
            <Contributor name='DismissedGuy'>
              Created LinkTag-RPC for Discord
            </Contributor>
            <Contributor name='DLEDeviant'>
              Created the font&nbsp;
              <a
                href='https://www.deviantart.com/dledeviant/art/Nintendo-U-Version-3-595000916'
                target='_blank'
                rel='external noopener noreferrer'
              >
                Nintendo U Version 3
              </a>
              , one of the selectable fonts.
            </Contributor>
            <Contributor name='fledge68'>
              Added LinkTag support to WiiFlow Lite
            </Contributor>
            <Contributor name='Genwald'>Mii support</Contributor>
            <Contributor name='HEYimHeroic'>Mii support</Contributor>
            <Contributor name='jaames'>
              Figured out how to decrypt Mii QR codes
            </Contributor>
            <Contributor name='Lustar'>
              Creator and owner of GameTDB; the database of games that LinkTag
              uses, also came up with the name LinkTag
            </Contributor>
            <Contributor name='PF2M'>Mii support</Contributor>
            <Contributor name='ShadowPuppet'>
              Created DUTag (no longer available), which heavily inspired LinkTag
            </Contributor>
            <Contributor name='TheShadowEevee'>
              Additional developer of the project, and helped add Cemu and Citra
              support
            </Contributor>
            <Contributor name='twosecslater'>
              Created U-Tag, the LinkTag plugin for Wii U
            </Contributor>
            <Contributor
              name={
                wiitagName === 'You' ? 'You' : `${wiitagName} (You)`
              }
            >
              For using LinkTag!
            </Contributor>
          </ul>
        </Col>
        <Col xs={3} className='text-end'>
          <Image
            className={`${styles.spin} no-shadow`}
            alt='Star'
            width={104}
            height={104}
            unoptimized
            src='/star.png'
          />
        </Col>
      </Row>
      <Row className='mb-3'>
        <Col className='text-center'>
          <p className='h3'>Thank You!</p>
        </Col>
      </Row>
    </Container>
  )
}

CreditsPage.propTypes = {
  display_name: PropTypes.string
}

CreditsPage.defaultProps = {
  display_name: 'You'
}

export default CreditsPage
