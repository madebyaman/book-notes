import { EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Text,
  Button,
  Flex,
  Heading,
  GridItem,
  Box,
  Tag,
} from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';

import { DashboardNoteWithDate } from '../@types';
import BookCover from './BookCover';

const CardBadge = ({
  isProfileCard,
  isPublished,
  lastUpdated,
}: {
  isProfileCard: boolean;
  isPublished: boolean;
  lastUpdated: Date;
}) => {
  if (isProfileCard) {
    return (
      <Tag
        rounded={'none'}
        mb="2"
        variant="subtle"
        fontSize={'12px'}
        fontWeight="normal"
      >
        {moment(lastUpdated).format('LL')}
      </Tag>
    );
  } else {
    return (
      <>
        {isPublished ? (
          <Badge variant={'subtle'} fontSize={'10px'} colorScheme="green">
            Published
          </Badge>
        ) : (
          <Badge variant={'subtle'} colorScheme="red" fontSize={'10px'}>
            Draft
          </Badge>
        )}
      </>
    );
  }
};

interface BookCardInterface {
  card: DashboardNoteWithDate;
  isProfileCard: boolean;
  username: string;
}

export const BookCard = ({
  card,
  isProfileCard,
  username,
}: BookCardInterface) => {
  const { id, slug, isPublished, excerpt, title, bookId, lastUpdated } = card;

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

        <Box mt="auto">
          <CardBadge
            isProfileCard={isProfileCard}
            isPublished={isPublished}
            lastUpdated={lastUpdated}
          />
          <Heading as="h2" fontSize="30px" color="text.400" mt={0} mb={4}>
            {title}
          </Heading>
          {excerpt && (
            <Text
              color="gray.700"
              lineHeight={'1.7'}
              fontSize={'18px'}
              dangerouslySetInnerHTML={{ __html: excerpt }}
            />
          )}
          <Box mt="4">
            {isProfileCard ? (
              <Link href={`/${username}/${slug}`} passHref>
                <Button
                  as="a"
                  width="full"
                  _hover={{ backgroundColor: 'primary.700', color: 'white' }}
                >
                  View it live
                </Button>
              </Link>
            ) : (
              <Link
                href={{
                  pathname: '/edit/[id]',
                  query: { id: id },
                }}
                passHref
              >
                <Button
                  as="a"
                  width="full"
                  borderRadius="sm"
                  mr="4"
                  rightIcon={<EditIcon />}
                >
                  Edit
                </Button>
              </Link>
            )}
          </Box>
        </Box>
      </Flex>
    </GridItem>
  );
};
