import { Box, Flex, useToast } from '@chakra-ui/react';
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

const uploadImageFromCoverID = async (
  cover: string
): Promise<string | undefined> => {
  const cloudinaryCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (cloudinaryCloud) {
    const fileURL = `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;
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
    return data.secure_url as string;
  }
  return;
};

const EditorLayout = ({ docId = undefined }: { docId?: string }) => {
  const { content, rating, title, selectedBook } = useStoreState(
    (state) => state
  );
  const auth = useAuth();
  const toast = useToast();

  /**
   * Displays a flash message of success or failure
   */
  const showSaveStatus = (success: boolean) => {
    if (success) {
      toast({
        title: 'Successfully saved your book note',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error saving your book note',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /**
   * It does the following:
   * 1. Adds bookId to the document to attach a book to the note.
   * 2. If a book doesn't exist in db with id of `selectedBook.key`, upload cover to Cloudinary and add book to db
   * 3. If `docId` is provided, update the document. Else, create a new document
   */
  const onSave = async () => {
    const document = {
      content,
      rating,
      published: false,
      userId: auth.user?.uid,
      title,
      bookId: selectedBook ? selectedBook.key : null,
    };

    if (selectedBook) {
      // Check if document exists with id = selectedBook.key
      const bookDocSnap = (await fetchDoc(
        `books/${selectedBook.key}`
      )) as QueryDocumentSnapshot<Book>;
      // If no book found, create a new book
      if (!bookDocSnap) {
        // First upload the book cover if selectedBook.cover exists
        const coverURL = await uploadImageFromCoverID(selectedBook.cover);
        let newBook: Book;
        if (coverURL) {
          newBook = {
            ...selectedBook,
            photoURL: coverURL,
          };
        } else {
          newBook = selectedBook;
        }

        // The, get the URL of the uploaded image and set it to selectedBook.photoURL
        await setDoc(doc(db, 'books', newBook.key), newBook);
      }
      // Else we don't need to do anything. As it means book already exists in db
    }

    // Finally set the document if !docID, else update it
    try {
      if (!docId) {
        await addDoc(collection(db, 'book-notes'), document);
        showSaveStatus(true);
        return;
      } else {
        const documentRef = doc(db, 'book-notes', docId);
        await updateDoc(documentRef, document);
        showSaveStatus(true);
        return;
      }
    } catch (error) {
      showSaveStatus(false);
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
