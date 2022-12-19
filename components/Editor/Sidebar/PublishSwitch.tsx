import { Checkbox, Text } from '@chakra-ui/react';
import { useStoreActions, useStoreState } from '@/utils/store';

const PublishSwitch = () => {
  const isPublished = useStoreState((state) => state.isPublished);
  const updateIsPublished = useStoreActions(
    (actions) => actions.updateIsPublished
  );

  return (
    <Checkbox
      isChecked={isPublished}
      onChange={(e) => updateIsPublished(e.target.checked)}
      colorScheme="teal"
      color="gray.500"
    >
      <Text fontSize="sm">Published</Text>
    </Checkbox>
  );
};

export default PublishSwitch;
