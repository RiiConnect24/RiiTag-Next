import PropTypes from 'prop-types';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, Card } from 'react-bootstrap';
import Link from '@tiptap/extension-link';
import { toast } from 'react-toastify';
import EditorMenuBar from '@/components/shared/EditorMenuBar';

function AboutCard({ about }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: about,
    editorProps: {
      attributes: {
        class: 'bg-white text-dark px-2 pt-1 text-editor',
      },
    },
  });

  const save = async () => {
    const text = editor.getHTML();
    const response = await fetch('/api/admin/update-text', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: 'about',
        text,
      }),
    });

    if (response.status === 200) {
      toast.success(
        <span>
          About page was updated.
          <br />
          Note that the page will only update after visiting it once.
        </span>,
        {
          autoClose: 10_000,
        }
      );
    } else {
      toast.error('An error occured, please try again later.');
    }
  };

  return (
    <Card className="mb-3" bg="secondary" text="white">
      <Card.Header className="h5">About Page</Card.Header>
      <Card.Body>
        <EditorMenuBar editor={editor} />
        <EditorContent editor={editor} />
      </Card.Body>
      <Card.Footer className="text-end">
        <Button variant="success" onClick={save}>
          Save
        </Button>
      </Card.Footer>
    </Card>
  );
}

AboutCard.propTypes = {
  about: PropTypes.string.isRequired,
};

export default AboutCard;
