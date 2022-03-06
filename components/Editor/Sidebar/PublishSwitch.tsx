import { Checkbox } from '@chakra-ui/react';
import { useStoreActions, useStoreState } from '../store';

const PublishSwitch = () => {
  const isPublished = useStoreState((state) => state.isPublished);
  const updateIsPublished = useStoreActions(
    (actions) => actions.updateIsPublished
  );

  return (
    <Checkbox
      my="4"
      isChecked={isPublished}
      onChange={(e) => updateIsPublished(e.target.checked)}
      colorScheme="teal"
    >
      Published
    </Checkbox>
  );
};

export default PublishSwitch;
