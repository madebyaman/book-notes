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
      _hover={{
        boxShadow: '0 3px 20px 0 rgb(84 110 122 / 10%)',
        transform: 'translateY(-2px)',
        borderColor: 'transparent',
      }}
      border={'1px'}
      rounded="md"
      transition={'all 200ms ease-out'}
      minW={'250px'}
      borderColor={'gray.100'}
    >
      <Flex direction={'column'} px="4">
        <Box mb="6" w="100px" mt="-16">
          <BookCover bookID={bookId} />
        </Box>

        <Box mt="auto">{children}</Box>
      </Flex>
    </GridItem>
  );
};
