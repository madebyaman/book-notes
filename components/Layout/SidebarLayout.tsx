import { Box, Container, Grid } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const SidebarLayout = ({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) => {
  return (
    <Grid templateColumns={{ base: '1fr', lg: '3fr 5fr' }}>
      <Box as="section" py="3" px="8">
        <Container maxW="container.lg">{sidebar}</Container>
      </Box>
      <Box as={'main'} bgColor="gray.100" minH="100vh" py="12" px="8">
        <Container maxW="container.lg">{children}</Container>
      </Box>
    </Grid>
  );
};
