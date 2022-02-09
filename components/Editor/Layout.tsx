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
import { useStoreActions, useStoreState } from '../../utils/store';
import { useAuth } from '../../utils/useAuth';
import EditingSection from './EditingSection';
import EditorSidebar from './EditorSidebar';
import EditorTopBar from './EditorTopBar';

const EditorLayout = ({ docId = undefined }: { docId?: string }) => {
  const { content, rating, title, selectedBook } = useStoreState(
    (state) => state
  );
  const updateSelectedBook = useStoreActions(
    (state) => state.updateSelectedBook
  );
  const auth = useAuth();

  const onSave = async () => {
    console.log('calling on save');

    const document = {
      content,
      rating,
      published: false,
      userId: auth.user?.uid,
      title,
      bookId: selectedBook ? selectedBook.key : null,
    };

    // Check if document exists with key = selectedBook.key
    console.log('selected bookk', selectedBook);
    if (selectedBook) {
      console.log(selectedBook.key);
      const bookDocSnap = (await fetchDoc(
        `books/${selectedBook.key}`
      )) as QueryDocumentSnapshot<Book>;

      // If no book found, create a new book
      if (!bookDocSnap) {
        // First upload the book cover if selectedBook.cover exists
        const cloudinaryCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (cloudinaryCloud) {
          const fileURL = `https://covers.openlibrary.org/b/id/${selectedBook.cover}-M.jpg`;
          const formdata = new FormData();
          formdata.append('file', fileURL);
          formdata.append('upload_preset', 'book-covers');
          const data = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryCloud}/upload`,
            {
              method: 'POST',
              body: formdata,
            }
          ).then((res) => res.json());
          const newBook: Book = { ...selectedBook, photoURL: data.secure_url };
          // Get the URL of the uploaded image and set it to selectedBook.photoURL
          await setDoc(doc(db, 'books', newBook.key), newBook);
        }
      }
      // Else we don't need to do anything
    }

    // Finally set the document if !docID, else update it

    if (!docId) {
      console.log('setting data', document);
      await addDoc(collection(db, 'book-notes'), document);
      return;
    } else {
      // If docID set the document
      const documentRef = doc(db, 'book-notes', docId);
      await updateDoc(documentRef, document);
      return;
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
