import React, { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { StoreProvider } from 'easy-peasy';

import { NoteEditorStore, useStoreActions } from '../utils/store';
import { useAuth } from '../utils/useAuth';
import { fetchDoc } from '../utils/fetchDoc';
import EditorLayout from './Editor/Layout';
import ErrorFallback from './ErrorFallback';
import { Book, BookNote } from '../@types/booktypes';

const NoteEditorConsumer = ({ docId }: { docId?: string }) => {
  const updateContent = useStoreActions((actions) => actions.updateContent);
  const updateRating = useStoreActions((actions) => actions.updateRating);
  const updateTitle = useStoreActions((actions) => actions.updateTitle);
  const updateExcerpt = useStoreActions((actions) => actions.updateExcerpt);
  const updateSelectedBook = useStoreActions(
    (actions) => actions.updateSelectedBook
  );
  const resetState = useStoreActions((actions) => actions.resetState);

  const toast = useToast();

  useEffect(() => {
    async function fetchNote() {
      if (docId) {
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
          toast({
            title: 'Error fetching note',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        // reset state
        // Otherwise, new document starts with already loaded state
        resetState();
      }
    }

    fetchNote();
  }, [docId]);

  // save content, images, etc

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      // onReset={() => }
    >
      <EditorLayout docId={docId} />
    </ErrorBoundary>
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
