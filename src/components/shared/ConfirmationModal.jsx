import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ConfirmationModal({
  title,
  cancelText,
  confirmText,
  confirmVariant,
  show,
  toggleModal,
  onSubmit,
  children,
}) {
  const onConfirm = () => {
    toggleModal();
    onSubmit();
  };

  return (
    <Modal fullscreen="sm-down" show={show} onHide={toggleModal}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={toggleModal}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  confirmVariant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'dark',
    'light',
    'link',
    'outline-primary',
    'outline-secondary',
    'outline-success',
    'outline-danger',
    'outline-warning',
    'outline-info',
    'outline-dark',
    'outline-light',
  ]),
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

ConfirmationModal.defaultProps = {
  cancelText: 'Cancel',
  confirmText: 'Submit',
  confirmVariant: 'primary',
};

export default ConfirmationModal;
