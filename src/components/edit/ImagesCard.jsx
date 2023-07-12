import React from 'react'
import PropTypes from 'prop-types'
import { createOptionNodes } from '@/lib/utils/utils'
import { OVERLAYS } from '@/lib/constants/forms/overlays'
import { FLAGS } from '@/lib/constants/forms/flags'
import { COINS } from '@/lib/constants/forms/coins'
import { BACKGROUNDS } from '@/lib/constants/forms/backgrounds'
import SelectCoinModal from '@/components/edit/SelectCoinModal'
import { Alert, Card, Col, Form, Row } from 'react-bootstrap'
import SelectModal from './SelectModal'
import { Field } from 'formik'

const flags = createOptionNodes(FLAGS)

const backgrounds = BACKGROUNDS.map((background) => ({
  value: background,
  label: background
}))

function ImagesCard ({ values, errors, handleChange }) {
  return (
    <Card className='mb-3' bg='secondary' text='white'>
      <Card.Header as='h5'>Images</Card.Header>
      <Card.Body>
        <Row className='mb-3'>
          <Col md={5}>
            <p>Overlay</p>
            <SelectModal
              btnTitle='Select Overlay'
              title='Select an overlay'
              img={(value) => `/img/overlay/${value}.png`}
              name='overlay'
              options={OVERLAYS}
            />
            <p>
              <small className='text-muted'>
                This is the overlay that will be shown above the image and will
                contain your info.
              </small>
            </p>
            {errors.overlay && (
              <Alert className='mt-2 p-2' variant='danger'>
                {errors.overlay}
              </Alert>
            )}
          </Col>
          <Col md={7}>
            <img
              alt='Overlay Preview'
              className='img-thumbnail mx-auto d-block'
              src={`/img/overlay/${values.overlay}.png`}
            />
          </Col>
        </Row>

        <Row className='mb-3'>
          <Col md={5} className='mb-3'>
            <p>Background</p>
            <SelectModal
              btnTitle='Select Background'
              title='Select a background'
              img={(value) => `/img/background/${value}`}
              name='background'
              options={backgrounds}
            />
            {errors.background && (
              <Alert className='mt-2 p-2' variant='danger'>
                {errors.background}
              </Alert>
            )}
          </Col>
          <Col md={7}>
            <img
              alt='Background Preview'
              className='img-thumbnail mx-auto d-block'
              src={`/img/background/${values.background}`}
            />
          </Col>
        </Row>

        <Row className='mb-3'>
          <Col md={5}>
            <p>Coin</p>
            <Field name='coin' component={SelectCoinModal} options={COINS} />
            {errors.coin && (
              <Alert className='mt-2 p-2' variant='danger'>
                {errors.coin}
              </Alert>
            )}
          </Col>
          {values.coin !== 'default' && (
            <Col md={7}>
              <img
                alt='Coin Preview'
                className='img-fluid mx-auto d-block no-shadow mt-3'
                src={`/img/coin/${values.coin}.png`}
              />
            </Col>
          )}
        </Row>

        <Row>
          <Col md={5}>
            <Form.Group className='mb-3' controlId='flag'>
              <Form.Label>Flag</Form.Label>
              <Form.Select
                required
                placeholder='Flag'
                name='flag'
                onChange={handleChange}
                value={values.flag}
                isInvalid={!!errors.flag}
              >
                {flags}
              </Form.Select>
              <Form.Control.Feedback type='invalid'>
                {errors.flag}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={7}>
            <img
              alt='Flag Preview'
              className='img-fluid mx-auto d-block no-shadow mt-3'
              src={`/img/flag/${values.flag}.png`}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

ImagesCard.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
}

export default ImagesCard
