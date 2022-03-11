import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaSave } from 'react-icons/fa';

export const EditorTopbar = ({
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
          leftIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width: '21px',
                height: '21px',
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
          }
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
