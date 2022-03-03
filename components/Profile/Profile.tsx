import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  Text,
} from '@chakra-ui/react';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { getCurrentUserInfo } from './getCurrentUserInfo';
import { updateCurrentUserInfo } from './updateCurrentUserInfo';
import { uploadProfilePicture } from './uploadProfilePicture';

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

export const Profile = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [profilePicture, setProfilePicture] = useState<File | undefined>();
  const toast = useToast();

  useEffect(() => {
    let isSubscribed = true;
    const updateName = async () => {
      if (isSubscribed) {
        const user = await getCurrentUserInfo();
        if (user) {
          dispatch({ type: 'UPDATE_NAME', payload: user.name });
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
    dispatch({ type: 'UPDATE_LOADING_STATE', payload: true });
    try {
      const profilePhoto = await uploadProfilePicture(profilePicture);
      await updateCurrentUserInfo({
        name: state.name,
        photo: profilePhoto || null,
      });
      toast({
        title: 'Successfully saved your profile',
        status: 'success',
        duration: 1_000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error saving your profile. Try again',
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
    <div>
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
    </div>
  );
};
