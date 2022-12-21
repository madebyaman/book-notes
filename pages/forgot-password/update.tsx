import {
  Box,
  Button,
  createStandaloneToast,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

import { Logo } from '@/components/Logo';
import { useInput } from '@/utils';
import { updateUserPassword } from '@/utils/auth';

export default function UpdatePassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordProps, resetPassword] = useInput('');
  const [confirmPasswordProps, resetConfirmPassword] = useInput('');
  const [errorState, setErrorState] = useState('');
  const { toast } = createStandaloneToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordProps.value !== confirmPasswordProps.value) {
      setErrorState('Passwords do not match');
      return;
    }
    if (passwordProps.value.length < 6) {
      setErrorState('Password must be at least 6 characters long');
      return;
    }
    const { oobCode: code } = router.query;
    if (typeof code !== 'string') return;
    try {
      await updateUserPassword(code, passwordProps.value);
      toast({
        title: '🍺 Success',
        description: 'Password updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        router.push('/signin');
      }, 1000);
    } catch (e) {
      toast({
        title: '🔴 Failed',
        description: 'Unable to update your password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      resetPassword();
      resetConfirmPassword();
    }
  };

  return (
    <>
      <Head>
        <title>Change your password</title>
      </Head>
      <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'light.100'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Logo />
            <Heading fontSize={'4xl'} textAlign={'center'} color="text.400">
              Change your password
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
                <FormControl mt={'6'} id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input type={'password'} {...passwordProps} />
                  </InputGroup>
                </FormControl>
                <FormControl mt={'6'} id="confirmPassword" isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input type={'password'} {...confirmPasswordProps} />
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
                  >
                    Update password
                  </Button>
                </Stack>
              </form>
              {errorState && (
                <Box bgColor={'red.50'} color={'red.400'} py="4" px="2">
                  <Text>{errorState}</Text>
                </Box>
              )}
              <Text align={'center'} display={'inline-block'}>
                Want to signin?{' '}
                <Link color={'teal.700'} href={'/signin'}>
                  Sign in
                </Link>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
