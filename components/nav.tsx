import { Box, Flex, Link as ChakraLink, Spacer, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useContext } from 'react';
import { signout } from '@/utils/auth';

import { AuthContext } from './Auth';
import { Logo } from './Logo';

type NavTypes = { showFullNav: true; route: string } | { showFullNav?: false };

export const Nav = (props: NavTypes) => {
  const user = useContext(AuthContext);

  return (
    <Box as="header" mt={4}>
      <Flex justify={'space-between'} alignItems="center" gap="8">
        <Link href="/">
          <Logo />
        </Link>
        <Spacer />

        {user && props.showFullNav && (
          <>
            <ChakraLink
              as={Link}
              href="/dashboard"
              fontSize={'md'}
              color={props.route === '/dashboard' ? 'primary.400' : 'gray.600'}
              display="flex"
              flexDir={'column'}
              alignItems={'center'}
              transition={'all 200ms ease-out'}
              _hover={{
                textDecoration: 'none',
                color: 'primary.400',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  width: '22px',
                  height: '22px',
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
              Dashboard
            </ChakraLink>
            <Link href="/profile" legacyBehavior passHref>
              <ChakraLink
                fontSize={'md'}
                color={props.route === '/profile' ? 'primary.400' : 'gray.600'}
                display="flex"
                flexDir={'column'}
                alignItems={'center'}
                transition={'all 200ms ease-out'}
                _hover={{
                  textDecoration: 'none',
                  color: 'primary.400',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    width: '22px',
                    height: '22px',
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Preferences
              </ChakraLink>
            </Link>
          </>
        )}
        <ChakraLink
          as={Link}
          href={user ? '#' : '/signin'}
          onClick={() => user && signout()}
          color="gray.600"
          display="flex"
          flexDir={'column'}
          alignItems={'center'}
          transition={'all 200ms ease-out'}
          _hover={{
            textDecoration: 'none',
            color: 'primary.400',
          }}
        >
          {user ? (
            <Box
              as={'svg'}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              style={{
                width: '22px',
                height: '22px',
              }}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </Box>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              style={{
                width: '22px',
                height: '22px',
              }}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          )}
          <Text fontSize="md">{user ? 'Sign out' : 'Sign in'}</Text>
        </ChakraLink>
      </Flex>
    </Box>
  );
};
