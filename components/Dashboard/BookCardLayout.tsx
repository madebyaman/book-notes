import { Box, Flex, GridItem } from '@chakra-ui/react';
import { ReactNode } from 'react';
import BookCover from './BookCover';

export const BookCardLayout = ({
  bookId,
  children,
}: {
  bookId?: string;
  children: ReactNode;
}) => {
  return (
    <GridItem
      px="4"
      py="10"
      backgroundColor={'white'}
      rounded="md"
      minW={'250px'}
    >
      <Flex direction={'column'} px="4">
        {bookId && (
          <Box mb="4" w="100px" mt="-16">
            <BookCover bookID={bookId} />
          </Box>
        )}

        <Box mt="auto">{children}</Box>
      </Flex>
    </GridItem>
  );
};
