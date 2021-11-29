import PropTypes from 'prop-types';
import { Card, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import dayjs from '@/lib/dayjs';
import { DATE_FORMAT } from '@/lib/constants/miscConstants';

function OAuthAccountsCard({ accounts }) {
  const getProvider = ({ created_at, provider_id }) => (
    <Row key={provider_id}>
      <Col>
        {provider_id === 'discord' ? (
          <>
            <FontAwesomeIcon className="me-1" icon={faDiscord} />
            <strong>Discord</strong>
          </>
        ) : (
          <>
            <FontAwesomeIcon className="me-1" icon={faQuestion} />
            <strong>{provider_id} (Unsupported)</strong>
          </>
        )}{' '}
        - Linked on {dayjs(created_at).format(DATE_FORMAT)}
        {accounts.length === 1 && (
          <>
            <br />
            <i>You cannot unlink your only account.</i>
          </>
        )}
      </Col>
    </Row>
  );

  return (
    <Card className="mb-3" bg="secondary" text="white">
      <Card.Header className="h5">Linked accounts</Card.Header>
      <Card.Body>
        {accounts.map((account) => getProvider(account))}
        {/* <hr /> */}
      </Card.Body>
    </Card>
  );
}

OAuthAccountsCard.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default OAuthAccountsCard;
