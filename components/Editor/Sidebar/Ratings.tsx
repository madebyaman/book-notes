import { FaStar } from 'react-icons/fa';
import { Box, IconButton } from '@chakra-ui/react';
import { updateRating, useAppDispatch, useAppSelector } from '@/utils/store';

const Ratings = () => {
  const rating = useAppSelector((state) => state.note.rating);
  const dispatch = useAppDispatch();

  return (
    <Box mb="6">
      {[...Array(5)].map((_star, id) => {
        id += 1;
        const stars = rating || 0;
        return (
          <IconButton
            aria-label={`Set rating: ${id}`}
            key={id}
            onClick={() => dispatch(updateRating(Number(id)))}
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
