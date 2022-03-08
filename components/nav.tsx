import { Image, Flex, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import { useContext } from 'react';
import { signout } from '../utils/auth';

import { AuthContext } from './Auth';

export const Nav = () => {
  const user = useContext(AuthContext);

  return (
    <header>
      <Flex mt="4" mb="6" justify={'space-between'} alignItems="center">
        <Link href="/" passHref>
          <Image
            cursor="pointer"
            src="/logo.svg"
            alt="Bummaries App"
            width="135px"
            height="74px"
          />
        </Link>
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
