import React from 'react'
import { toast } from 'react-toastify'
import { createOptionNodes } from '@/lib/utils/utils'
import { BADGES, isValidBadge } from '@/lib/constants/forms/badges'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import PropTypes from 'prop-types'

export default function GeneralAdministrationCard ({ user }) {
  const badges = createOptionNodes(BADGES)

  console.log(user)

  return (
    <Card className='mb-3' bg='secondary' text='light'>
      <Card.Header className='h5'>Update Badge for {user.name_on_riitag}</Card.Header>
      <Card.Body>
        <Row>
          <Col className='mb-3' md={6}>
            <Formik
              initialValues={{
                username: user.username,
                badge: user.badge
              }}
              validate={(values) => {
                const errors = {}

                if (!values.username) {
                  errors.username = 'Required'
                }

                if (isValidBadge(values.badge) === false) {
                  errors.badge = 'Invalid badge'
                }

                return errors
              }}
              onSubmit={async (values, { setSubmitting }) => {
                await toast.promise(
                  fetch('/api/admin/badge', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                  }),
                  {
                    pending: 'Updating badge...',
                    success: {
                      render ({ data, toastProps }) {
                        if (data.status !== 200) {
                          toastProps.type = 'error'
                          return 'An error occured, please try again later'
                        }
                        return 'Badge has been updated successfully!'
                      }
                    }
                  }
                )

                setSubmitting(false)
              }}
            >
              {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className='mb-3' md={6} controlId='badge'>
                    <InputGroup>
                      <Form.Label hidden>Badge</Form.Label>
                      <Form.Select
                        required
                        placeholder='Badge'
                        name='badge'
                        onChange={handleChange}
                        value={values.badge}
                        isInvalid={!!errors.badge}
                      >
                        {badges}
                      </Form.Select>
                      <Form.Control.Feedback type='invalid'>
                        {errors.badge}
                      </Form.Control.Feedback>
                      <Button disabled={isSubmitting} variant='primary' type='submit'>
                        Update Badge
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Form>
              )}

            </Formik>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

GeneralAdministrationCard.propTypes = {
  user: PropTypes.object.isRequired
}
