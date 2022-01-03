import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FormEvent, useReducer } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import ChakraNextLinkButton from '../components/ChakraNextLink';
import { useAuth } from '../utils/useAuth';
import { useRouter } from 'next/router';

interface SIGNUPFORMSTATE {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  showPassword: boolean;
}

type SIGNUPFORMACTIONS =
  | { type: 'CHANGE_FIRST_NAME'; payload: string }
  | { type: 'CHANGE_LAST_NAME'; payload: string }
  | { type: 'CHANGE_EMAIL'; payload: string }
  | { type: 'CHANGE_PASSWORD'; payload: string }
  | { type: 'CHANGE_SHOW_PASSWORD' };

const reducer = (state: SIGNUPFORMSTATE, action: SIGNUPFORMACTIONS) => {
  switch (action.type) {
    case 'CHANGE_FIRST_NAME':
      return { ...state, firstName: action.payload };
    case 'CHANGE_LAST_NAME':
      return { ...state, lastName: action.payload };
    case 'CHANGE_EMAIL':
      return { ...state, email: action.payload };
    case 'CHANGE_PASSWORD':
      return { ...state, password: action.payload };
    case 'CHANGE_SHOW_PASSWORD':
      return { ...state, showPassword: !state.showPassword };
    default:
      return state;
  }
};

const initalSignupFormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  showPassword: false,
};

export default function Signup() {
  const [state, dispatch] = useReducer(reducer, initalSignupFormState);
  const { firstName, lastName, email, password, showPassword } = state;
  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = firstName + ' ' + lastName;
    // After signing up, show loading state and success state
    auth
      .signUp({ email, password, name })
      .then((user: any) => {
        router.push('/dashboard');
      })
      .catch((err: any) => {
        console.log(err);
      });
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
          <Stack spacing={4}>
            <form onSubmit={handleSubmit}>
              <HStack my={'6'}>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) =>
                        dispatch({
                          type: 'CHANGE_FIRST_NAME',
                          payload: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) =>
                        dispatch({
                          type: 'CHANGE_LAST_NAME',
                          payload: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    dispatch({
                      type: 'CHANGE_EMAIL',
                      payload: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl my={'6'} id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) =>
                      dispatch({
                        type: 'CHANGE_PASSWORD',
                        payload: e.target.value,
                      })
                    }
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => dispatch({ type: 'CHANGE_SHOW_PASSWORD' })}
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type="submit"
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user?{' '}
                  <ChakraNextLinkButton color={'blue.400'} href="/login">
                    Login
                  </ChakraNextLinkButton>
                </Text>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
