import { Box, Flex } from '@chakra-ui/react';
import { JSXElementConstructor, ReactElement, ReactNode } from 'react';

interface props {}

export default function Tab({
  icon,
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  icon: ReactElement<any, string | JSXElementConstructor<any>>;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Flex
      onClick={onClick}
      as="button"
      flexDir={'column'}
      alignItems={'center'}
      backgroundColor={active ? 'white' : 'transparent'}
      p={4}
      borderRadius={'md'}
      mx={4}
    >
      <Box mb={2}>{icon}</Box>
      {children}
    </Flex>
  );
}
