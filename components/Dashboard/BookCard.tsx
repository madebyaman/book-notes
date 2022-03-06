import { EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  Link as ChakraLink,
} from '@chakra-ui/react';
import Link from 'next/link';
import { DashboardNote } from '../../@types';
import BookCover from './BookCover';

export const BookCard = ({ card }: { card: DashboardNote }) => {
  const { slug, isPublished, excerpt, title, bookId } = card;
  return (
    <GridItem
      p={5}
      _hover={{ boxShadow: 'md' }}
      cursor="pointer"
      borderWidth={'1px'}
      flex={'1'}
      minW={'250px'}
      mt="12"
      borderColor={'gray.100'}
    >
      <Flex direction={'column'} px="4">
        <Box mb={4} w={'150px'} mt="-16">
          <BookCover bookID={bookId} />
        </Box>
        <Box mt="auto">
          {isPublished ? (
            <Badge variant={'subtle'} fontSize={'10px'} colorScheme="green">
              Published
            </Badge>
          ) : (
            <Badge variant={'subtle'} colorScheme="red" fontSize={'10px'}>
              Draft
            </Badge>
          )}
          <Heading as="h2" fontSize="3xl" mt={0} mb={2}>
            {title || 'Untitled'}
          </Heading>
          {excerpt && (
            <Box my="4">
              <Box>{excerpt}</Box>
            </Box>
          )}
          <Flex justify={'flex-start'} alignItems="center" mt={4}>
            <Link
              href={{
                pathname: '/edit/[id]',
                query: { id: slug },
              }}
              passHref
            >
              <Button
                colorScheme={'teal'}
                borderRadius="sm"
                mr="4"
                rightIcon={<EditIcon />}
              >
                Edit
              </Button>
            </Link>
            <Link href={'/edit'} passHref>
              <ChakraLink color="teal.500">View it live</ChakraLink>
            </Link>
          </Flex>
        </Box>
      </Flex>
    </GridItem>
  );
};
