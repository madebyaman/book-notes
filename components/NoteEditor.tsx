import React, { createContext, Dispatch, useReducer } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import BookSelect from '../components/BookSelect';
import Editor from '../components/editor';
import Ratings from '../components/Ratings';
import Title from '../components/Title';
import { Flex, Box, Button, Stack, Container } from '@chakra-ui/react';
import { FaArchive, FaPaperPlane } from 'react-icons/fa';
import ErrorFallback from './ErrorFallback';
import { BookOption } from '../types/JSONresponse';

type EDITORSTATE = {
  title: string;
  error: null | Error;
  selectedBook: BookOption | null;
  bookNote: string | null;
  rating: number | null;
};

type EDITORACTIONS =
  | { type: 'CHANGE_TITLE'; payload: string }
  | { type: 'ERROR_FOUND'; payload: any }
  | { type: 'RESET_ERROR' }
  | { type: 'NEW_BOOK_SELECTED'; payload: BookOption | null }
  | { type: 'RESET_SELECTED_BOOK' }
  | { type: 'CHANGE_CONTENT'; payload: string }
  | { type: 'CHANGE_RATING'; payload: number };

const reducer = (state: EDITORSTATE, action: EDITORACTIONS) => {
  switch (action.type) {
    case 'CHANGE_TITLE':
      return { ...state, title: action.payload };
    case 'ERROR_FOUND':
      return { ...state, error: action.payload };
    case 'RESET_ERROR':
      return { ...state, error: null };
    case 'NEW_BOOK_SELECTED':
      return { ...state, selectedBook: action.payload };
    case 'RESET_SELECTED_BOOK':
      return { ...state, selectedBook: null };
    case 'CHANGE_CONTENT':
      return { ...state, bookNote: action.payload };
    case 'CHANGE_RATING':
      return { ...state, rating: action.payload };
    default:
      return state;
  }
};

const initialEditorState = {
  title: '',
  error: null,
  selectedBook: null,
  bookNote: '',
  rating: null,
};

export const NoteEditorContext = createContext<{
  state: EDITORSTATE;
  dispatch: Dispatch<EDITORACTIONS>;
}>({
  state: initialEditorState,
  dispatch: () => undefined,
});

const onPublish = () => {
  // Show error if no title | no book selected | no notes | no rating
  // Else, call onSave with publish set to true.
};

const onSave = (publish: Boolean) => {
  // Push to firebase
};

const NoteEditor = () => {
  const [state, dispatch] = useReducer(reducer, initialEditorState);

  return (
    <div>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => dispatch({ type: 'RESET_ERROR' })}
      >
        <NoteEditorContext.Provider value={{ state, dispatch }}>
          <Box
            zIndex={'2'}
            position={'fixed'}
            w="100%"
            top="0"
            boxShadow={'sm'}
          >
            <Container maxW={'container.lg'}>
              <Flex color="white" align={'center'} justify={'space-between'}>
                <Box py="4" color={'blackAlpha.900'}>
                  <Title />
                </Box>
                <Box py="4">
                  <Stack direction={'row'} spacing={6}>
                    <Button
                      leftIcon={<FaPaperPlane />}
                      variant={'solid'}
                      colorScheme={'teal'}
                    >
                      Publish
                    </Button>
                    <Button
                      leftIcon={<FaArchive />}
                      variant={'outline'}
                      colorScheme={'teal'}
                    >
                      Save
                    </Button>
                  </Stack>
                </Box>
              </Flex>
            </Container>
          </Box>
          <Container maxW={'container.lg'} mt="28">
            <BookSelect />
            <Editor />
            <Ratings />
          </Container>
        </NoteEditorContext.Provider>
      </ErrorBoundary>
    </div>
  );
};

export default NoteEditor;
