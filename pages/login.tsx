import {
  Text,
  Stack,
  Heading,
  Link,
  Flex,
  useColorModeValue,
  FormControl,
  Box,
  FormLabel,
  Input,
  Checkbox,
  Button,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import ChakraNextLinkButton from '../components/ChakraNextLink';
import { useAuth } from '../utils/useAuth';

const Login: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { signIn, authState } = useAuth();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (authState.useStatusState.status === 'loaded') {
      if (authState.useStatusState.state) {
        router.push('/dashboard');
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signIn) {
      console.log('No method');
      return;
    }
    await signIn({ email, password });
    if (authState.useStatusState.status === 'error') {
      setShowError(true);
    } else if (authState.useStatusState.status === 'loaded') {
      console.log('redirecting to dashboard');
      router.push('/dashboard');
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} as="h1">
            Sign in to your account
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link>
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <form onSubmit={handleSubmit}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" my="4">
                <FormLabel>Password</FormLabel>
                <Input
                  type={'password'}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </FormControl>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              >
                <Checkbox>Remember me</Checkbox>
                <Link color={'blue.400'}>Forget password?</Link>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{ bg: 'blue.500' }}
                type="submit"
                my={4}
                isLoading={authState.useStatusState.status === 'loading'}
              >
                Log in
              </Button>
            </form>
            {authState.useStatusState.status === 'error' && showError && (
              <Text align={'center'} color={'red.400'} fontWeight={'bold'}>
                Error {authState.useStatusState.error.code}
              </Text>
            )}
            <Text align={'center'}>
              Not a user?{' '}
              <ChakraNextLinkButton color={'blue.400'} href="/signup">
                Signup
              </ChakraNextLinkButton>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
