import { Box, Input } from '@chakra-ui/react';
import { Editor, EditorContent } from '@tiptap/react';
import { useStoreActions, useStoreState } from '../../utils/store';

/**
 * Tiptap editor component. It also displays title.
 */
const ContentEditor = ({
  editor,
  setShowMenu,
}: {
  editor: Editor | null;
  setShowMenu: (value: React.SetStateAction<boolean>) => void;
}) => {
  const title = useStoreState((state) => state.title);
  const updateTitle = useStoreActions((actions) => actions.updateTitle);

  return (
    <Box minH={'16'} mt="8">
      <Input
        placeholder="Title"
        size={'lg'}
        variant={'unstyled'}
        mb="4"
        fontSize={'4xl'}
        value={title}
        onChange={(e) => {
          setShowMenu(false);
          updateTitle(e.target.value);
        }}
      />
      <EditorContent editor={editor} />
    </Box>
  );
};

export default ContentEditor;
