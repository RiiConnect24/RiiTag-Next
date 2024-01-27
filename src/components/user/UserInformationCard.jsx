import React from 'react'
import PropTypes from 'prop-types'
import {
  faGear,
  faPen
} from '@fortawesome/free-solid-svg-icons'
import { OVERLAYS } from '@/lib/constants/forms/overlays'
import { COINS } from '@/lib/constants/forms/coins'
import { FLAGS } from '@/lib/constants/forms/flags'
import { FONTS } from '@/lib/constants/forms/fonts'
import { COVER_REGIONS } from '@/lib/constants/forms/coverRegions'
import { COVER_TYPES } from '@/lib/constants/forms/coverTypes'
import { Badge, Button, Card, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import BanAccountButton from '../account/BanAccountButton'
import ForceHiddenAccountButton from '../account/ForceHiddenAccountButton'
import LanguageContext from '../shared/LanguageContext'
import LocalizedString from '../shared/LocalizedString'

function UserInformationCard ({ user, isLoggedIn, isAdmin, isMod }) {
  return (
    <LanguageContext.Helper.Consumer>
      {(lang) => (
        <Card className='mb-3' bg='secondary' text='white'>
          <Card.Header as='h5'><LocalizedString string='user_info'/></Card.Header>
          <Card.Body>
            {user.isBanned && (<Badge bg='danger' className='mb-2'><LocalizedString string='banned'/></Badge>)}
            {(user.publicOverride === false || (user.publicOverride === true && isMod)) && (<Badge bg='danger' className='mb-2'><LocalizedString string='hidden'/></Badge>)}
            {user.role === 'admin' && (<Badge bg='success' className='mb-2'><LocalizedString string='administrator'/></Badge>)}
            {user.role === 'mod' && (<Badge bg='success' className='mb-2'><LocalizedString string='moderator'/></Badge>)}
            <ul className='list-unstyled m-0'>
              <li>
                <LocalizedString string='display_name'/>: {user.display_name}
              </li>
              <li>
                <LocalizedString string='overlay'/>: {OVERLAYS.find((overlay) => overlay.value === user.overlay).label}
              </li>
              <li>
                <LocalizedString string='background' />: {user.background}
              </li>
              <li>
                <LocalizedString string='coin' />: {COINS.find((coin) => coin.value === user.coin).label}
              </li>
              <li>
                <LocalizedString string='flag' />: {FLAGS.find((flag) => flag.value === user.flag).label}
              </li>
              <li>
                <LocalizedString string='font' />: {FONTS.find((font) => font.value === user.font).label}
              </li>
              <li>
                <LocalizedString string='cover_region' />: {COVER_REGIONS.find((coverRegion) => coverRegion.value === user.cover_region).label}
              </li>
              <li>
                <LocalizedString string='cover_type' />: {COVER_TYPES.find((coverType) => coverType.value === user.cover_type).label}
              </li>
            </ul>
            {(isLoggedIn || isAdmin) && (
              <div>
                <hr />
                <div className='d-flex justify-content-between'>
                  <Link href='/edit' passHref>
                    <Button variant='primary'>
                      <FontAwesomeIcon className='me-1' icon={faPen} /> <LocalizedString string='edit_tag'/>
                    </Button>
                  </Link>
                </div>
                {isMod && (
                  <div className='mt-3'>
                    <InputGroup>
                      <BanAccountButton isBanned={user.isBanned} id={user.id} />
                      <ForceHiddenAccountButton isHidden={user.publicOverride != null} id={user.id} />
                    </InputGroup>
                  </div>
                )}
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
      )}
    </LanguageContext.Helper.Consumer>
  )
}

UserInformationCard.propTypes = {
  user: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isMod: PropTypes.bool.isRequired
}

export default UserInformationCard
