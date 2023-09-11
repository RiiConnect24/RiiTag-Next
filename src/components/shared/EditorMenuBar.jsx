import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold,
  faCode,
  faHeading,
  faItalic,
  faLevelDownAlt,
  faLink,
  faListOl,
  faListUl,
  faParagraph,
  faRedo,
  faRemoveFormat,
  faRulerHorizontal,
  faStrikethrough,
  faTerminal,
  faUndo,
  faUnlink,
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

function EditorMenuBar({ editor }) {
  const addLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    // eslint-disable-next-line no-alert
    const url = window.prompt('Enter URL:', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const isSelectionEmpty = () => {
    const { view } = editor;
    const { selection } = view.state;
    return selection.empty;
  };

  if (!editor) {
    return null;
  }

  return (
    <ButtonToolbar aria-label="Editor toolbar">
      <ButtonGroup className="me-3 mb-2" aria-label="Headings">
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive('paragraph')}
        >
          <FontAwesomeIcon icon={faParagraph} />
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Heading 1"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive('heading', { level: 1 })}
        >
          <FontAwesomeIcon icon={faHeading} /> <strong className="h6">1</strong>
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Heading 2"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive('heading', { level: 2 })}
        >
          <FontAwesomeIcon icon={faHeading} /> <strong className="h6">2</strong>
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Heading 3"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive('heading', { level: 3 })}
        >
          <FontAwesomeIcon icon={faHeading} /> <strong className="h6">3</strong>
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Heading 4"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          active={editor.isActive('heading', { level: 4 })}
        >
          <FontAwesomeIcon icon={faHeading} /> <strong className="h6">4</strong>
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Heading 5"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          active={editor.isActive('heading', { level: 5 })}
        >
          <FontAwesomeIcon icon={faHeading} /> <strong className="h6">5</strong>
        </Button>
      </ButtonGroup>

      <ButtonGroup className="me-3 mb-2" aria-label="Formatting options">
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <FontAwesomeIcon icon={faBold} />
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Italics"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <FontAwesomeIcon icon={faItalic} />
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
        >
          <FontAwesomeIcon icon={faStrikethrough} />
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
        >
          <FontAwesomeIcon icon={faTerminal} />
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Remove formatting"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <FontAwesomeIcon icon={faRemoveFormat} />
        </Button>
      </ButtonGroup>

      <ButtonGroup className="me-3 mb-2" aria-label="Link actions">
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Add hyperlink"
          onClick={addLink}
          active={editor.isActive('link')}
          disabled={isSelectionEmpty()}
        >
          <FontAwesomeIcon icon={faLink} />
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Remove hyperlink"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
        >
          <FontAwesomeIcon icon={faUnlink} />
        </Button>
      </ButtonGroup>

      <ButtonGroup className="me-3 mb-2" aria-label="More actions">
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Unordered list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <FontAwesomeIcon icon={faListUl} />
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Ordered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <FontAwesomeIcon icon={faListOl} />
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Code block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
        >
          <FontAwesomeIcon icon={faCode} />
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <FontAwesomeIcon icon={faRulerHorizontal} />
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Hard break"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          <FontAwesomeIcon icon={faLevelDownAlt} />
        </Button>
      </ButtonGroup>

      <ButtonGroup className="me-3 mb-2" aria-label="Whoops actions">
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <FontAwesomeIcon icon={faUndo} />
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          type="button"
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <FontAwesomeIcon icon={faRedo} />
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );

  // return (
  //   <ButtonGroup>
  //     <button
  //       type="button"
  //       onClick={() => editor.chain().focus().setHorizontalRule().run()}
  //     >
  //       horizontal rule
  //     </button>
  //     <button
  //       type="button"
  //       onClick={() => editor.chain().focus().setHardBreak().run()}
  //     >
  //       hard break
  //     </button>
  //   </ButtonGroup>
  // );
}

EditorMenuBar.propTypes = {
  editor: PropTypes.object,
};

EditorMenuBar.defaultProps = {
  editor: null,
};

export default EditorMenuBar;
