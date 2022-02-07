import {
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';
import AuthForm from '../components/AuthForm';

const FormHeading = () => (
  <>
    <Heading fontSize={'4xl'} textAlign={'center'}>
      Sign up
    </Heading>
    <Text fontSize={'lg'} color={'gray.600'}>
      to enjoy all of our cool features ✌️
    </Text>
  </>
);

const FormElements = ({
  firstName,
  lastName,
  setFirstName,
  setLastName,
}: {
  firstName: string;
  lastName: string;
  setFirstName: Dispatch<SetStateAction<string>>;
  setLastName: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <HStack mb={5}>
      <Box>
        <FormControl id="firstName" isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl id="lastName">
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormControl>
      </Box>
    </HStack>
  );
};

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  return (
    <AuthForm
      mode="SIGNUP"
      TopHeading={<FormHeading />}
      FormElements={
        <FormElements
          firstName={firstName}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
        />
      }
      name={`${firstName} ${lastName}`}
    />
  );
}
