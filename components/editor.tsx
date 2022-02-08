import React, { useContext, useEffect, useState } from 'react';
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
  BsTypeItalic,
} from 'react-icons/bs';
import { Editor } from '@tiptap/core';
import { Box, Flex, IconButton, Input, Select } from '@chakra-ui/react';

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

const MenuBar = ({
  editor,
  isDisabled,
}: {
  editor: Editor | null;
  isDisabled: boolean;
}) => {
  if (!editor) {
    return null;
  }

  const changeText = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (
      e.target.value === '2' ||
      e.target.value === '3' ||
      e.target.value === '4'
    ) {
      const level = parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6;
      editor.chain().focus().toggleHeading({ level }).run();
    } else if (e.target.value === 'normal') {
      editor.chain().focus().setParagraph().run();
    }
  };

  function changeTextValue() {
    if (editor?.isActive('paragraph')) {
      return 'normal';
    } else if (editor?.isActive('heading', { level: 2 })) {
      return '2';
    } else if (editor?.isActive('heading', { level: 3 })) {
      return '3';
    } else if (editor?.isActive('heading', { level: 4 })) {
      return '4';
    }
  }

  return (
    <Flex
      py="4"
      borderBottom={'1px solid #e9ebf0'}
      alignItems={'center'}
      pos={'sticky'}
      top={'73px'}
      backgroundColor={'white'}
      zIndex={'10'}
    >
      <Select
        onChange={changeText}
        placeholder="Change text"
        value={changeTextValue()}
        isDisabled={isDisabled}
        mr={'2'}
      >
        <option value={'2'}>Large Header</option>
        <option value={'3'}>Medium Header</option>
        <option value={'4'}>Small Header</option>
        <option value={'normal'}>Normal Text</option>
      </Select>
      <VerticalRule />
      <IconButton
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
        isActive={editor.isActive('bold')}
        icon={<BsTypeBold style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        mr={'2'}
      />
      <IconButton
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
        isActive={editor.isActive('italic')}
        icon={<BsTypeItalic style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
        mx={'2'}
      />
      <IconButton
        isDisabled={isDisabled}
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
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Unordered List"
        isActive={editor.isActive('bulletList')}
        icon={<BsListUl style={{ fontSize: '18px' }} />}
        mx={'2'}
        size={'sm'}
        variant={'ghost'}
      />
      <IconButton
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Ordered List"
        mx={'2'}
        isActive={editor.isActive('orderedList')}
        icon={<BsListOl style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
      />
      <IconButton
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        aria-label="Code Block"
        isActive={editor.isActive('codeBlock')}
        mx={'2'}
        icon={<BsCodeSquare style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
      />
      <IconButton
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Blockquote"
        isActive={editor.isActive('blockquote')}
        icon={<FaQuoteLeft style={{ fontSize: '12px' }} />}
        mx={'2'}
        size={'sm'}
        variant={'ghost'}
      />
      <IconButton
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        aria-label="Horizontal Rule"
        mx={'2'}
        icon={<BsDash style={{ fontSize: '18px' }} />}
        size={'sm'}
        variant={'ghost'}
      />
      <VerticalRule />
      <IconButton
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().undo().run()}
        aria-label="Undo"
        icon={<FaUndo style={{ fontSize: '13px' }} />}
        size={'sm'}
        mx={'2'}
        variant={'ghost'}
      />
      <IconButton
        isDisabled={isDisabled}
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

const ContentEditor = () => {
  const [showMenu, setShowMenu] = useState(false);
  // const { state, dispatch } = useContext(NoteEditorContext);
  // const { title } = state;

  // useEffect(() => {
  //   if (editor && editor.commands) {
  //     editor.commands.setContent(state.bookNote);
  //   }
  // }, [state.bookNote]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something ...',
      }),
    ],
    content: '',
    onBlur({ editor }) {
      // dispatch({ type: 'CHANGE_CONTENT', payload: editor.getHTML() });
    },
    onFocus() {
      setShowMenu(true);
    },
  });

  return (
    <Box>
      <MenuBar editor={editor} isDisabled={!showMenu} />
      <Box minH={'16'} mt="8">
        <Input
          placeholder="Title"
          size={'lg'}
          variant={'unstyled'}
          mb="4"
          fontSize={'4xl'}
          // value={title}
          onChange={(e) => {
            setShowMenu(false);
            // dispatch({ type: 'CHANGE_TITLE', payload: e.target.value });
          }}
        />
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default ContentEditor;
