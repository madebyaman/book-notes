import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import { Heading, Flex, Box, IconButton } from '@chakra-ui/react';

const Ratings = () => {
  const [rating, setRating] = useState(0);

  return (
    <Flex w="100%" align="center">
      <Heading as="h2" size={'md'} mr="15px">
        How strongly would you recommend it?
      </Heading>
      <Box>
        {[...Array(5)].map((_star, id) => {
          id += 1;
          return (
            <IconButton
              aria-label={`Set rating: ${id}`}
              key={id}
              onClick={() => setRating(+id)}
              isActive={id <= rating ? true : false}
              variant={'unstyled'}
              icon={
                <FaStar
                  style={{ display: 'inline' }}
                  fill={id <= rating ? '#3182CE' : '#EDF2F7'}
                />
              }
            />
          );
        })}
      </Box>
    </Flex>
  );
};

export default Ratings;
