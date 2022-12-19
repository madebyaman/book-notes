import { Box } from '@chakra-ui/react';
import Placeholder from '@tiptap/extension-placeholder';
import { Editor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

import { useStoreActions, useStoreState } from '@/utils/store';
import ContentEditor from './ContentEditor';
import EditorMenu from './EditorMenu';

export const ContentEditorWrapper = () => {
  const [showMenu, setShowMenu] = useState(false);
  const content = useStoreState((state) => state.content);
  const updateContent = useStoreActions((actions) => actions.updateContent);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something ...',
      }),
    ],
    content,
    onBlur({ editor }) {
      const content = editor.getHTML();
      updateContent(content);
    },
    onFocus() {
      setShowMenu(true);
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
