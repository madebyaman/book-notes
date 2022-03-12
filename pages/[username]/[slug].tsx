import { ArrowBackIcon, StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ImUser } from 'react-icons/im';

import { DashboardNoteWithImage, UserProfile } from '../../@types';
import { CenteredLayout } from '../../components/Layout';
import { Nav } from '../../components/nav';
import { getUserProfileFromUsername } from '../../utils/auth';
import { mapUserNote } from '../../utils/notes';
import { getNoteFromSlug } from '../../utils/notes/getNoteFromSlug';

const BookNote = ({
  note,
  profile,
}: {
  note: DashboardNoteWithImage | null;
  profile: UserProfile | null;
}) => {
  const router = useRouter();

  if (!note) {
    return (
      <CenteredLayout>
        Uh oh! Book note was not found. Try again.
      </CenteredLayout>
    );
  }

  if (!profile) {
    return <CenteredLayout>User not found.</CenteredLayout>;
  }

  return (
    <>
      <Container maxW="container.lg">
        <Head>
          <title>{note.title}</title>
        </Head>
        <Nav />
        <Box py="16">
          <Flex alignItems={'center'} justifyContent="center" gap="6">
            <Box>
              <Link passHref href={`/${profile.username}`}>
                <Button
                  leftIcon={<ArrowBackIcon />}
                  backgroundColor="gray.100"
                  _hover={{ backgroundColor: 'gray.200' }}
                  mb="4"
                  fontSize="sm"
                >
                  Book Notes
                </Button>
              </Link>
              {note.image && (
                <Image
                  src={note.image}
                  alt={note.title}
                  boxShadow="md"
                  maxH="200px"
                />
              )}
              <Box mt="4">
                {Array.from(Array(note.rating).keys()).map((num) => (
                  <StarIcon color="primary.400" key={num} />
                ))}
              </Box>
            </Box>
            <Box>
              <Text color="gray.400" fontSize="sm" fontWeight={'semibold'}>
                {moment(note.lastUpdated).format('LL')}
              </Text>
              <Heading as="h1" fontSize="54px" mt="2" mb="4">
                {note.title}
              </Heading>
              <Flex alignItems={'center'} gap="3">
                {profile.photo ? (
                  <Image
                    src={profile.photo}
                    alt={profile.name}
                    width="60px"
                    height="60px"
                    borderRadius="full"
                  />
                ) : (
                  <ImUser fontSize={'50px'} />
                )}
                <Flex flexDirection={'column'}>
                  <Text fontSize={'large'} fontWeight={'bold'}>
                    {profile.name}
                  </Text>
                  <Link href={`/${profile.username}`} passHref>
                    <ChakraLink
                      color="gray.400"
                      fontWeight={'semibold'}
                      fontSize={'sm'}
                    >
                      @{profile.username}
                    </ChakraLink>
                  </Link>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Container>
      <Box
        backgroundColor="light.100"
        width="container.lg"
        height="5px"
        m="0 auto"
      />
      <Container mt="16">
        <Box
          fontSize={'19px'}
          dangerouslySetInnerHTML={{ __html: note.content }}
        ></Box>
      </Container>
    </>
  );
};

export async function getServerSideProps(context: {
  params: { username: any; slug: any };
}) {
  // two things we will get {username: '', slug: ''}
  const { username, slug } = context.params;
  // 1. Check user profile with username exists.
  const profile = await getUserProfileFromUsername(username);
  // 2. Check if note with given slug exists.
  const note = profile && (await getNoteFromSlug({ slug, userId: profile.id }));
  const mappedNote = note ? await mapUserNote({ note }) : null;
  return {
    props: {
      note: JSON.parse(JSON.stringify(mappedNote)),
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
}

export default BookNote;
