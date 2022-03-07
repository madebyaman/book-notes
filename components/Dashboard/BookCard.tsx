import { EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Text,
  Button,
  Flex,
  Heading,
  Link as ChakraLink,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardNote } from '../../@types';
import { getCurrentUserProfile } from '../Profile';
import { BookCardLayout } from './BookCardLayout';

export const BookCard = ({ card }: { card: DashboardNote }) => {
  const { id, slug, isPublished, excerpt, title, bookId } = card;
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    let isSubscribed = true;
    (async function () {
      const user = await getCurrentUserProfile();
      isSubscribed && setUsername(user?.username);
    })();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <BookCardLayout bookId={bookId}>
      {isPublished ? (
        <Badge variant={'subtle'} fontSize={'10px'} colorScheme="green">
          Published
        </Badge>
      ) : (
        <Badge variant={'subtle'} colorScheme="red" fontSize={'10px'}>
          Draft
        </Badge>
      )}
      <Heading as="h2" fontSize="30px" mt={0} mb={4}>
        {title || 'Untitled'}
      </Heading>
      {excerpt && (
        <Text
          color="gray.600"
          fontSize={'17px'}
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      )}
      <Flex justify={'flex-start'} alignItems="center" mt={6}>
        <Link
          href={{
            pathname: '/edit/[id]',
            query: { id: id },
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
        {username && slug && isPublished && (
          <Link href={`/${username}/${slug}`} passHref>
            <ChakraLink color="teal.500">View it live</ChakraLink>
          </Link>
        )}
      </Flex>
    </BookCardLayout>
  );
};
