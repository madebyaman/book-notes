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
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { useStoreActions, useStoreState } from '@/utils/store';
import Ratings from './Ratings';
import PublishSwitch from './PublishSwitch';
import { checkNoteSlugExists } from '@/utils/notes';
import { AuthContext } from '../../Auth';
import SelectedBook from './SelectedBook';

export const EditorSidebar = ({ docId }: { docId?: string }) => {
  const user = useContext(AuthContext);
  const slug = useStoreState((state) => state.slug);
  const updateSlug = useStoreActions((state) => state.updateSlug);
  const [slugError, setSlugError] = useState('');

  useEffect(() => {
    let isSubscribed = true;
    const timer = setTimeout(async () => {
      if (slug && user) {
        if (await checkNoteSlugExists({ slug, userId: user.id, docId })) {
          isSubscribed && setSlugError('Slug already exists.');
        } else {
          isSubscribed && setSlugError('');
        }
      }
    }, 1_000);

    return () => {
      clearTimeout(timer);
      isSubscribed = false;
    };
  }, [docId, slug, user]);

  const onChangeSlug = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.includes(' ')) {
      setSlugError('Spaces are not allowed');
      return;
    } else setSlugError('');
    updateSlug(e.target.value);
  };

  return (
    <Flex
      mt={{ base: '4', md: '20' }}
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
            <Input value={slug} onChange={onChangeSlug} placeholder={'Slug'} />
            <InputRightElement>
              {slug &&
                (!Boolean(slugError) ? (
                  <CheckCircleIcon color="green.500" />
                ) : (
                  <WarningIcon color="red.500" />
                ))}
            </InputRightElement>
          </InputGroup>
          {slugError && (
            <Text mt="2" fontSize={'sm'} d="block" color="red.500">
              {slugError}
            </Text>
          )}
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
