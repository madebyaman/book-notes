import { checkUsernameExist, UsernameError } from '@/utils/auth';
import {
  updateCurrentUserInfo,
  uploadProfilePicture,
  useUserProfileHook,
} from '@/utils/profile';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthContext } from '../Auth';
import { ErrorFallback } from '../Error';

const initialState: {
  name: string;
  username: string;
  usernameValid: boolean;
  bio: string;
  photoUrl: null | string;
  loading: boolean;
} = {
  name: '',
  username: '',
  usernameValid: true,
  bio: '',
  photoUrl: null,
  loading: false,
};

type ProfileActions =
  | { type: 'UPDATE_NAME'; payload: string }
  | { type: 'UPDATE_USERNAME'; payload: string }
  | { type: 'UPDAE_IS_USERNAME_VALID'; payload: boolean }
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
    case 'UPDAE_IS_USERNAME_VALID':
      return { ...state, usernameValid: action.payload };
    case 'UPDATE_BIO':
      return { ...state, bio: action.payload };
    case 'UPDATE_PHOTO':
      return { ...state, photoUrl: action.payload };
    default:
      throw new Error(`No action defined`);
  }
}

export const ProfilePreferences = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [profilePicture, setProfilePicture] = useState<File | undefined>();
  const { profile, loading } = useUserProfileHook();
  const user = useContext(AuthContext);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    let isSubscribed = true;

    if (profile && isSubscribed) {
      dispatch({ type: 'UPDATE_NAME', payload: profile.name });
      dispatch({ type: 'UPDATE_USERNAME', payload: profile.username });
      dispatch({ type: 'UPDATE_BIO', payload: profile.bio || '' });
      dispatch({ type: 'UPDATE_PHOTO', payload: profile.photo || null });
    }

    if (!profile && !loading) {
      router.push('/signin');
    }

    return () => {
      isSubscribed = false;
    };
  }, [profile, loading, router]);

  const onUsernameBlur = async () => {
    if (state.username) {
      if (await checkUsernameExist(state.username, user?.id)) {
        dispatch({ type: 'UPDAE_IS_USERNAME_VALID', payload: false });
      } else {
        dispatch({ type: 'UPDAE_IS_USERNAME_VALID', payload: true });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) throw new Error('You are not logged in');
    dispatch({ type: 'UPDATE_LOADING_STATE', payload: true });
    let message = 'Failed to save your profile';
    try {
      const profilePhoto = await uploadProfilePicture(profilePicture);
      const updates: {
        name: string;
        username: string;
        photo?: string;
        bio: string;
      } = {
        name: state.name,
        username: state.username,
        bio: state.bio,
      };
      if (profilePhoto) updates.photo = profilePhoto;
      if (!profile) return;
      await updateCurrentUserInfo(updates, profile.id);
      toast({
        title: 'Successfully saved your profile',
        status: 'success',
        duration: 1_000,
        isClosable: true,
      });
    } catch (e) {
      if (e instanceof UsernameError) message = 'Username already exists';
      else if (e instanceof Error) message = e.message;
      toast({
        title: message || 'Failed to save your profile',
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
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => router.reload()}
    >
      <Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap="6">
        <Box>
          <Heading as="h2" fontSize="30px" color="text.400">
            Profile
          </Heading>
          <Text>
            This information will be displayed on your user profile page.
          </Text>
        </Box>
        <Box rounded="md" shadow="md" px="8" py="6" backgroundColor={'white'}>
          <form onSubmit={handleSubmit}>
            <Flex gap="4" mt="4">
              {state.photoUrl ? (
                <Image
                  src={state.photoUrl}
                  alt={state.name}
                  rounded="full"
                  shadow="md"
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
                <Text fontSize={'sm'} mt="-2">
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
            <Stack spacing={10} mt="8">
              <HStack spacing="24px">
                <FormControl>
                  <FormLabel>
                    Name
                    <Input
                      value={state.name}
                      placeholder="Your Name"
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_NAME',
                          payload: e.target.value,
                        })
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
              </HStack>

              <FormControl>
                <FormLabel>
                  Your Bio
                  <Textarea
                    value={state.bio}
                    placeholder="Your bio"
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_BIO',
                        payload: e.target.value,
                      })
                    }
                  />
                </FormLabel>
              </FormControl>
            </Stack>
            <Button
              colorScheme="teal"
              type="submit"
              isLoading={state.loading}
              disabled={!state.usernameValid}
              mt="6"
            >
              Save Changes
            </Button>
          </form>
        </Box>
      </Grid>
    </ErrorBoundary>
  );
};
