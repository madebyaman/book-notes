import { Text, Heading, Link, Checkbox, Stack } from '@chakra-ui/react';
import { NextPage } from 'next';
import AuthForm from '../components/AuthForm';

const FormHeading = () => (
  <>
    <Heading fontSize={'4xl'} as="h1">
      Sign in to your account
    </Heading>
    <Text fontSize={'lg'} color={'gray.600'}>
      to enjoy all of our cool <Link color={'blue.400'}>features</Link>
    </Text>
  </>
);

const ContentBelowForm = () => (
  <Stack
    direction={{ base: 'column', sm: 'row' }}
    align={'start'}
    justify={'space-between'}
    mt={4}
  >
    <Checkbox>Remember me</Checkbox>
    <Link color={'blue.400'}>Forget password?</Link>
  </Stack>
);

const Login: NextPage = () => {
  return (
    <AuthForm
      mode="LOGIN"
      TopHeading={<FormHeading />}
      ContentBelowForm={<ContentBelowForm />}
    />
  );
};

export default Login;
