import { Button, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faQuestionCircle,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import dayjs from '@/lib/dayjs';
import { DATE_FORMAT } from '@/lib/constants/miscConstants';
import { OVERLAYS } from '@/lib/constants/forms/overlays';
import { COINS } from '@/lib/constants/forms/coins';
import { FLAGS } from '@/lib/constants/forms/flags';
import { FONTS } from '@/lib/constants/forms/fonts';
import { COVER_REGIONS } from '@/lib/constants/forms/coverRegions';
import { COVER_TYPES } from '@/lib/constants/forms/coverTypes';

function UserInformationCard({ user, isLoggedIn }) {
  return (
    <Card className="mb-3" bg="secondary" text="white">
      <Card.Header as="h5">User Information</Card.Header>
      <Card.Body>
        <ul className="list-unstyled m-0">
          <li>
            <strong>Name:</strong> {user.name_on_riitag}
          </li>
          {dayjs(user.created_at).format(DATE_FORMAT) === "4th August 2022" ? ("") : (<li><strong>Registered:</strong>{' '} {dayjs(user.created_at).format(DATE_FORMAT)}</li>)}
          <li>
            <strong>Overlay:</strong>{' '}
            {OVERLAYS.find((overlay) => overlay.value === user.overlay).label}
          </li>
          <li>
            <strong>Background:</strong> {user.background}
          </li>
          <li>
            <strong>Coin:</strong>{' '}
            {COINS.find((coin) => coin.value === user.coin).label}
          </li>
          <li>
            <strong>Flag:</strong>{' '}
            {FLAGS.find((flag) => flag.value === user.flag).label}
          </li>
          <li>
            <strong>Font:</strong>{' '}
            {FONTS.find((font) => font.value === user.font).label}
          </li>
          <li>
            <strong>Cover Region:</strong>{' '}
            {
              COVER_REGIONS.find(
                (cover_region) => cover_region.value === user.cover_region
              ).label
            }
          </li>
          <li>
            <strong>Cover Type:</strong>{' '}
            {
              COVER_TYPES.find(
                (cover_type) => cover_type.value === user.cover_type
              ).label
            }
          </li>
        </ul>
        {isLoggedIn && (
          <div>
            <hr />
            <div className="d-flex justify-content-between">
              <a
                href="https://wii.guide/riitag"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button variant="outline-light">
                  <FontAwesomeIcon className="me-1" icon={faQuestionCircle} />{' '}
                  How to Use
                </Button>
              </a>

              <a href={`/api/user/${user.username}/riitag.wad`}>
                <Button variant="success">
                  <FontAwesomeIcon className="me-1" icon={faWifi} /> RiiTag
                  Channel
                </Button>
              </a>

              <Link href="/edit" passHref>
                <Button variant="primary">
                  <FontAwesomeIcon className="me-1" icon={faPen} /> Edit Tag
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

UserInformationCard.propTypes = {
  user: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default UserInformationCard;
