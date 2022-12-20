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
import { deleteBookNote, RatingError, SlugError } from '@/utils/notes';
import { AuthContext } from '../Auth';
import { EditorTopbar } from './EditorTopbar';
import { useRouter } from 'next/router';
import { resetState, saveBook, saveData, useAppDispatch } from '@/utils/store';

export const Layout = ({
  pageLoading,
  docId = undefined,
}: {
  pageLoading: boolean;
  docId?: string;
}) => {
  const user = useContext(AuthContext);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

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
    if (!user || !user.emailVerified) return;
    setLoading(true);

    await Promise.allSettled([
      dispatch(saveData({ docId, userId: user.id }))
        .then((_) => {
          showFlashMessage({ success: true });
          router.push('/dashboard');
          dispatch(resetState());
        })
        .catch((error) => {
          let message = 'Error saving your content';
          if (error instanceof SlugError || error instanceof RatingError) {
            message = error.message;
          }
          showFlashMessage({ success: false, message });
        })
        .finally(() => {
          setLoading(false);
        }),
      dispatch(saveBook()).catch((error) => {
        showFlashMessage({
          success: false,
          message: 'Error saving the selected book',
        });
      }),
    ]);
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
      dispatch(resetState());
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
