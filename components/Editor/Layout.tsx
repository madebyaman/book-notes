import {
  Box,
  Container,
  Flex,
  Skeleton,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

import { ContentEditorWrapper } from './Main';
import { EditorSidebar } from './Sidebar';
import {
  deleteBookNote,
  uploadBookCover,
  getBook,
  addBook,
  createOrUpdateNote,
  RatingError,
  SlugError,
} from '@/utils/notes';
import { AuthContext } from '../Auth';
import { EditorTopbar } from './EditorTopbar';
import { useRouter } from 'next/router';

export const Layout = ({
  pageLoading,
  docId = undefined,
}: {
  pageLoading: boolean;
  docId?: string;
}) => {
  const { content, rating, title, selectedBook, bookId, isPublished, slug } =
    useStoreState((state) => state);
  const resetState = useStoreActions((actions) => actions.resetState);
  const user = useContext(AuthContext);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [key, setKey] = useState(0);

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
    console.log('content inside onSave', content, rating);
    if (!user || !user.emailVerified) return;
    setLoading(true);
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
      slug,
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
    }

    // Finally set the document if !docID, else update it
    try {
      await createOrUpdateNote({
        newDoc: document,
        docId,
      });
      showFlashMessage({ success: true });
      setLoading(false);
      router.push('/dashboard');
      resetState();
    } catch (error) {
      let message = 'Error saving your content';
      if (error instanceof SlugError || error instanceof RatingError) {
        message = error.message;
      }
      showFlashMessage({ success: false, message });
      setLoading(false);
    }
  };

  const deleteCurrentNote = async () => {
    if (!docId) return;
    try {
      await deleteBookNote(docId);
      router.push('/dashboard');
      showFlashMessage({
        success: true,
        message: 'Successfully deleted book note',
      });
      resetState();
    } catch (e) {
      showFlashMessage({
        success: false,
        message: 'Error deleting book note. Try again',
      });
    }
  };

  return (
    <Box backgroundColor="light.100">
      <Box w="100%" shadow="md" px="2">
        {/* Section for Top Bar */}
        <EditorTopbar
          onSave={onSave}
          loading={loading || pageLoading}
          onDelete={deleteCurrentNote}
        />
      </Box>
      <Container maxW="container.lg">
        {pageLoading ? (
          <LoadingComponent />
        ) : (
          <>
            <Flex
              margin="0 auto"
              w="100%"
              flexDir={{ base: 'column', md: 'row' }}
              gap="8"
            >
              {/* EditingSection */}
              <Box flex={1} mt="2">
                <ContentEditorWrapper />
              </Box>
              <Box w={{ base: '100%', md: '30%' }}>
                <Box pos={{ base: 'static', md: 'sticky' }}>
                  {/* Sidebar sticky area */}
                  <EditorSidebar docId={docId} />
                </Box>
              </Box>
            </Flex>
          </>
        )}
      </Container>
    </Box>
  );
};

const LoadingComponent = () => (
  <Stack mt={20}>
    <Skeleton height="10px" />
    <Skeleton height="10px" />
    <Skeleton height="10px" />
    <Skeleton height="10px" />
    <Skeleton height="10px" />
  </Stack>
);
