import type { NextPage } from 'next';
import { useState, createContext, SetStateAction, Dispatch } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import BookSelect from '../components/BookSelect';
import Editor from '../components/editor';
import Ratings from '../components/Ratings';
import NoteEditor from '../components/NoteEditor';
import Title from '../components/Title';
import DateOfBookRead from '../components/DatePicker';
import {
  Flex,
  Box,
  Button,
  Stack,
  Heading,
  Spacer,
  Container,
} from '@chakra-ui/react';
import { FaArchive, FaPaperPlane } from 'react-icons/fa';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

type ErrorContextTypes = {
  error: any | null;
  setError: Dispatch<SetStateAction<any | null>>;
};

export const ErrorContext = createContext<ErrorContextTypes>({
  error: null,
  setError: () => {},
});

const AddBook: NextPage = () => {
  const [startDate, setStartDate] = useState(new Date('January 1, 1990'));
  const [error, setError] = useState<Error | null>(null);

  return (
    <div>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => setError(null)}
      >
        <ErrorContext.Provider value={{ error, setError }}>
          <Container maxW={'container.lg'}>
            <NoteEditor>
              <Flex color="white" align={'end'}>
                <Box py="4" textColor={'teal'}>
                  <Title />
                </Box>
                <Spacer />
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
              <BookSelect />
              <Editor />
              <Flex justify={'space-between'}>
                <Ratings />
                <DateOfBookRead />
              </Flex>
            </NoteEditor>
          </Container>
        </ErrorContext.Provider>
      </ErrorBoundary>
    </div>
  );
};

export default AddBook;
