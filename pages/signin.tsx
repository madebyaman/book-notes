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
} from '@chakra-ui/react';
import Link from 'next/link';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { useInput } from '../utils';
import { signin } from '../components/Auth';
import Image from 'next/image';

const Login: NextPage = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [emailProps, resetEmail] = useInput('');
  const [passwordProps, resetPassword] = useInput('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signin({
        email: emailProps.value,
        password: passwordProps.value,
        remember: rememberMe,
      });
      router.push('/dashboard');
    } catch (e) {
      let message = 'Error signin up.';
      if (e instanceof Error) message = e.message;
      setError(message);
    } finally {
      setLoading(false);
      setRememberMe(false);
      resetEmail();
      resetPassword();
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
            <Image
              src="/Logo.svg"
              alt="Bummaries App"
              width="135px"
              height="74px"
            />
            <Heading fontSize={'4xl'} as="h1">
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
                    <Input type="email" {...emailProps} />
                  </FormControl>
                  <FormControl mt={'6'} id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input type={'password'} {...passwordProps} />
                    </InputGroup>
                  </FormControl>
                  <Checkbox
                    isChecked={rememberMe}
                    onChange={() => setRememberMe((rememberMe) => !rememberMe)}
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
                    isLoading={loading}
                  >
                    Log in
                  </Button>
                </Stack>
              </form>
              {error !== '' && <Text color={'tomato'}>{error}</Text>}
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
