import { Box, Flex } from '@chakra-ui/react';
import {
  addDoc,
  collection,
  doc,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Book } from '../../@types/booktypes';
import db from '../../firebase';
import { fetchDoc } from '../../utils/fetchDoc';
import { useStoreState } from '../../utils/store';
import { useAuth } from '../../utils/useAuth';
import EditingSection from './EditingSection';
import EditorSidebar from './EditorSidebar';
import EditorTopBar from './EditorTopBar';

const EditorLayout = ({ docId = undefined }: { docId?: string }) => {
  const { content, rating, title, selectedBook } = useStoreState(
    (state) => state
  );
  const auth = useAuth();

  const onSave = async (published = false) => {
    const document = {
      content,
      rating,
      published,
      userId: auth.user?.uid,
      title,
      bookId: selectedBook ? selectedBook.key : undefined,
    };

    // Check if document exists with key = selectedBook.key
    if (selectedBook) {
      const bookDocSnap = (await fetchDoc(
        `book-notes/${docId}`
      )) as QueryDocumentSnapshot<Book>;

      // If no book found, create a new book
      if (!bookDocSnap.exists()) {
        // First upload the book cover if selectedBook.cover exists
        // Get the URL of the uploaded image and set it to selectedBook.photoURL
        await setDoc(doc(db, 'books', selectedBook.key), selectedBook);
      }
      // Else we don't need to do anything
    }

    if (!docId) {
      await addDoc(collection(db, 'book-notes'), document);
    } else {
      // If docID set the document
      const documentRef = doc(db, 'book-notes', docId);
      await updateDoc(documentRef, document);
    }
  };

  return (
    <>
      <Box
        pos={'fixed'}
        top="0"
        maxW={'960px'}
        margin="0 auto"
        left={'0'}
        right="0"
      >
        {/* Section for Top Bar */}
        <EditorTopBar onSave={onSave} />
      </Box>
      <Flex maxW={'960px'} margin="0 auto" mt={'100px'}>
        {/* EditingSection */}
        <EditingSection />
        <Box>
          <Box pos={'sticky'} top="100px">
            {/* Sidebar sticky area */}
            <EditorSidebar />
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default EditorLayout;
