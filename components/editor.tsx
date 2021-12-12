import React from 'react';
import db from '../firebase';
import { doc, setDoc, addDoc, collection, getDoc } from 'firebase/firestore';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  BsChatQuote,
  BsCode,
  BsCodeSquare,
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
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

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <BsTypeBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <BsTypeItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        <BsCode />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <BsTypeH1 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <BsTypeH2 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <BsTypeH3 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <BsListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <BsListOl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        <BsCodeSquare />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <BsChatQuote />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <BsDash />
      </button>
      <button onClick={() => editor.chain().focus().undo().run()}>
        <BsFillArrowLeftCircleFill />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()}>
        <BsFillArrowRightCircleFill />
      </button>
    </>
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
      const docRef = doc(db, `book-notes/${docID}`);
      const document = await getDoc(docRef);
      if (document.exists()) {
        console.log('Document data:', document.data());
      } else {
        console.log('No such document');
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
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <button onClick={saveContent}>Save</button>
    </div>
  );
};

export default ContentEditor;
