import { CheckCircleIcon, WarningTwoIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Flex,
  Stack,
  Button,
  Link,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

import { checkUsernameExist, signup, UsernameError } from '../components/Auth';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [errorState, setErrorState] = useState({
    usernameValid: false,
    passwordValid: false,
    showErrors: false,
    customError: '',
  });

  const onBlurUsername = async () => {
    if (username) {
      (await checkUsernameExist(username))
        ? setErrorState((prevState) => ({ ...prevState, usernameValid: false }))
        : setErrorState((prevState) => ({
            ...prevState,
            usernameValid: true,
          }));
    }
  };

  const onBlurPassword = () => {
    if (password.length <= 6) {
      setErrorState({ ...errorState, passwordValid: false });
    } else {
      setErrorState({ ...errorState, passwordValid: true });
    }
  };

  const ErrorIcon = (isValid: boolean) => {
    if (isValid) {
      return <CheckCircleIcon color="green.500" />;
    }
    return <WarningTwoIcon color="red.500" />;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (!errorState.usernameValid || !errorState.passwordValid) {
      setErrorState({ ...errorState, showErrors: true });
      return;
    }
    try {
      await signup({ email, password, name, username });
      router.push('/dashboard');
    } catch (e) {
      let message = 'Error signing up. Try again';
      if (e instanceof UsernameError) message = e.message;
      else console.error(e);
      setErrorState({ ...errorState, customError: message, showErrors: true });
    } finally {
      setIsLoading(false);
    }
  };

  const showErrors =
    errorState.showErrors &&
    (!errorState.usernameValid ||
      !errorState.passwordValid ||
      Boolean(errorState.customError));

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack spacing={'4'}>
              <form onSubmit={handleSubmit}>
                <HStack mb={5}>
                  <Box>
                    <FormControl id="name" isRequired>
                      <FormLabel>Name</FormLabel>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="username" isRequired>
                      <FormLabel>Username</FormLabel>
                      <InputGroup>
                        <Input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onBlur={onBlurUsername}
                        />
                        {username && (
                          <InputRightElement>
                            {ErrorIcon(errorState.usernameValid)}
                          </InputRightElement>
                        )}
                      </InputGroup>
                    </FormControl>
                  </Box>
                </HStack>
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
                      onBlur={onBlurPassword}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
                <Stack spacing={10} py={2} mt={4}>
                  <Button
                    size="lg"
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{ bg: 'blue.500' }}
                    type="submit"
                    isLoading={isLoading}
                    isDisabled={showErrors}
                  >
                    Sign up
                  </Button>
                </Stack>
              </form>
              {showErrors && (
                <Box bgColor={'red.50'} color={'red.400'} py="4" px="2">
                  <Heading as="h4" fontSize={'18px'} my="2">
                    Errors:
                  </Heading>
                  <UnorderedList>
                    {!errorState.usernameValid && (
                      <ListItem>Username is already taken</ListItem>
                    )}
                    {!errorState.passwordValid && (
                      <ListItem>
                        Password must be at least 6 characters long
                      </ListItem>
                    )}
                    {errorState.customError && (
                      <ListItem>{errorState.customError}</ListItem>
                    )}
                  </UnorderedList>
                </Box>
              )}
              <Text align={'center'} display={'inline-block'}>
                Not a user?{' '}
                <Link color={'blue.400'} href={'/signin'}>
                  Log in
                </Link>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
