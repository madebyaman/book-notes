import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
  Text,
  InputGroup,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FormEvent, ReactNode, useState } from 'react';
import { useAuth } from '../utils/useAuth';
import ChakraNextLinkButton from './ChakraNextLink';

interface AuthFormInterface {
  mode?: 'LOGIN' | 'SIGNUP';
  TopHeading?: ReactNode;
  ContentBelowForm?: ReactNode;
  name?: string;
  FormElements?: ReactNode;
}

const AuthForm = ({
  mode = 'LOGIN',
  TopHeading = <></>,
  name,
  ContentBelowForm = <></>,
  FormElements = <></>,
}: AuthFormInterface) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'LOGIN') {
      // Login mode
      if (!signIn) return;
      try {
        await signIn({ email, password });
        router.push('/dashboard');
      } catch (e) {
        setError('Invalid email or password');
      } finally {
        setLoading(false);
      }
    } else {
      // Signup mode
      return async (name: string) => {
        if (!signUp) return;
        try {
          await signUp({ email, password, name });
          router.push('/dashboard');
        } catch (e: any) {
          setError(e.code);
        } finally {
          setLoading(false);
        }
      };
    }
  };

  const href = mode === 'LOGIN' ? '/signup' : '/login';

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>{TopHeading}</Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack>
            <form onSubmit={handleSubmit}>
              {FormElements}
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl mt={'6'} id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormControl>

              {ContentBelowForm}
              <Stack spacing={10} py={2} my={4}>
                <Button
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{ bg: 'blue.500' }}
                  type="submit"
                  isLoading={loading}
                >
                  {mode === 'LOGIN' ? 'Log in' : 'Sign up'}
                </Button>
              </Stack>
            </form>
            {error !== '' && (
              <Text mb={4} color={'tomato'}>
                {error}
              </Text>
            )}
            <Text align={'center'} display={'inline-block'}>
              Not a user?{' '}
              <ChakraNextLinkButton color={'blue.400'} href={href}>
                {mode === 'LOGIN' ? 'Sign up' : 'Log in'}
              </ChakraNextLinkButton>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default AuthForm;
