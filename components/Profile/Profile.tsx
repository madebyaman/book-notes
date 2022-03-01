import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useEffect, useReducer } from 'react';
import { getCurrentUserInfo } from './getCurrentUserInfo';
import { updateCurrentUserInfo } from './updateCurrentUserInfo';

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
  const toast = useToast();

  useEffect(() => {
    let done = false;
    let timer: NodeJS.Timeout;
    const updateName = async (attempt: number) => {
      const user = await getCurrentUserInfo();
      if (user) {
        done = true;
        dispatch({ type: 'UPDATE_NAME', payload: user.name });
      }
      timer = setTimeout(() => {
        if (done) return;
        else if (attempt < 3) updateName(attempt + 1);
        else return;
      }, 1_000);
    };
    updateName(1);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    dispatch({ type: 'UPDATE_LOADING_STATE', payload: true });
    e.preventDefault();
    if (!process.env.NEXT_PUBLIC_COUDINARY_UPLOAD_PRESET_PROFILE) {
      return;
    }

    const fileInput = Array.from(e.currentTarget.elements).find(
      ({ name }): boolean => {
        return name === 'uploadImage';
      }
    );

    let profile = {
      name: state.name,
    };
    if (fileInput && fileInput.files.length) {
      const formData = new FormData();
      const files = fileInput.files || [];
      for (const file of files) {
        formData.append('file', file);
        formData.append(
          'upload_preset',
          process.env.NEXT_PUBLIC_COUDINARY_UPLOAD_PRESET_PROFILE
        );
      }

      const data = await fetch(
        'https://api.cloudinary.com/v1_1/dksughwo7/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      ).then((res) => res.json());

      profile.photo = data.secure_url;
    }

    try {
      await updateCurrentUserInfo(profile);
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
          <FormControl>
            <FormLabel htmlFor="uploadImage">Upload Image</FormLabel>
            <Text fontSize={'sm'} my="2">
              Upload 150px * 150px photo for best results
            </Text>
            <input type="file" name="uploadImage" id="uploadImage" />
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
