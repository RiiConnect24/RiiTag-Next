import { Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useState } from 'react';
import ConfirmationModal from '@/components/shared/ConfirmationModal';

const updateGameTdb = () => {
  toast.promise(fetch('/api/admin/update-gametdb', { method: 'GET' }), {
    pending: 'Updating GameTDB titles...',
    success: {
      render({ data, toastProps }) {
        if (data.status !== 200) {
          toastProps.type = 'error';
          return 'An error occured, please try again later';
        }
        return `GameTDB titles have been updated successfully!`;
      },
    },
    error: 'An error occured, please try again later.',
  });
};

export default function GeneralAdministrationCard() {
  const [show, setShow] = useState(false);

  const toggleModal = () => setShow(!show);

  return (
    <Card className="mb-3" bg="secondary" text="light">
      <ConfirmationModal
        title="Update GameTDB Titles?"
        confirmText="Update GameTDB Titles"
        toggleModal={toggleModal}
        show={show}
        onSubmit={updateGameTdb}
      >
        Do you want to update the GameTDB Titles Database?
        <br />
        This only takes a few seconds.
      </ConfirmationModal>
      <Card.Header className="h5">General Administration Tasks</Card.Header>
      <Card.Body>
        <Button variant="primary" onClick={toggleModal}>
          Update GameTDB Titles
        </Button>
      </Card.Body>
    </Card>
  );
}
