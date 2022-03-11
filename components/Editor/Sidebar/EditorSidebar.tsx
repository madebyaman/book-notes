import {
  Text,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  FormLabel,
  Heading,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

import { useStoreActions, useStoreState } from '../store';
import Ratings from './Ratings';
import PublishSwitch from './PublishSwitch';
import { checkNoteSlugExists } from '../../../utils/notes';
import { useContext, useState } from 'react';
import { AuthContext } from '../../Auth';
import SelectedBook from './SelectedBook';

export const EditorSidebar = ({ docId }: { docId?: string }) => {
  const user = useContext(AuthContext);
  const slug = useStoreState((state) => state.slug);
  const updateSlug = useStoreActions((state) => state.updateSlug);
  const [slugValid, setSlugValid] = useState(true);
  const onBlurSlug = async () => {
    if (user && (await checkNoteSlugExists({ slug, userId: user.id, docId }))) {
      setSlugValid(false);
    } else {
      setSlugValid(true);
    }
  };

  return (
    <Flex
      pl="8"
      mt="20"
      flexDir={'column'}
      zIndex={'10'}
      height={'calc(100vh - 80px)'}
      gap="8"
    >
      <Flex
        textAlign="left"
        py="3"
        px="3"
        backgroundColor={'white'}
        flexDir="column"
        justify="space-between"
        style={{
          borderRadius: '6px 6px 0 0',
        }}
        shadow="sm"
      >
        <Heading
          fontSize={'medium'}
          pb="2"
          mb="4"
          borderBottom={'1px'}
          borderColor="gray.100"
          fontWeight="semibold"
          as="h3"
          color="gray.500"
        >
          Note settings:
        </Heading>
        <FormLabel mb="6">
          <Text fontSize={'sm'} color="gray.500">
            Slug:
          </Text>
          <InputGroup>
            <Input
              value={slug}
              onChange={(e) => updateSlug(e.target.value)}
              placeholder={'Slug'}
              onBlur={onBlurSlug}
            />
            <InputRightElement>
              {slugValid ? (
                <CheckCircleIcon color="green.500" />
              ) : (
                <WarningIcon color="red.500" />
              )}
            </InputRightElement>
          </InputGroup>
        </FormLabel>
        <Text fontSize={'sm'} color="gray.500" mb="2">
          Rating:
        </Text>
        <Ratings />
        <PublishSwitch />
      </Flex>
      <Flex
        textAlign="left"
        py="3"
        px="3"
        backgroundColor={'white'}
        flexDir="column"
        justify="space-between"
        style={{
          borderRadius: '6px 6px 0 0',
        }}
        shadow="sm"
      >
        <Heading
          fontSize={'medium'}
          pb="2"
          mb="4"
          borderBottom={'1px'}
          borderColor="gray.100"
          fontWeight="semibold"
          as="h3"
          color="gray.500"
        >
          Select book
        </Heading>
        <SelectedBook />
      </Flex>
    </Flex>
  );
};
