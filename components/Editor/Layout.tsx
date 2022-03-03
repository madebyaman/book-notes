import { Box, Flex, useToast } from '@chakra-ui/react';

import { useAuth } from '../../utils/auth';
import { useStoreState } from './store';
import { EditingSection } from './Main';
import { EditorSidebar } from './Sidebar';
import TopBar from './TopBar';
import { getBook } from './getBook';
import { uploadBookCover } from './uploadBookCover';
import { addBook } from './addBook';
import { createOrUpdateNote } from './createOrUpdateNote';

export const Layout = ({ docId = undefined }: { docId?: string }) => {
  const { content, rating, title, selectedBook, bookId, isPublished } =
    useStoreState((state) => state);
  const { user, isLoading } = useAuth();
  const toast = useToast();

  /**
   * Displays a flash message of success or failure
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

  const onSave = async () => {
    if (!user) return;
    const firstParagraphElement = content.split('</p>', 1)[0];
    const newExcerpt = firstParagraphElement.replace('<p>', '');

    const document = {
      content,
      rating,
      isPublished,
      userId: user?.id,
      title,
      excerpt: newExcerpt,
      bookId: bookId,
      lastUpdated: new Date(),
    };

    if (selectedBook) {
      // Check if document exists with id = selectedBook.key
      const bookDocSnap = await getBook(selectedBook.key);
      // If no book found, create a new book
      if (!bookDocSnap) {
        // First upload the book cover if selectedBook.cover exists
        const coverURL = await uploadBookCover(selectedBook.cover);
        const newBook = {
          ...selectedBook,
          photoURL: coverURL || undefined,
        };

        // The, get the URL of the uploaded image and set it to selectedBook.photoURL
        try {
          addBook(newBook);
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
      createOrUpdateNote(document, docId);
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
        <TopBar onSave={onSave} />
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
