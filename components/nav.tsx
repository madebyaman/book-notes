import { Box, Flex, Link as ChakraLink } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { signout } from '../utils/auth';

import { AuthContext } from './Auth';

export const Nav = () => {
  const user = useContext(AuthContext);

  return (
    <header>
      <Flex mt="4" mb="6" justify={'space-between'} alignItems="center">
        <Image
          src="/logo.svg"
          alt="Bummaries App"
          width="169px"
          height="93px"
        />
        <Link href={user ? '#' : '/signin'} passHref>
          <ChakraLink
            onClick={() => signout()}
            fontSize={'md'}
            color="gray.600"
            borderBottom={'2px'}
            borderColor="transparent"
            transition={'all 200ms ease-out'}
            _hover={{
              textDecoration: 'none',
              borderColor: 'primary.700',
              color: 'primary.400',
            }}
          >
            {user ? 'Sign out' : 'Sign in'}
          </ChakraLink>
        </Link>
      </Flex>
    </header>
  );
};
