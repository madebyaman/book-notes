import { Box, Grid } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const SidebarLayout = ({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) => {
  return (
    <Grid templateColumns={{ base: '1fr', md: '3fr 5fr' }}>
      <Box as="section" py="3" px="4">
        {sidebar}
      </Box>
      <Box as={'main'} bgColor="gray.100" minH="100vh" py="3" px="4">
        {children}
      </Box>
    </Grid>
  );
};
