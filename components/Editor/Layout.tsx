import { Box, Flex, useToast } from '@chakra-ui/react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { Book } from '../../@types/booktypes';
import { fetchDoc } from '../../utils/fetchDoc';
import {
  createDocument,
  createOrUpdateDocument,
  uploadImageFromCoverID,
} from '../../utils/saveDocMethods';
import { useStoreState } from '../../utils/store';
import { useAuth } from '../../utils/useAuth';
import EditingSection from './EditingSection';
import EditorSidebar from './EditorSidebar';
import EditorTopBar from './EditorTopBar';

const EditorLayout = ({ docId = undefined }: { docId?: string }) => {
  const { content, rating, title, selectedBook, bookId, isPublished } =
    useStoreState((state) => state);
  const auth = useAuth();
  const toast = useToast();

  /**
   * Displays a flash message of success or failure
   * @param success If true then success message. Else failure message
   * @param message Message to display
   */
  const showFlashMessage = ({
    success,
    message,
  }: {
    success: boolean;
    message?: string;
  }) => {
    if (success) {
      toast({
        title: message || 'Successfully saved your book note',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: message || 'Error saving your book note',
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
      published: isPublished,
      userId: auth.user?.uid,
      title,
      bookId: bookId,
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
        try {
          createDocument('books', newBook, newBook.key);
        } catch (e) {
          showFlashMessage({
            success: false,
            message: 'Error saving the selected book',
          });
        }
      }
      // Else we don't need to do anything. As it means book already exists in db
    }

    // Finally set the document if !docID, else update it
    try {
      createOrUpdateDocument('book-notes', document, docId);
      showFlashMessage({ success: true });
    } catch (error) {
      showFlashMessage({ success: false });
      return;
    }
  };

  return (
    <Box maxW={'1080px'} margin="0 auto">
      <Box
        w="100%"
        pos={'fixed'}
        top="0"
        left={'0'}
        right="0"
        zIndex={10}
        px="2"
      >
        {/* Section for Top Bar */}
        <EditorTopBar onSave={onSave} />
      </Box>
      <Flex margin="0 auto" mt={'80px'} w="100%">
        {/* EditingSection */}
        <Box flex={1} pr={2}>
          <EditingSection />
        </Box>
        <Box w={'30%'}>
          <Box pos={'sticky'} top="73px">
            {/* Sidebar sticky area */}
            <EditorSidebar />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default EditorLayout;
