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
import Image from 'next/image';

import { checkUsernameExist, signup, UsernameError } from '../components/Auth';
import { useInput } from '../utils';

export default function Signup() {
  const router = useRouter();
  const [nameProps, resetName] = useInput('');
  const [usernameProps, resetUsername] = useInput('');
  const [emailProps, resetEmail] = useInput('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordProps, resetPassword] = useInput('');
  const [errorState, setErrorState] = useState({
    usernameValid: false,
    passwordValid: false,
    showErrors: false,
    customError: '',
  });

  const onBlurUsername = async () => {
    if (usernameProps.value) {
      (await checkUsernameExist(usernameProps.value))
        ? setErrorState((prevState) => ({ ...prevState, usernameValid: false }))
        : setErrorState((prevState) => ({
            ...prevState,
            usernameValid: true,
          }));
    }
  };

  const onBlurPassword = () => {
    if (passwordProps.value.length <= 6) {
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
      await signup({
        email: emailProps.value,
        password: passwordProps.value,
        name: nameProps.value,
        username: usernameProps.value,
      });
      router.push('/dashboard');
    } catch (e) {
      let message = 'Error signing up. Try again';
      if (e instanceof UsernameError) message = e.message;
      else console.error(e);
      setErrorState({ ...errorState, customError: message, showErrors: true });
    } finally {
      setIsLoading(false);
      resetEmail();
      resetName();
      resetPassword();
      resetUsername();
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
      <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'light.100'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Image
              src="/Logo.svg"
              alt="Bummaries App"
              width="135px"
              height="74px"
            />
            <Heading fontSize={'4xl'} textAlign={'center'} color="text.400">
              Sign up
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
                <HStack mb={5}>
                  <Box>
                    <FormControl id="name" isRequired>
                      <FormLabel>Name</FormLabel>
                      <Input type="text" {...nameProps} />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="username" isRequired>
                      <FormLabel>Username</FormLabel>
                      <InputGroup>
                        <Input
                          type="text"
                          {...usernameProps}
                          onBlur={onBlurUsername}
                        />
                        {usernameProps.value && (
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
                  <Input type="email" {...emailProps} />
                </FormControl>
                <FormControl mt={'6'} id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={'password'}
                      onBlur={onBlurPassword}
                      {...passwordProps}
                    />
                  </InputGroup>
                </FormControl>
                <Stack spacing={10} py={2} mt={4}>
                  <Button
                    size="lg"
                    bg={'primary.700'}
                    color={'white'}
                    _hover={{ bg: 'primary.400' }}
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
                <Link color={'teal.700'} href={'/signin'}>
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
