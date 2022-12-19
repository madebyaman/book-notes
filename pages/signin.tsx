import {
  Text,
  Heading,
  Link as ChakraLink,
  Checkbox,
  Stack,
  Flex,
  useColorModeValue,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Button,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { signin } from '@/utils/auth';
import { Logo } from '@/components/Logo';

interface FormState {
  remember: boolean;
  email: string;
  password: string;
  status: 'INIT' | 'LOADING' | 'SUCCESS';
}

const Login: NextPage = () => {
  const [formState, setFormState] = useState<FormState>({
    remember: false,
    email: '',
    password: '',
    status: 'INIT',
  });
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ ...formState, status: 'LOADING' });

    try {
      await signin({
        email: formState.email,
        password: formState.password,
        remember: formState.remember,
      });
      setFormState({ ...formState, status: 'SUCCESS' });
      toast({
        title: 'Logged in ✅',
        description: 'You have successfully logged in',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/dashboard');
    } catch (e) {
      let message = 'Error signin in.';
      if (e instanceof Error) message = e.message;
      toast({
        title: '⚠️ Login unsuccessful',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setFormState({
        ...formState,
        remember: false,
        email: '',
        password: '',
        status: 'SUCCESS',
      });
    }
  };

  return (
    <>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Head>
            <title>Sign in</title>
          </Head>
          <Stack align={'center'} my="4" spacing="4">
            <Logo />
            <Heading fontSize={'4xl'} as="h1" color="text.400">
              Sign in to your account
            </Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack spacing={'4'}>
              <form onSubmit={handleSubmit}>
                <Stack
                  direction={'column'}
                  align={'start'}
                  justify={'space-between'}
                  mt={4}
                  spacing="4"
                >
                  <FormControl id="email" isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input
                      type="email"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mt={'6'} id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type="password"
                        value={formState.password}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            password: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </FormControl>
                  <Checkbox
                    isChecked={formState.remember}
                    onChange={() =>
                      setFormState({
                        ...formState,
                        remember: !formState.remember,
                      })
                    }
                    colorScheme="teal"
                  >
                    Remember me
                  </Checkbox>
                </Stack>

                <Stack spacing={10} py={2} mt={4}>
                  <Button
                    size="lg"
                    bg={'primary.700'}
                    color={'white'}
                    _hover={{ bg: 'primary.400' }}
                    type="submit"
                    isLoading={formState.status === 'LOADING'}
                    loadingText={'Logging in'}
                  >
                    Log in
                  </Button>
                </Stack>
              </form>
              <Text align={'center'} display={'inline-block'}>
                Not a user?{' '}
                <Link href="/signup" passHref>
                  <ChakraLink color={'teal.600'}>Sign up</ChakraLink>
                </Link>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
};

export default Login;
