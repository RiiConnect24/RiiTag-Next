import { Card } from 'react-bootstrap';
import ExportButton from '@/components/account/ExportButton';
import DeleteAccountButton from '@/components/account/DeleteAccountButton';

export default function AccountCard() {
  return (
    <Card className="mb-3" bg="light" text="dark">
      <Card.Header className="h5">RiiTag Account</Card.Header>
      <Card.Body>
        <div className="d-flex gap-1 flex-column flex-sm-row">
          <ExportButton />
          <DeleteAccountButton />
        </div>
      </Card.Body>
    </Card>
  );
}
