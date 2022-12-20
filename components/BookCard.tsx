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
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import Link from 'next/link';

import { DashboardNote, DashboardNoteWithDate } from '@/@types';
import BookCover from './BookCover';

type CardBadgeTypes = {
  isProfileCard: boolean;
  lastUpdated: Timestamp | Date;
  isPublished: boolean;
};

const CardBadge = (props: CardBadgeTypes) => {
  if (props.isProfileCard) {
    return (
      <Tag
        rounded={'none'}
        mb="2"
        variant="subtle"
        fontSize={'12px'}
        fontWeight="normal"
      >
        {moment(props.lastUpdated).format('LL')}
      </Tag>
    );
  } else {
    return (
      <>
        {props.isPublished ? (
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

export const BookCard = ({
  card,
  isProfileCard,
  username,
}: {
  isProfileCard: boolean;
  card: DashboardNoteWithDate | DashboardNote;
  username: string;
}) => {
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
            lastUpdated={lastUpdated}
            isPublished={isPublished}
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
              <Button
                as={Link}
                href={`/${username}/${slug}`}
                width="full"
                backgroundColor={'teal.50'}
                color="primary.700"
                _hover={{
                  backgroundColor: 'teal.200',
                }}
              >
                Continue Reading
              </Button>
            ) : (
              <Button
                as={Link}
                href={{
                  pathname: '/edit/[id]',
                  query: { id: id },
                }}
                width="full"
                backgroundColor={'teal.50'}
                color="primary.700"
                _hover={{
                  backgroundColor: 'teal.200',
                }}
                borderRadius="sm"
                mr="4"
                rightIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    style={{
                      width: '16px',
                      height: '16px',
                    }}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                }
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>
      </Flex>
    </GridItem>
  );
};
