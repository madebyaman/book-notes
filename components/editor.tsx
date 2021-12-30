import React, { useContext } from 'react';
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
import { Box, Flex, IconButton } from '@chakra-ui/react';
import { NoteEditorContext } from './NoteEditor';

const VerticalRule = () => (
  <hr
    style={{
      width: '1px',
      height: '30px',
      display: 'inline-block',
      backgroundColor: '#e9ebf0',
      marginLeft: '5px',
      marginRight: '5px',
    }}
  />
);

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <Flex py="4" borderBottom={'1px solid #e9ebf0'}>
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
        isActive={editor.isActive('bold')}
        icon={<BsTypeBold style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        mr={'2'}
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
        isActive={editor.isActive('italic')}
        icon={<BsTypeItalic style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        mx={'2'}
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        aria-label="Code"
        isActive={editor.isActive('code')}
        icon={<BsCode style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        mx={'2'}
      />
      <VerticalRule />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        aria-label="Heading 1"
        isActive={editor.isActive('heading', { level: 1 })}
        icon={<BsTypeH1 style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        mx={'2'}
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="Heading 2"
        isActive={editor.isActive('heading', { level: 2 })}
        icon={<BsTypeH2 style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        mx={'2'}
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        aria-label="Heading 3"
        isActive={editor.isActive('heading', { level: 3 })}
        icon={<BsTypeH3 style={{ fontSize: '18px' }} />}
        size={'sm'}
        mx={'2'}
        variant={'ghost'}
      />
      <VerticalRule />
      <IconButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Unordered List"
        isActive={editor.isActive('bulletList')}
        icon={<BsListUl style={{ fontSize: '18px' }} />}
        mx={'2'}
        size={'sm'}
        variant={'ghost'}
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Ordered List"
        mx={'2'}
        isActive={editor.isActive('orderedList')}
        icon={<BsListOl style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        aria-label="Code Block"
        isActive={editor.isActive('codeBlock')}
        mx={'2'}
        icon={<BsCodeSquare style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Blockquote"
        isActive={editor.isActive('blockquote')}
        icon={<FaQuoteLeft style={{ fontSize: '12px' }} />}
        mx={'2'}
        size={'sm'}
        variant={'ghost'}
      />
      <IconButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        aria-label="Horizontal Rule"
        mx={'2'}
        icon={<BsDash style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
      />
      <VerticalRule />
      <IconButton
        onClick={() => editor.chain().focus().undo().run()}
        aria-label="Undo"
        icon={<FaUndo style={{ fontSize: '13px' }} />}
        size={'sm'}
        mx={'2'}
        variant={'ghost'}
      />
      <IconButton
        onClick={() => editor.chain().focus().redo().run()}
        aria-label="Redo"
        icon={<FaRedo style={{ fontSize: '13px' }} />}
        size={'sm'}
        mx={'2'}
        variant={'ghost'}
      />
    </Flex>
  );
};

const ContentEditor = ({ docID }: { docID?: string }) => {
  const { state, dispatch } = useContext(NoteEditorContext);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something ...',
      }),
    ],
    content: state.bookNote,
    onBlur({ editor }) {
      dispatch({ type: 'CHANGE_CONTENT', payload: editor.getHTML() });
    },
  });

  return (
    <Box>
      <MenuBar editor={editor} />
      <Box minH={'16'} mt="8">
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default ContentEditor;
