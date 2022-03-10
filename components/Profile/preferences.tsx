import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Image,
  useToast,
  Text,
  InputGroup,
  InputRightElement,
  Grid,
  Box,
  Heading,
  Flex,
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
import { useUserProfileHook } from './useUserProfileHook';

const initialState = {
  name: '',
  username: '',
  usernameValid: true,
  bio: '',
  photoUrl: '',
  loading: false,
};

type ProfileActions =
  | { type: 'UPDATE_NAME'; payload: string }
  | { type: 'UPDATE_USERNAME'; payload: string }
  | { type: 'UPDATE_USERNAME_STATE'; payload: boolean }
  | { type: 'UPDATE_BIO'; payload: string }
  | { type: 'UPDATE_PHOTO'; payload: string | null }
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

export const ProfilePreferences = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [profilePicture, setProfilePicture] = useState<File | undefined>();
  const userProfile = useUserProfileHook();
  const user = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    let isSubscribed = true;

    if (userProfile && isSubscribed) {
      dispatch({ type: 'UPDATE_NAME', payload: userProfile.name });
      dispatch({ type: 'UPDATE_USERNAME', payload: userProfile.username });
      dispatch({ type: 'UPDATE_BIO', payload: userProfile.bio || '' });
      dispatch({ type: 'UPDATE_PHOTO', payload: userProfile.photo || null });
    }

    return () => {
      isSubscribed = false;
    };
  }, [userProfile]);

  const onUsernameBlur = async () => {
    if (state.username) {
      if (await checkUsernameExist(state.username, user?.id)) {
        dispatch({ type: 'UPDATE_USERNAME_STATE', payload: false });
      } else {
        dispatch({ type: 'UPDATE_USERNAME_STATE', payload: true });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) throw new Error('You are not logged in');
    dispatch({ type: 'UPDATE_LOADING_STATE', payload: true });
    try {
      const profilePhoto = await uploadProfilePicture(profilePicture);
      const updates: { name: string; username: string; photo?: string } = {
        name: state.name,
        username: state.username,
      };
      if (profilePhoto) updates.photo = profilePhoto;
      await updateCurrentUserInfo(updates);
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
      <Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap="6">
        <Box>
          <Heading as="h2" fontSize="30px" color="text.400">
            Profile
          </Heading>
          <Text>
            This information will be displayed on your user profile page.
          </Text>
        </Box>
        <Box rounded="md" px="8" py="6" backgroundColor={'white'}>
          <form onSubmit={handleSubmit}>
            <Flex gap="3" mt="4">
              {state.photoUrl ? (
                <Image
                  src={state.photoUrl}
                  alt={state.name}
                  width="80px"
                  height="80px"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    color: '#4A5568',
                    width: '80px',
                    height: '80px',
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
              <Box>
                <FormLabel htmlFor="uploadImage">Profile Picture</FormLabel>
                <Text fontSize={'sm'} my="1">
                  Upload 150px * 150px photo to display in public profile.
                </Text>
                <Box pos="relative" overflow={'hidden'}>
                  <Button
                    display={'flex'}
                    gap="3"
                    backgroundColor="transparent"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{
                      borderColor: 'gray.400',
                    }}
                    mt="3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        width: '18px',
                        height: '18px',
                      }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Upload
                  </Button>
                  <input
                    style={{
                      position: 'absolute',
                      zIndex: -1,
                      left: 0,
                      top: 0,
                      opacity: 0,
                    }}
                    type="file"
                    accept="image/png, image/jpeg"
                    disabled={state.loading}
                    onChange={handleFileChange}
                    name="uploadImage"
                    id="uploadImage"
                  />
                </Box>
              </Box>
            </Flex>
            <FormControl mt="4">
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
                    type="text"
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
            <Button colorScheme="teal" type="submit" isLoading={state.loading}>
              Save Changes
            </Button>
          </form>
        </Box>
      </Grid>
    </ErrorBoundary>
  );
};
