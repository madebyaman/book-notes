import React, { useContext, useEffect } from 'react';
import { StoreProvider } from 'easy-peasy';
import { Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ErrorBoundary } from 'react-error-boundary';

import { NoteEditorStore, useStoreActions, useStoreState } from './store';
import { Layout } from './Layout';
import { useStatus, StatusWrapper } from '../Status';
import ErrorFetchingNote from './ErrorFetchingNote';
import { AuthContext } from '../Auth';
import { CenteredLayout } from '../Layout';
import { ResendVerificationEmail } from '../Layout/ResendVerificationEmail';
import { ErrorFallback } from '../Error';

const NoteEditorConsumer = ({ docId }: { docId?: string }) => {
  const bookId = useStoreState((state) => state.bookId);
  const fetchDocument = useStoreActions((state) => state.fetchDocument);
  const fetchBook = useStoreActions((state) => state.fetchBook);
  const resetState = useStoreActions((actions) => actions.resetState);
  const { state: status, dispatch } = useStatus();

  useEffect(() => {
    let isSubscribed = true;

    if (docId) {
      dispatch({ type: 'LOADING' });

      // First, fetch the note and book
      (async function () {
        try {
          await fetchDocument({ docId, isSubscribed });
          dispatch({ type: 'LOADED' });
        } catch (e) {
          throw e;
        }
      })();
    } else {
      // If no docId, meaning it is inside add page, then reset state
      // If you don't reset state, then new document starts with already loaded state
      resetState();
      dispatch({ type: 'LOADED' });
    }

    return () => {
      isSubscribed = false;
    };
    // We disable eslint rule b/c otherwise as soon as state changes, useEffect will fetch document which doesn't exist.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        resetState();
      }}
    >
      <StatusWrapper
        loading={<div>Loading...</div>}
        error={<ErrorFetchingNote />}
        status={status.status}
      >
        <Layout docId={docId} />
      </StatusWrapper>
    </ErrorBoundary>
  );
};

export const NoteEditor = ({ docId }: { docId?: string }) => {
  const user = useContext(AuthContext);
  const router = useRouter();

  if (user) {
    if (user.emailVerified) {
      return (
        <StoreProvider store={NoteEditorStore}>
          <NoteEditorConsumer docId={docId} />
        </StoreProvider>
      );
    }
    return (
      <CenteredLayout>
        You cannot create a note without verifying your email.{' '}
        <ResendVerificationEmail color="teal" />
      </CenteredLayout>
    );
  }
  return null;
};
