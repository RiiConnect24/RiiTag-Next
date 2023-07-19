import React from 'react'
import PropTypes from 'prop-types'
import {
  faGear,
  faPen
} from '@fortawesome/free-solid-svg-icons'
import dayjs from '@/lib/dayjs'
import { DATE_FORMAT } from '@/lib/constants/miscConstants'
import { OVERLAYS } from '@/lib/constants/forms/overlays'
import { COINS } from '@/lib/constants/forms/coins'
import { FLAGS } from '@/lib/constants/forms/flags'
import { FONTS } from '@/lib/constants/forms/fonts'
import { COVER_REGIONS } from '@/lib/constants/forms/coverRegions'
import { COVER_TYPES } from '@/lib/constants/forms/coverTypes'
import { Button, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

function UserInformationCard ({ user, isLoggedIn, isAdmin }) {
  return (
    <Card className='mb-3' bg='secondary' text='white'>
      <Card.Header as='h5'>User Information</Card.Header>
      <Card.Body>
        <ul className='list-unstyled m-0'>
          <li>
            <strong>Name:</strong> {user.name_on_riitag}
          </li>
          {dayjs(user.created_at).format(DATE_FORMAT) !== '4th August 2022' ? (<li><strong>Registered:</strong>{' '} {dayjs(user.created_at).format(DATE_FORMAT)}</li>) : ('')}
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
                (coverRegion) => coverRegion.value === user.cover_region
              ).label
            }
          </li>
          <li>
            <strong>Cover Type:</strong>{' '}
            {
              COVER_TYPES.find(
                (coverType) => coverType.value === user.cover_type
              ).label
            }
          </li>
        </ul>
        {(isLoggedIn || isAdmin) && (
          <div>
            <hr />
            <div className='d-flex justify-content-between'>
              <Link href='/edit' passHref>
                <Button variant='primary'>
                  <FontAwesomeIcon className='me-1' icon={faPen} /> Edit Tag
                </Button>
              </Link>
            </div>
            {isAdmin && (
              <div className='mt-3'>
                <Link href={`/user/${user.username}/admin`} passHref>
                  <Button variant='danger'>
                    <FontAwesomeIcon className='me-1' icon={faGear} /> Admin
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

UserInformationCard.propTypes = {
  user: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired
}

export default UserInformationCard
