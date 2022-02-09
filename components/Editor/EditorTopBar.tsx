import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaArchive } from 'react-icons/fa';

const EditorTopBar = ({
  onSave,
  isEditing = false,
}: {
  onSave: () => void;
  isEditing?: Boolean;
}) => {
  const router = useRouter();

  return (
    <Container maxW={'container.xl'}>
      <Flex color="white" align={'center'} justify={'space-between'}>
        <Box py="4" borderRight={'1px solid #e9ebf0'} pr="4">
          <IconButton
            aria-label="Go back"
            variant={'unstyled'}
            icon={<ArrowBackIcon color={'blackAlpha.700'} />}
            onClick={() => router.back()}
          />
        </Box>
        <Box py="4" color={'blackAlpha.900'}>
          <Heading as="h1" size="sm">
            {isEditing ? 'Add a New Book Note' : 'Edit Book Note'}
          </Heading>
        </Box>
        <Box py="4">
          <Stack direction={'row'} spacing={6}>
            <Button
              leftIcon={<FaArchive />}
              variant={'outline'}
              colorScheme={'teal'}
              onClick={onSave}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Flex>
    </Container>
  );
};

export default EditorTopBar;
