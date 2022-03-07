import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import { FallbackProps } from 'react-error-boundary';

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps): JSX.Element => {
  return (
    <div role="alert">
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Something went wrong!
        </AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
        {resetErrorBoundary && (
          <button onClick={resetErrorBoundary}>Try again</button>
        )}
      </Alert>
    </div>
  );
};
