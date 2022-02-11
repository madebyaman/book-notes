import React, { useEffect } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { StoreProvider } from 'easy-peasy';

import { NoteEditorStore, useStoreActions } from '../utils/store';
import { fetchDoc } from '../utils/fetchDoc';
import EditorLayout from './Editor/Layout';
import { Book, BookNote } from '../@types/booktypes';
import useStatus from '../utils/useStatus';
import Status from './Status';
import ErrorFetchingNote from './ErrorFetchingNote';

const NoteEditorConsumer = ({ docId }: { docId?: string }) => {
  const updateContent = useStoreActions((actions) => actions.updateContent);
  const updateRating = useStoreActions((actions) => actions.updateRating);
  const updateTitle = useStoreActions((actions) => actions.updateTitle);
  const updateExcerpt = useStoreActions((actions) => actions.updateExcerpt);
  const updateSelectedBook = useStoreActions(
    (actions) => actions.updateSelectedBook
  );
  const resetState = useStoreActions((actions) => actions.resetState);
  const { state: status, dispatch } = useStatus();

  useEffect(() => {
    async function fetchNote() {
      if (docId) {
        dispatch({ type: 'LOADING' });
        try {
          const noteDocSnap = (await fetchDoc(
            `book-notes/${docId}`
          )) as QueryDocumentSnapshot<BookNote>;

          if (noteDocSnap.exists()) {
            const note = noteDocSnap.data();
            updateContent(note.content);
            updateExcerpt(note.excerpt || '');
            updateRating(note.rating || 0);
            updateTitle(note.title || '');
            dispatch({ type: 'LOADED' });
            // set note

            if (note.bookId) {
              try {
                // Fetch the book
                const bookDocSnap = (await fetchDoc(
                  `books/${note.bookId}`
                )) as QueryDocumentSnapshot<Book>;

                if (bookDocSnap.exists()) {
                  const book = bookDocSnap.data();
                  // setSelectedBook(book);
                  updateSelectedBook(book);
                }
              } catch (err) {
                console.log(err);
              }
            }
          }
        } catch (err) {
          dispatch({ type: 'ERROR', payload: 'Note not found' });
        }
      } else {
        // reset state
        // If you don't reset state, then new document starts with already loaded state
        resetState();
      }
    }

    fetchNote();
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
