import { Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';
import styles from '@/styles/modules/credits.module.scss';
import ENV from '@/lib/constants/environmentVariables';
import { withSession } from '@/lib/iron-session';
import prisma from '@/lib/db';
import Contributor from '@/components/credits/Contributor';

const musicList = [
  'XI12BK9VC3U', // SM64
  'txe5UbkbqK0', // MK64
  '87UysJxGiso', // PM64
  'wvls_xrms3Q', // PMCS
  'yZGQXG7Vy1I', // SMG
  'V2-LgaXCnco', // SMS
  'gZTAaJucWYY', // SMO
  '2DRwPEvJrA8', // MK8
];

function getRandomCreditsMusic() {
  return musicList[Math.floor(Math.random() * musicList.length)];
}

export const getServerSideProps = withSession(async ({ req }) => {
  const username = req.session?.username;

  if (!username) {
    return {
      props: {
        name_on_riitag: 'You',
      },
    };
  }

  const accountInfo = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      name_on_riitag: true,
    },
  });

  return { props: { name_on_riitag: accountInfo.name_on_riitag } };
});

function CreditsPage({ name_on_riitag }) {
  return (
    <Container>
      <NextSeo
        title="Credits"
        openGraph={{
          url: `${ENV.BASE_URL}/credits`,
        }}
      />
      <Row className="mb-3">
        <Col xs={9}>
          <p className="h2">Without these people, RiiTag would not exist:</p>
          <ul>
            <Contributor name="Artuto">
              Added RiiTag support to the RiiConnect24 Bot
            </Contributor>
            <Contributor name="bendevnull">
              Lead developer and designer of RiiTag
            </Contributor>
            <Contributor name="blackb0x">
              Added official RiiTag support to his modification of USB Loader GX
            </Contributor>
            <Contributor name="Brawl345" link="https://wiidatabase.de">
              Completely rewrote RiiTag, and revived version 2.0 (RiiTag-Next)
            </Contributor>
            <Contributor name="daileon">
              Created Wiinnertag (no longer available), which heavily inspired
              RiiTag
            </Contributor>
            <Contributor name="dhtdht020">
              Created several RiiTag overlays, provided some of the backgrounds,
              and created RiiTag&apos;s iconic logo
            </Contributor>
            <Contributor name="DismissedGuy">
              Created RiiTag-RPC for Discord
            </Contributor>
            <Contributor name="DLEDeviant">
              Created the font&nbsp;
              <a
                href="https://www.deviantart.com/dledeviant/art/Nintendo-U-Version-3-595000916"
                target="_blank"
                rel="external noopener noreferrer"
              >
                Nintendo U Version 3
              </a>
              , one of the selectable fonts.
            </Contributor>
            <Contributor name="feldge68">
              Added RiiTag support to WiiFlow Lite
            </Contributor>
            <Contributor name="HEYimHeroic">
              Created mii2studio, and did a lot of work for the Mii
              implementation
            </Contributor>
            <Contributor name="Larsenv">
              The founder of RiiConnect24
            </Contributor>
            <Contributor name="Lustar">
              Creator and owner of GameTDB; the database of games that RiiTag
              uses
            </Contributor>
            <Contributor name="Matthe815">
              Additional developer and encyclopedia for the project
              {Math.floor(Math.random() * 100_000) === 1
                ? ' (and dominating the entire world!)'
                : ''}
            </Contributor>
            <Contributor name="ShadowPuppet">
              Created DUTag (no longer available), which heavily inspired RiiTag
            </Contributor>
            <Contributor name="TheShadowEevee">
              Additional developer of the project, and added Cemu and Citra
              support
            </Contributor>
            <Contributor name="twosecslater">
              Created U-Tag, the RiiTag plugin for Wii U
            </Contributor>
            <Contributor
              name={
                name_on_riitag !== 'You' ? `${name_on_riitag} (You)` : 'You'
              }
            >
              For using RiiTag!
            </Contributor>
          </ul>
        </Col>
        <Col xs={3} className="text-end">
          <Image
            className={`${styles.spin} no-shadow`}
            alt="Star"
            width={104}
            height={104}
            unoptimized
            src="/star.png"
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col className="text-center">
          <p className="h3">Thank You!</p>
        </Col>
      </Row>
      {/* <CreditsMusic */}
      {/*  videoId={getRandomCreditsMusic()} */}
      {/*  getMusic={getRandomCreditsMusic} */}
      {/* /> */}
    </Container>
  );
}

CreditsPage.propTypes = {
  name_on_riitag: PropTypes.string,
};

CreditsPage.defaultProps = {
  name_on_riitag: 'You',
};

export default CreditsPage;
