import { Text, Heading, Link, Checkbox, Stack } from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Dispatch, SetStateAction, useState } from 'react';

import AuthForm from '../components/AuthForm';

const FormHeading = () => (
  <>
    <Head>
      <title>Sign in</title>
    </Head>
    <Heading fontSize={'4xl'} as="h1">
      Sign in to your account
    </Heading>
  </>
);

const ContentBelowForm = ({
  rememberMe,
  setRememberMe,
}: {
  rememberMe: boolean;
  setRememberMe: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Stack
      direction={{ base: 'column', sm: 'row' }}
      align={'start'}
      justify={'space-between'}
      mt={4}
    >
      <Checkbox
        isChecked={rememberMe}
        onChange={() => setRememberMe((rememberMe) => !rememberMe)}
      >
        Remember me
      </Checkbox>
      <Link color={'blue.400'}>Forget password?</Link>
    </Stack>
  );
};

const Login: NextPage = () => {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <AuthForm
      mode="LOGIN"
      rememberMe={rememberMe}
      TopHeading={<FormHeading />}
      ContentBelowForm={
        <ContentBelowForm
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
        />
      }
    />
  );
};

export default Login;
