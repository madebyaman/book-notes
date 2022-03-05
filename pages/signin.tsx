import { Text, Heading, Link, Checkbox, Stack } from '@chakra-ui/react';
import { NextPage } from 'next';
import { Dispatch, SetStateAction, useState } from 'react';

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
