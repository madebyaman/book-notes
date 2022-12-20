import { updateTitle, useAppDispatch, useAppSelector } from '@/utils/store';
import { Box, Input } from '@chakra-ui/react';
import { Editor, EditorContent } from '@tiptap/react';

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
  const title = useAppSelector((state) => state.note.title);
  const dispatch = useAppDispatch();

  return (
    <Box
      minH={'16'}
      py="6"
      px="4"
      shadow="sm"
      rounded="md"
      backgroundColor="white"
    >
      <Input
        placeholder="Title"
        size={'lg'}
        variant={'unstyled'}
        mb="4"
        fontSize={'4xl'}
        value={title}
        onFocus={() => setShowMenu(false)}
        onChange={(e) => {
          dispatch(updateTitle(e.target.value));
        }}
      />
      <EditorContent editor={editor} />
    </Box>
  );
};

export default ContentEditor;
