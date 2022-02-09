import { Box, Flex } from '@chakra-ui/react';

const EditorLayout = () => {
  return (
    <>
      <Box
        pos={'fixed'}
        top="0"
        maxW={'960px'}
        margin="0 auto"
        left={'0'}
        right="0"
      >
        {/* Section for Top Bar */}
      </Box>
      <Flex maxW={'960px'} margin="0 auto" mt={'100px'}>
        <Box>
          <Box pos={'sticky'} top="93px">
            {/* Sticky bar for text */}
          </Box>
          {/* Content area */}
        </Box>
        <Box>
          <Box pos={'sticky'} top="100px">
            {/* Sidebar sticky area */}
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default EditorLayout;
