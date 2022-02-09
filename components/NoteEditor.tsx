import React, { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import BookSelect from '../components/BookSelect';
import Editor from '../components/editor';
import Ratings from '../components/Ratings';
import {
  Flex,
  Box,
  Button,
  Stack,
  Container,
  useToast,
  Text,
  Heading,
  IconButton,
  Spacer,
} from '@chakra-ui/react';
import { FaArchive, FaPaperPlane } from 'react-icons/fa';
import ErrorFallback from './ErrorFallback';
import { Book, BookNote } from '../@types/booktypes';

import db from '../firebase';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/useAuth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  QueryDocumentSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { StoreProvider } from 'easy-peasy';
import {
  useStoreState,
  NoteEditorStore,
  useStoreActions,
} from '../utils/store';
import { fetchDoc } from '../utils/fetchDoc';

const NoteEditorConsumer = ({ docId }: { docId?: string }) => {
  const { selectedBook, rating, content, title, excerpt } = useStoreState(
    (state) => state
  );
  const updateContent = useStoreActions((actions) => actions.updateContent);
  const updateRating = useStoreActions((actions) => actions.updateRating);
  const updateTitle = useStoreActions((actions) => actions.updateTitle);
  const updateExcerpt = useStoreActions((actions) => actions.updateExcerpt);
  const updateSelectedBook = useStoreActions(
    (actions) => actions.updateSelectedBook
  );

  const auth = useAuth();
  const toast = useToast();
  const router = useRouter();

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

            if (note.bookID) {
              try {
                // Fetch the book
                const bookDocSnap = (await fetchDoc(
                  `books/${note.bookID}`
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
      }
    }

    fetchNote();
  }, [docId]);

  const onPublish = () => {
    // Show error if no title | no book selected | no notes | no rating
    if (content && rating) {
      toast({
        title: 'Successfully published',
        description: 'View it live',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // TODO publish when userID is available
    } else {
      if (!bookNote) {
        toast({
          title: 'Add book note',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      if (!rating) {
        toast({
          title: 'Add book rating',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  // save content, images, etc
  const onSave = async () => {
    // Push to firebase
    // If no docID
    const document = {
      content: bookNote,
      rating: rating || null,
      published: publish,
      userId:
        // This whole thing can be moved to util
        auth.status === 'loaded' && auth.user !== null ? auth.user.uid : null,
      title: title,
    };
    if (bookID) {
      // set a new selected book
      const docRef = doc(db, 'books', bookID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
      } else {
        const docRef = await addDoc(collection(db, 'books'), selectedBook);
        document.bookID = docRef.id;
      }
      // But if there is a document with id, then don't do it.
    }
    if (!docId) {
      const docRef = await addDoc(collection(db, 'book-notes'), document);
    } else {
      // If docID set the document
      const documentRef = doc(db, 'book-notes', docId);
      await updateDoc(documentRef, document);
      console.log('updated doc', documentRef.id);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      // onReset={() => }
    >
      <Box
        zIndex={'2'}
        position={'fixed'}
        w="100%"
        top="0"
        borderBottom={'1px solid #e9ebf0'}
        backgroundColor={'white'}
      >
        <Container maxW={'container.xl'}>
          <Flex color="white" align={'center'} justify={'space-between'}>
            <Box py="4" borderRight={'1px solid #e9ebf0'} pr="4">
              <IconButton
                aria-label="Go back"
                variant={'unstyled'}
                icon={<ArrowBackIcon color={'blackAlpha.700'} />}
                onClick={() => router.back()}
              />
            </Box>
            <Box py="4" color={'blackAlpha.900'}>
              <Heading as="h1" size="sm">
                Add a New Book
              </Heading>
            </Box>
            <Box py="4">
              <Stack direction={'row'} spacing={6}>
                <Button
                  leftIcon={<FaPaperPlane />}
                  variant={'solid'}
                  colorScheme={'teal'}
                  onClick={onPublish}
                >
                  Publish
                </Button>
                <Button
                  leftIcon={<FaArchive />}
                  variant={'outline'}
                  colorScheme={'teal'}
                  onClick={() => onSave({ publish: false })}
                >
                  Save
                </Button>
              </Stack>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Box mt="20" flex={'1'} w="60%" mx="24">
        <Editor />
      </Box>
      <Flex
        mt="28"
        w="30%"
        px="12"
        borderLeft={'1px solid #e9ebf0'}
        minH="calc(100vh - 150px)"
        flexDir={'column'}
        pos={'fixed'}
        top={'0'}
        right={'0'}
        zIndex={'10'}
      >
        <BookSelect />
        <Text fontSize={'md'} mt="12" mb="2">
          How strongly would you recommend it?
        </Text>
        <Ratings />
        <Spacer />
        {selectedBook && (
          <Flex bg="gray.100" borderRadius={'md'} p="4">
            <img
              src={
                selectedBook.photoURL
                  ? selectedBook.photoURL
                  : `https://covers.openlibrary.org/b/id/${selectedBook.cover}-M.jpg`
              }
              alt={selectedBook.title}
              style={{
                height: '100px',
                width: 'auto',
                marginRight: '15px',
              }}
            />
            <Box>
              <Heading as="h3" size="sm">
                {selectedBook?.title}
              </Heading>
              <Text>{selectedBook.year}</Text>
              <Text>{selectedBook.author}</Text>
            </Box>
          </Flex>
        )}
      </Flex>
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
