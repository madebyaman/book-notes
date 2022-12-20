import { updateContent, useAppDispatch, useAppSelector } from '@/utils/store';
import { Box } from '@chakra-ui/react';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';

import ContentEditor from './ContentEditor';
import EditorMenu from './EditorMenu';

export const ContentEditorWrapper = () => {
  const [showMenu, setShowMenu] = useState(false);
  const content = useAppSelector((state) => state.note.content);
  const dispatch = useAppDispatch();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something ...',
      }),
    ],
    content,
    onFocus() {
      setShowMenu(true);
    },
    onBlur({ editor }) {
      editor && dispatch(updateContent(editor.getHTML()));
    },
  });

  return (
    <Box>
      <Box pos={'sticky'} top="0px" backgroundColor={'white'} zIndex="10">
        {/* Sticky bar for editor menu */}
        <EditorMenu isDisabled={!showMenu} editor={editor} />
      </Box>
      {/* Content area */}
      <Box>
        <ContentEditor setShowMenu={setShowMenu} editor={editor} />
      </Box>
    </Box>
  );
};
