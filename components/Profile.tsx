import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useReducer } from 'react';
import { useAuth } from '../utils/useAuth';

const initialState = {
  name: '',
  loading: false,
};

type ProfileActions =
  | { type: 'UPDATE_NAME'; payload: string }
  | { type: 'UPDATE_LOADING_STATE'; payload: boolean };

function reducer(state: typeof initialState, action: ProfileActions) {
  switch (action.type) {
    case 'UPDATE_NAME':
      return { ...state, name: action.payload };
    case 'UPDATE_LOADING_STATE':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

const Profile = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const auth = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (auth.user) {
      if (auth.user.displayName) {
        dispatch({ type: 'UPDATE_NAME', payload: auth.user.displayName });
      }
    }
  }, [auth.user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.user) return;
    try {
      console.log('name', state.name);
      toast({
        title: 'Successfully saved your profile',
        status: 'success',
        duration: 1_000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: 'Error saving your profile. Try again',
        status: 'error',
        duration: 1_000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <form>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} pb={12} px={6}>
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              value={state.name}
              placeholder="Your Name"
              onChange={(e) =>
                dispatch({ type: 'UPDATE_NAME', payload: e.target.value })
              }
            />
          </FormControl>
        </Stack>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} px={6}>
          <Button colorScheme="teal" type="submit" isLoading={state.loading}>
            Save Changes
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default Profile;
