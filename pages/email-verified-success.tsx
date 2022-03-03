import { CenteredLayout } from '../components/Layout';
import { Link as ChakraLink, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function EmailVerifiedSuccess() {
  const router = useRouter();

  return (
    <CenteredLayout>
      <Text>
        Congrats! You successfully verified your email.{' '}
        <ChakraLink onClick={() => router.push('/signin')} color="teal">
          Login
        </ChakraLink>
      </Text>
    </CenteredLayout>
  );
}
