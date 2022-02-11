import React, { useEffect } from 'react';
import { StoreProvider } from 'easy-peasy';

import {
  NoteEditorStore,
  useStoreActions,
  useStoreState,
} from '../utils/store';
import EditorLayout from './Editor/Layout';
import useStatus from '../utils/useStatus';
import Status from './Status';
import ErrorFetchingNote from './ErrorFetchingNote';

const NoteEditorConsumer = ({ docId }: { docId?: string }) => {
  const bookId = useStoreState((state) => state.bookId);
  const fetchDocument = useStoreActions((state) => state.fetchDocument);
  const fetchBook = useStoreActions((state) => state.fetchBook);
  const resetState = useStoreActions((actions) => actions.resetState);
  const { state: status, dispatch } = useStatus();

  useEffect(() => {
    if (docId) {
      dispatch({ type: 'LOADING' });

      // First, fetch the document
      (async function () {
        try {
          await fetchDocument(docId);
          dispatch({ type: 'LOADED' });
        } catch (e) {
          dispatch({ type: 'ERROR', payload: 'Note not found' });
        }
      })();

      // Now, if `bookId` exists fetch the given book
      (async function () {
        if (bookId) {
          try {
            await fetchBook(bookId);
          } catch (e) {
            // Now if there is an error fetching the book, I don't want to throw an error
            console.log(e);
          }
        }
      })();
    } else {
      // If no docId, meaning it is inside add page, then reset state
      // If you don't reset state, then new document starts with already loaded state
      resetState();
    }
  }, [docId]);

  // save content, images, etc

  return (
    <Status
      loading={<div>Loading...</div>}
      error={<ErrorFetchingNote />}
      status={status.status}
    >
      <EditorLayout docId={docId} />
    </Status>
  );
};

const NoteEditor = ({ docId }: { docId?: string }) => {
  return (
    <StoreProvider store={NoteEditorStore}>
      <NoteEditorConsumer docId={docId} />
    </StoreProvider>
  );
};

export default NoteEditor;
