import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { Button, Form, InputGroup } from 'react-bootstrap';

function RefreshTagForm() {
  return (
    <Formik
      initialValues={{
        username: '',
      }}
      validate={(values) => {
        const errors = {};

        if (!values.username) {
          errors.username = 'Required';
        }

        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        await toast.promise(
          fetch('/api/admin/refresh-tag', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }),
          {
            pending: 'Regenerating tag...',
            success: {
              render({ data, toastProps }) {
                if (data.status !== 200) {
                  toastProps.type = 'error';

                  if (data.status === 404) {
                    return 'This user does not exist.';
                  }

                  return 'An error occured, please try again later';
                }
                return `Tag regenerated!`;
              },
            },
            error: 'An error occured, please try again later.',
          }
        );

        setSubmitting(false);
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <InputGroup>
              <Form.Label hidden>Refresh Tag for user</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Username (ID)"
                name="username"
                onChange={handleChange}
                value={values.username}
                isInvalid={!!errors.username}
              />
              <Button disabled={isSubmitting} variant="primary" type="submit">
                Refresh Tag
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
}

export default RefreshTagForm;
