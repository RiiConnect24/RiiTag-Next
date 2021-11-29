import { Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import styles from '@/styles/modules/credits.module.scss';

function CreditsPage() {
  return (
    <Container>
      <NextSeo title="Credits" />
      <Row className="mb-3">
        <Col xs={9}>
          <p className="h2">Without these people, RiiTag would not exist:</p>
          <ul>
            <li>
              <strong>Artuto</strong>: Added RiiTag support to RiiConnect24 Bot
            </li>
            <li>
              <strong>bendevnull</strong>: Main developer of the project
            </li>
            <li>
              <strong>blackb0x</strong>: Added RiiTag support to his USB Loader
              GX Mod
            </li>
            <li>
              <strong>
                <a
                  href="https://wiidatabase.de"
                  target="_blank"
                  rel="external noopener noreferrer"
                >
                  Brawl345
                </a>
              </strong>
              : Wrote massive rewrite of RiiTag
            </li>
            <li>
              <strong>daileon</strong>: Created Wiinnertag (no longer
              available), which heavily inspired RiiTag
            </li>
            <li>
              <strong>dhtdht020</strong>: Created some RiiTag overlays
            </li>
            <li>
              <strong>DismissedGuy</strong>: Created RiiTag-RPC
            </li>
            <li>
              <strong>DLEDeviant</strong>: Created&nbsp;
              <a
                href="https://www.deviantart.com/dledeviant/art/Nintendo-U-Version-3-595000916"
                target="_blank"
                rel="external noopener noreferrer"
              >
                Nintendo Font U
              </a>
              , one of the selectable fonts for the tag
            </li>
            <li>
              <strong>fledge68</strong>: Added RiiTag support to WiiFlow Lite
            </li>
            <li>
              <strong>Larsenv</strong>: Main developer of project, director
            </li>
            <li>
              <strong>Lustar</strong>: Owner of GameTDB which RiiTag uses, was
              one of the people who suggested RiiTag&apos;s name
            </li>
            <li>
              <strong>Matthe815</strong>: Additional developer of project
            </li>
            <li>
              <strong>ShadowPuppet</strong>: Created DUTag (no longer
              available), which heavily inspired RiiTag
            </li>
            <li>
              <strong>TheShadowEevee</strong>: additional developer of project,
              added Cemu and Citra support
            </li>
            <li>
              <strong>twosecslater</strong>: Created U-Tag (RiiTag plugin for
              Wii U)
            </li>
            <li>
              <strong>You</strong>: For using RiiTag!
            </li>
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
    </Container>
  );
}

export default CreditsPage;
