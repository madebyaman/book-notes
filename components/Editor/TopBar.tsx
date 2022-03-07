import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaSave } from 'react-icons/fa';

const Topbar = ({
  onSave,
  isEditing = false,
  loading,
}: {
  onSave: () => void;
  loading: boolean;
  isEditing?: boolean;
}) => {
  const router = useRouter();

  return (
    <Flex
      color="white"
      align={'center'}
      justify={'space-between'}
      borderBottom={'1px solid #e9ebf0'}
      backgroundColor={'white'}
    >
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
      <Box py="4" borderLeft={'1px solid #e9ebf0'} pl={4}>
        <Button
          leftIcon={<FaSave />}
          borderRadius="md"
          colorScheme={'teal'}
          onClick={onSave}
          isLoading={loading}
        >
          Save
        </Button>
      </Box>
    </Flex>
  );
};

export default Topbar;
