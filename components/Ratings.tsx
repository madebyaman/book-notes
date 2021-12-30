import { FaStar } from 'react-icons/fa';
import { Box, IconButton } from '@chakra-ui/react';
import { useContext } from 'react';
import { NoteEditorContext } from './NoteEditor';

const Ratings = () => {
  const { state, dispatch } = useContext(NoteEditorContext);
  const { rating } = state;

  return (
    <Box>
      {[...Array(5)].map((_star, id) => {
        id += 1;
        const stars = rating || 0;
        return (
          <IconButton
            aria-label={`Set rating: ${id}`}
            key={id}
            onClick={() => dispatch({ type: 'CHANGE_RATING', payload: +id })}
            isActive={id <= stars ? true : false}
            variant={'unstyled'}
            icon={
              <FaStar
                style={{ display: 'inline' }}
                fill={id <= stars ? '#3182CE' : '#EDF2F7'}
              />
            }
          />
        );
      })}
    </Box>
  );
};

export default Ratings;
