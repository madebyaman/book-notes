import {
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton,
} from '@chakra-ui/react';
import { FallbackProps } from 'react-error-boundary';

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps): JSX.Element => {
  return (
    <div role="alert">
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>{error.message}</AlertDescription>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    </div>
  );
};
