import { Box } from '@chakra-ui/react';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { useStoreActions, useStoreState } from '../../utils/store';
import ContentEditor from './ContentEditor';
import EditorMenu from './EditorMenu';

const EditingSection = () => {
  const [showMenu, setShowMenu] = useState(false);
  const content = useStoreState((state) => state.content);
  const updateContent = useStoreActions((actions) => actions.updateContent);

  useEffect(() => {
    if (editor && editor.commands) {
      editor.commands.setContent(content);
    }
  }, [content]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something ...',
      }),
    ],
    content: '',
    onBlur({ editor }) {
      updateContent(editor.getHTML());
    },
    onFocus() {
      setShowMenu(true);
    },
  });

  return (
    <Box>
      <Box pos={'sticky'} top="120px">
        {/* Sticky bar for editor menu */}
        <EditorMenu isDisabled={showMenu} editor={editor} />
      </Box>
      {/* Content area */}
      <ContentEditor setShowMenu={setShowMenu} editor={editor} />
    </Box>
  );
};

export default EditingSection;
