import { Box, Flex, Link as ChakraLink, Spacer, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useContext } from 'react';
import { signout } from '@/utils/auth';

import { AuthContext } from './Auth';
import { Logo } from './Logo';
import { useUserProfileHook } from '@/utils/profile';

type NavTypes = { showFullNav: true; route: string } | { showFullNav?: false };

export const Nav = (props: NavTypes) => {
  const user = useContext(AuthContext);
  const { profile, loading } = useUserProfileHook();

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
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{
                    width: '22px',
                    height: '22px',
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Preferences
              </ChakraLink>
            </Link>
            {profile && !loading && (
              <ChakraLink
                as={Link}
                href={`https://bummaries.app/${profile.username}`}
                fontSize={'md'}
                color={'gray.600'}
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
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  style={{
                    width: '22px',
                    height: '22px',
                  }}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </ChakraLink>
            )}
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
