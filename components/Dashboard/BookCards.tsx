import { AddIcon } from '@chakra-ui/icons';
import { Text, Grid, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DashboardNote } from '../../@types';
import { ErrorFallback } from '../Error';
import { useStatus } from '../Status';
import { StatusWrapper } from '../Status';
import { BookCard } from '../BookCard';
import { subscribeToCurrentUserNotes } from './subscribeToCurrentUserNotes';
import { EmptyState } from './EmptyState';
import { useUserProfileHook } from '../Profile';

export const BookCards = () => {
  const router = useRouter();
  const user = useUserProfileHook();
  const [cards, setCards] = useState<DashboardNote[]>([]);
  const { state, dispatch } = useStatus();

  useEffect(() => {
    const setBooks = async () => {
      try {
        const unsub = await subscribeToCurrentUserNotes((result) => {
          dispatch({ type: 'LOADING' });
          setCards(result);
          dispatch({ type: 'LOADED' });
        });
        return unsub;
      } catch (e) {
        throw e;
      }
    };
    setBooks();
  }, [dispatch]);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setCards([]);
      }}
      resetKeys={[cards]}
    >
      <StatusWrapper
        status={state.status}
        loading={<div>Loading...</div>}
        error={<div>{state.error}</div>}
      >
        <Grid
          templateColumns="repeat(auto-fit, minmax(400px, 1fr))"
          columnGap={12}
          rowGap="16"
        >
          {cards.length > 0 && user ? (
            cards.map((card) => {
              const cardWithDate = {
                ...card,
                lastUpdated: card.lastUpdated.toDate(),
              };
              return (
                <BookCard
                  key={card.slug}
                  card={cardWithDate}
                  isProfileCard={false}
                  username={user?.username}
                />
              );
            })
          ) : (
            <EmptyState />
          )}
        </Grid>
        <Flex
          pos={'fixed'}
          bottom="10"
          right="10"
          backgroundColor={'teal'}
          borderRadius="md"
          cursor="pointer"
          aria-label="Add a new note"
          p="4"
          gap="2"
          boxShadow={'xl'}
          alignItems="center"
          transition={'transform 200ms ease-out'}
          color="white"
          onClick={() => router.push('/add')}
          _hover={{
            transform: 'translateY(-5px)',
          }}
        >
          <AddIcon />
          <Text>Add a new note</Text>
        </Flex>
      </StatusWrapper>
    </ErrorBoundary>
  );
};
