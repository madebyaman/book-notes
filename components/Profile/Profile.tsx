import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  Text,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import {
  ChangeEvent,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthContext, checkUsernameExist, UsernameError } from '../Auth';
import { ErrorFallback } from '../Error';
import { getCurrentUserProfile } from './getCurrentUserProfile';
import { updateCurrentUserInfo } from './updateCurrentUserInfo';
import { uploadProfilePicture } from './uploadProfilePicture';

const initialState = {
  name: '',
  username: '',
  usernameValid: true,
  loading: false,
};

type ProfileActions =
  | { type: 'UPDATE_NAME'; payload: string }
  | { type: 'UPDATE_USERNAME'; payload: string }
  | { type: 'UPDATE_USERNAME_STATE'; payload: boolean }
  | { type: 'UPDATE_LOADING_STATE'; payload: boolean };

function reducer(state: typeof initialState, action: ProfileActions) {
  switch (action.type) {
    case 'UPDATE_NAME':
      return { ...state, name: action.payload };
    case 'UPDATE_LOADING_STATE':
      return { ...state, loading: action.payload };
    case 'UPDATE_USERNAME':
      return { ...state, username: action.payload };
    case 'UPDATE_USERNAME_STATE':
      return { ...state, usernameValid: action.payload };
    default:
      return state;
  }
}

export const Profile = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [profilePicture, setProfilePicture] = useState<File | undefined>();
  const user = useContext(AuthContext);
  const toast = useToast();

  const onUsernameBlur = async () => {
    if (state.username) {
      if (await checkUsernameExist(state.username, user?.id)) {
        dispatch({ type: 'UPDATE_USERNAME_STATE', payload: false });
      } else {
        dispatch({ type: 'UPDATE_USERNAME_STATE', payload: true });
      }
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const updateName = async () => {
      if (isSubscribed) {
        const user = await getCurrentUserProfile();
        if (user) {
          dispatch({ type: 'UPDATE_NAME', payload: user.name });
          dispatch({ type: 'UPDATE_USERNAME', payload: user.username });
        }
      }
    };
    updateName();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) throw new Error('You are not logged in');
    dispatch({ type: 'UPDATE_LOADING_STATE', payload: true });
    try {
      const profilePhoto = await uploadProfilePicture(profilePicture);
      await updateCurrentUserInfo({
        name: state.name,
        username: state.username,
        photo: profilePhoto || null,
      });
      toast({
        title: 'Successfully saved your profile',
        status: 'success',
        duration: 1_000,
        isClosable: true,
      });
    } catch (e) {
      let message = 'Failed to save your profile';
      if (e instanceof UsernameError) message = 'Username already exists.';
      else console.error(e);
      toast({
        title: message,
        status: 'error',
        duration: 1_000,
        isClosable: true,
      });
    } finally {
      dispatch({ type: 'UPDATE_LOADING_STATE', payload: false });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length) {
      const file = e.target.files[0] as File;
      setProfilePicture(file);
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} pb={12} px={6}>
          <FormControl>
            <FormLabel>
              Name
              <Input
                value={state.name}
                placeholder="Your Name"
                onChange={(e) =>
                  dispatch({ type: 'UPDATE_NAME', payload: e.target.value })
                }
              />
            </FormLabel>
          </FormControl>
          <FormControl>
            <FormLabel>
              Username
              <InputGroup>
                <Input
                  value={state.username}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_USERNAME',
                      payload: e.target.value,
                    })
                  }
                  onBlur={onUsernameBlur}
                />
                <InputRightElement>
                  {state.usernameValid ? (
                    <CheckCircleIcon color="green.500" />
                  ) : (
                    <WarningIcon color="red.500" />
                  )}
                </InputRightElement>
              </InputGroup>
            </FormLabel>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="uploadImage">Upload Image</FormLabel>
            <Text fontSize={'sm'} my="2">
              Upload 150px * 150px photo for best results
            </Text>
            <input
              type="file"
              accept="image/png, image/jpeg"
              disabled={state.loading}
              onChange={handleFileChange}
              name="uploadImage"
              id="uploadImage"
            />
          </FormControl>
        </Stack>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} px={6}>
          <Button colorScheme="teal" type="submit" isLoading={state.loading}>
            Save Changes
          </Button>
        </Stack>
      </form>
    </ErrorBoundary>
  );
};
