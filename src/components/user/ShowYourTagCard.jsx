import PropTypes from 'prop-types'
import { Card, Col, Form, Row, Tab, Tabs } from 'react-bootstrap'
import { React, useState } from 'react'
import { toast } from 'react-toastify'
import ENV from '@/lib/constants/environmentVariables'

const selectAndCopy = (event) => {
  event.target.select()
  navigator.clipboard
    .writeText(event.target.value)
    .then(() => toast.success('Copied!'))
    .catch(() => toast.error('Failed to copy :('))
}

/*
 * NOTE: "##USERID##" in the text gets replaced with the userId
 * and ##TAG## will replace 'tag.png' with 'tag.max.png'
 */
function EmbedText ({ username, max, text }) {
  let textareaValue = text.replaceAll('##USERID##', username)
  textareaValue =
    max === true
      ? textareaValue.replaceAll('##TAG##', 'tag.max.png')
      : textareaValue.replaceAll('##TAG##', 'tag.png')

  return (
    <Form.Control
      className='resizable-none'
      readOnly
      rows={4}
      as='textarea'
      onClick={selectAndCopy}
      value={textareaValue}
    />
  )
}

EmbedText.propTypes = {
  username: PropTypes.string.isRequired,
  max: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

function ShowYourTagCard ({ username }) {
  const [max, setMax] = useState(false)

  return (
    <Card className='mb-3' bg='secondary' text='white'>
      <Card.Header as='h5'>Show your LinkTag</Card.Header>
      <Card.Body>
        <Tabs
          id='embed-tabs'
          className='mb-2'
          variant='pills'
          defaultActiveKey='html'
          transition={false}
        >
          <Tab title='HTML' eventKey='html'>
            <EmbedText
              max={max}
              username={username}
              text={`<a href="${ENV.BASE_URL}/user/##USERID##"><img src="${ENV.BASE_URL}/##USERID##/##TAG##" alt="RiiTag" /></a>`}
            />
          </Tab>
          <Tab eventKey='bbcode' title='BBCode'>
            <EmbedText
              max={max}
              username={username}
              text={`[CENTER][URL='${ENV.BASE_URL}/user/##USERID##'][IMG]${ENV.BASE_URL}/##USERID##/##TAG##[/IMG][/URL][/CENTER]`}
            />
          </Tab>
        </Tabs>

        <Form.Group
          className='mt-2 align-items-baseline'
          as={Row}
          controlId='bigImageSwitch'
        >
          <Col>
            <Form.Switch
              label='Use large image instead'
              value={max}
              onChange={() => setMax(!max)}
            />
          </Col>
        </Form.Group>
      </Card.Body>
    </Card>
  )
}

ShowYourTagCard.propTypes = {
  username: PropTypes.string.isRequired
}

export default ShowYourTagCard
