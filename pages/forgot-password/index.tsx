import { Logo } from '@/components/Logo';
import { sendResetPasswordEmail } from '@/utils/auth';
import {
  Box,
  Button,
  createStandaloneToast,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import { FormEvent, useState } from 'react';

interface FormState {
  email: string;
  status: 'INIT' | 'LOADING' | 'SUCCESS';
}

const ForgotPassword: NextPage = () => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    status: 'INIT',
  });
  const { toast } = createStandaloneToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ ...formState, status: 'LOADING' });

    try {
      await sendResetPasswordEmail(formState.email);
      setFormState({ ...formState, status: 'SUCCESS' });
      toast({
        title: '🍺 Email sent',
        description: 'Email has been sent. Check your inbox.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: '⚠️ Unable to send email',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setFormState({
        ...formState,
        email: '',
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
            <title>Reset your password</title>
          </Head>
          <Stack align={'center'} my="4" spacing="4">
            <Logo />
            <Heading fontSize={'4xl'} as="h1" color="text.400">
              Reset your password
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
                    Send reset email
                  </Button>
                </Stack>
              </form>
              <Text align={'center'} display={'inline-block'}>
                Want to sign in?{' '}
                <ChakraLink href="/signin" color={'teal.600'}>
                  Sign in
                </ChakraLink>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
};

export default ForgotPassword;
