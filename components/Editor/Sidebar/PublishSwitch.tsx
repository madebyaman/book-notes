import { Checkbox, Text } from '@chakra-ui/react';
import { useStoreActions, useStoreState } from '@/utils/store';
import { ChangeEvent } from 'react';

const PublishSwitch = () => {
  const isPublished = useStoreState((state) => state.isPublished);
  const updateIsPublished = useStoreActions(
    (actions) => actions.updateIsPublished
  );

  const handleChecked = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
    updateIsPublished(e.target.checked);
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
