import {
  updateIsPublished,
  useAppDispatch,
  useAppSelector,
} from '@/utils/store';
import { Checkbox, Text } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

const PublishSwitch = () => {
  const isPublished = useAppSelector((state) => state.note.isPublished);
  const dispatch = useAppDispatch();

  const handleChecked = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
    dispatch(updateIsPublished(e.target.checked));
  };

  return (
    <Checkbox
      isChecked={isPublished}
      onChange={handleChecked}
      colorScheme="teal"
      color="gray.500"
    >
      <Text fontSize="sm">Published</Text>
    </Checkbox>
  );
};

export default PublishSwitch;
