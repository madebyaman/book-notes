import { FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { useStoreActions, useStoreState } from '../../utils/store';

const PublishSwitch = () => {
  const isPublished = useStoreState((state) => state.isPublished);
  const updateIsPublished = useStoreActions(
    (actions) => actions.updateIsPublished
  );

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = e.target;
    if (checked) {
      updateIsPublished(true);
    } else {
      updateIsPublished(false);
    }
  }

  return (
    <FormControl display="flex" alignItems="center" mt="6">
      <FormLabel htmlFor="publish-note" mb="0">
        Published
      </FormLabel>
      <Switch
        id="publish-note"
        value={isPublished ? 'true' : 'false'}
        colorScheme="teal"
        onChange={handleOnChange}
      />
    </FormControl>
  );
};

export default PublishSwitch;
