import { AddIcon, StarIcon } from '@chakra-ui/icons';
import {
  Heading,
  Text,
  Box,
  Grid,
  GridItem,
  IconButton,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/useAuth';

const BookNotesCards = ({
  cardContents,
}: {
  cardContents: { heading: string; content: string; stars: number }[];
}) => {
  const router = useRouter();
  const auth = useAuth();

  return (
    <Box>
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
        {cardContents.map((item, id) => (
          <GridItem
            key={id}
            p={5}
            shadow="md"
            borderWidth={'1px'}
            flex={'1'}
            borderRadius={'md'}
            minW={'250px'}
          >
            <Heading fontSize="xl">{item.heading}</Heading>
            <Text mt={4}>{item.content}</Text>
            {[...Array(item.stars)].map((_i, id) => (
              <StarIcon key={id} color={'gray.500'} />
            ))}
          </GridItem>
        ))}
        <GridItem
          shadow="md"
          borderWidth={'1px'}
          flex={'1'}
          borderRadius={'md'}
          minW={'250px'}
          minH={'250px'}
        >
          <IconButton
            colorScheme={'blackAlpha'}
            variant={'unstyled'}
            aria-label="Add book"
            icon={<AddIcon />}
            w={'100%'}
            h={'100%'}
            borderRadius={'md'}
            onClick={() => router.push('/add-book')}
          />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default BookNotesCards;
