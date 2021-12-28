import React, { useContext } from 'react';
import db from '../firebase';
import { doc, setDoc, addDoc, collection, getDoc } from 'firebase/firestore';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { FaQuoteLeft, FaUndo, FaRedo } from 'react-icons/fa';
import {
  BsCode,
  BsCodeSquare,
  BsListOl,
  BsListUl,
  BsDash,
  BsTypeBold,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsTypeItalic,
} from 'react-icons/bs';
import { Editor } from '@tiptap/core';
import { ErrorContext } from '../pages/add-book';
import { Box, IconButton } from '@chakra-ui/react';
import '../styles/Editor.module.css';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <Box pb={'2'}>
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
        isActive={editor.isActive('bold')}
        icon={<BsTypeBold style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
        isActive={editor.isActive('italic')}
        icon={<BsTypeItalic style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        aria-label="Code"
        isActive={editor.isActive('code')}
        icon={<BsCode style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        aria-label="Heading 1"
        isActive={editor.isActive('heading', { level: 1 })}
        icon={<BsTypeH1 style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="Heading 2"
        isActive={editor.isActive('heading', { level: 2 })}
        icon={<BsTypeH2 style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        aria-label="Heading 3"
        isActive={editor.isActive('heading', { level: 3 })}
        icon={<BsTypeH3 style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Unordered List"
        isActive={editor.isActive('bulletList')}
        icon={<BsListUl style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Ordered List"
        isActive={editor.isActive('orderedList')}
        icon={<BsListOl style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        aria-label="Code Block"
        isActive={editor.isActive('codeBlock')}
        icon={<BsCodeSquare style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Blockquote"
        isActive={editor.isActive('blockquote')}
        icon={<FaQuoteLeft style={{ fontSize: '14px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
      <IconButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        aria-label="Horizontal Rule"
        icon={<BsDash style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
      <IconButton
        onClick={() => editor.chain().focus().undo().run()}
        aria-label="Undo"
        icon={<FaUndo style={{ fontSize: '14px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
      <IconButton
        onClick={() => editor.chain().focus().redo().run()}
        aria-label="Redo"
        icon={<FaRedo style={{ fontSize: '14px' }} />}
        size={'sm'}
        variant={'ghost'}
        p="1"
      />
    </Box>
  );
};

const ContentEditor = ({ docID }: { docID?: string }) => {
  const [content, setContent] = React.useState(null);

  React.useEffect(() => {
    // If no docID is passed that means this is not Edit screen, but Add New Book Note screen.
    // Hence we don't need to get content from firebase. So return.
    if (!docID) return;
    // If there is docID, that means this is an Edit Book Note screen.
    // So we need to get book notes with book docID and noteTakerID.
    // First thing for that is point to the reference of document.
    const cleanup = async () => {
      try {
        const docRef = doc(db, `book-notes/${docID}`);
        const document = await getDoc(docRef);
        if (document.exists()) {
          console.log('Document data:', document.data());
        } else {
          console.log('No such document');
        }
      } catch (e) {
        const { setError } = useContext(ErrorContext);
        setError(e);
      }
    };
    cleanup();
    return () => {
      cleanup();
    };
  }, [docID]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something ...',
      }),
    ],
    content,
  });

  const saveContent = async () => {
    // First get editor content
    const newContent = editor?.getHTML();
    // now if content is present, then push the content into firebase
    if (newContent) {
      // If docID is present, then push content to that document
      if (docID) {
        const noteRef = doc(db, `book-notes/${docID}`);
        await setDoc(noteRef, {
          content: newContent,
        });
      } else {
        // Otherwise push content to new Document
        // TODO: add book id and user id to newNote.
        const newNote = { content: newContent };
        await addDoc(collection(db, 'book-notes'), newNote);
      }
    }
  };

  return (
    <Box py={'8'}>
      <MenuBar editor={editor} />
      <Box minH={'16'}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default ContentEditor;
