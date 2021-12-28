import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import { Box } from '@chakra-ui/react';

const Ratings = () => {
  const [rating, setRating] = useState(0);

  return (
    <Box w={'100px'}>
      {[...Array(5)].map((star, id) => {
        id += 1;
        return (
          <span
            key={id}
            className={id <= rating ? 'on' : 'off'}
            onClick={() => setRating(+id)}
          >
            <FaStar
              style={{ display: 'inline' }}
              fill={id <= rating ? '#3182CE' : '#EDF2F7'}
            />
          </span>
        );
      })}
    </Box>
  );
};

export default Ratings;
