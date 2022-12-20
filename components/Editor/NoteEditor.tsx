import React, { useContext, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';

import store from '@/utils/store/store';
import {
  NoteEditorStore,
  useStoreActions,
  useStoreState,
} from '../../utils/store_old';
import { Layout } from './Layout';
import { StatusWrapper } from '../Status';
import { useStatus } from '@/utils';
import ErrorFetchingNote from './ErrorFetchingNote';
import { AuthContext } from '../Auth';
import { CenteredLayout } from '../Layout';
import { ResendVerificationEmail } from '../Layout/ResendVerificationEmail';
import { ErrorFallback } from '../Error';

const NoteEditorConsumer = ({ docId }: { docId?: string }) => {
  const fetchDocument = useStoreActions((state) => state.fetchDocument);
  const resetState = useStoreActions((actions) => actions.resetState);
  const { state: status, dispatch } = useStatus();

  useEffect(() => {
    console.log('fetching');
    let isSubscribed = true;

    dispatch({ type: 'LOADING' });
    if (docId) {
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
      resetState();
      dispatch({ type: 'LOADED' });
    }

    return () => {
      isSubscribed = false;
    };
    // We disable eslint rule b/c otherwise as soon as state changes, useEffect will fetch document which doesn't exist.
  }, [dispatch, docId, fetchDocument, resetState]);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        resetState();
      }}
    >
      <StatusWrapper error={<ErrorFetchingNote />} status={status.status}>
        <Layout docId={docId} pageLoading={status.status === 'LOADING'} />
      </StatusWrapper>
    </ErrorBoundary>
  );
};

export const NoteEditor = ({ docId }: { docId?: string }) => {
  const user = useContext(AuthContext);

  if (user) {
    if (user.emailVerified) {
      return (
        <Provider store={store}>
          <NoteEditorConsumer docId={docId} />
        </Provider>
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
