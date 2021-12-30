import { useContext } from 'react';
import { Input } from '@chakra-ui/react';
import { NoteEditorContext } from './NoteEditor';

const Title = () => {
  const { state, dispatch } = useContext(NoteEditorContext);

  return (
    <Input
      placeholder="Enter title"
      value={state.title}
      variant={'outline'}
      onChange={(e) =>
        dispatch({ type: 'CHANGE_TITLE', payload: e.target.value })
      }
      size="lg"
    />
  );
};

export default Title;
