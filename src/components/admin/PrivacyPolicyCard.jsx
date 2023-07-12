import React from 'react'
import PropTypes from 'prop-types'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { toast } from 'react-toastify'
import { Button, Card } from 'react-bootstrap'
import EditorMenuBar from '../shared/EditorMenuBar'

function PrivacyPolicyCard ({ privacyPolicy }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false
      })
    ],
    content: privacyPolicy,
    editorProps: {
      attributes: {
        class: 'bg-white text-dark px-2 pt-1 text-editor'
      }
    }
  })

  const save = async () => {
    const text = editor.getHTML()
    const response = await fetch('/api/admin/update-text', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: 'privacy-policy',
        text
      })
    })

    if (response.status === 200) {
      toast.success(
        <span>
          Privacy Policy was updated.
          <br />
          Note that the page will only update after visiting it once.
        </span>,
        {
          autoClose: 10000
        }
      )
    } else {
      toast.error('An error occured, please try again later.')
    }
  }

  return (
    <Card className='mb-3' bg='secondary' text='white'>
      <Card.Header className='h5'>Privacy Policy</Card.Header>
      <Card.Body>
        <EditorMenuBar editor={editor} />
        <EditorContent editor={editor} />
      </Card.Body>
      <Card.Footer className='text-end'>
        <Button variant='success' onClick={save}>
          Save
        </Button>
      </Card.Footer>
    </Card>
  )
}

PrivacyPolicyCard.propTypes = {
  privacyPolicy: PropTypes.string.isRequired
}

export default PrivacyPolicyCard
