import { ChevronLeftIcon, StarIcon } from '@chakra-ui/icons';
import {
  GridItem,
  Button,
  Heading,
  Grid,
  Text,
  Box,
  IconButton,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const DashboardCards = ({
  initialLoad,
  cardContents,
}: {
  initialLoad: number;
  cardContents: { heading: string; content: string; stars: number }[];
}) => {
  const [endCount, setEndCount] = useState(initialLoad);
  const [startCount, setStartCount] = useState(0);
  const [cards, setCards] = useState<
    { heading: string; content: string; stars: number }[]
  >([]);

  const viewMoreCards = (n: number) => {
    setStartCount(endCount);
    setEndCount(endCount + n);
  };

  const viewLessCards = () => {
    setEndCount(startCount);
    setStartCount(startCount - 3);
  };

  useEffect(() => {
    const slicedArray = cardContents.slice(startCount, endCount);
    setCards(slicedArray);
  }, [endCount, startCount]);

  return (
    <Box>
      <Grid mt={'8'} gap={6} templateColumns={'1fr 3fr 3fr 3fr 1fr'}>
        <Grid background={'gray.100'} placeContent={'center'}>
          <IconButton
            aria-label="View books left"
            onClick={viewLessCards}
            isDisabled={startCount <= 1}
            display={startCount <= 1 ? 'none' : ''}
            icon={<ChevronLeftIcon boxSize={'10'} />}
          />
        </Grid>
        {cards.map((item, id) => (
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
            {[...Array(5)].map((_i, id) => (
              <StarIcon
                key={id}
                color={id < item.stars ? 'gray.500' : 'gray.100'}
              />
            ))}
          </GridItem>
        ))}
        <GridItem>
          <Heading>
            <Button
              onClick={() => viewMoreCards(3)}
              isDisabled={endCount >= cardContents.length}
              display={endCount >= cardContents.length ? 'none' : ''}
            >
              View more books
            </Button>
          </Heading>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default DashboardCards;
