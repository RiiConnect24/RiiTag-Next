import { Card } from 'react-bootstrap';
import ExportButton from '@/components/account/ExportButton';
import DeleteAccountButton from '@/components/account/DeleteAccountButton';
import RefreshTagButton from '@/components/account/RefreshTagButton';

export default function AccountCard() {
  return (
    <Card className="mb-3" bg="secondary" text="light">
      <Card.Header className="h5">RiiTag Account</Card.Header>
      <Card.Body>
        <div className="d-flex gap-1 flex-column flex-sm-row">
          <ExportButton />
          <RefreshTagButton />
          <DeleteAccountButton />
        </div>
      </Card.Body>
    </Card>
  );
}
