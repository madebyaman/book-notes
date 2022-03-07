import { StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';
import { DashboardNoteWithImage, UserProfile } from '../../@types';
import { CenteredLayout } from '../../components/Layout';
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
  if (!note) {
    return (
      <CenteredLayout>404! Book note was not found. Try again.</CenteredLayout>
    );
  }

  if (!profile) {
    return <CenteredLayout>404! User not found.</CenteredLayout>;
  }

  return (
    <>
      <Box bgColor="gray.50" py="10">
        <Container maxW="container.lg">
          <Flex alignItems={'center'} justifyContent="center">
            <Image src={note.image} alt={note.title} boxShadow="md" />
            <Box ml="6">
              <Flex alignItems={'center'}>
                <Image
                  src={profile.photo}
                  alt={profile.name}
                  width="40px"
                  height={'40px'}
                  borderRadius="full"
                />
                <Text
                  color="gray.400"
                  fontWeight={'bold'}
                  fontSize="14px"
                  fontStyle={'italic'}
                >
                  Book Note by{' '}
                  <Text color="gray.600" fontStyle={'normal'} display="inline">
                    <Link href={`/${profile.username}`} passHref>
                      <ChakraLink>{profile.name}</ChakraLink>
                    </Link>
                  </Text>{' '}
                  on{' '}
                  <Text
                    display={'inline'}
                    color="gray.600"
                    fontStyle={'normal'}
                  >
                    {moment(note.lastUpdated).format('LL')}
                  </Text>
                </Text>
              </Flex>
              <Heading as="h1" fontSize={'54px'} my="4">
                {note.title}
              </Heading>
              {Array.from(Array(note.rating).keys()).map((num) => (
                <StarIcon color="gray.500" key={num} />
              ))}
            </Box>
          </Flex>
        </Container>
      </Box>
      <Container mt="6">
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
