import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Image,
  Tag,
} from '@chakra-ui/react';
import moment from 'moment';
import { ImUser } from 'react-icons/im';
import Link from 'next/link';

import { getUserProfileFromUsername } from '../../utils/auth';
import { getUserNotes, mapUserNotes } from '../../utils/notes';
import { DashboardNoteWithImage, UserProfile } from '../../@types';
import { BookCardLayout } from '../../components/Dashboard/BookCardLayout';

interface UsernameNotesInterface {
  notes: DashboardNoteWithImage[];
  profile: UserProfile;
}

const UsernameNotes = ({ notes, profile }: UsernameNotesInterface) => {
  return (
    <>
      <Box bgColor="gray.50" py="10">
        <Container maxW="container.lg">
          {profile.photo ? (
            <Image
              src={profile.photo}
              width="100px"
              height="100px"
              rounded={'full'}
            />
          ) : (
            <ImUser fontSize={'50px'} />
          )}
          <Heading as="h1" fontSize={'54px'}>
            {profile.name}'s Book Notes
          </Heading>
          <hr
            style={{
              marginTop: '20px',
              height: '5px',
              width: '200px',
              border: 'none',
              backgroundColor: '#CBD5E0',
            }}
          />
        </Container>
      </Box>
      <Container maxW="container.lg">
        <Grid
          templateColumns="repeat(auto-fit, minmax(400px, 1fr))"
          gap={6}
          mt="10"
        >
          {notes.map((note) => (
            <BookCardLayout bookId={note.bookId}>
              <Link href={`/${profile.username}/${note.slug}`}>
                <Heading
                  as="h2"
                  fontSize="30px"
                  fontWeight={'medium'}
                  cursor={'pointer'}
                  _hover={{
                    color: 'teal.500',
                  }}
                >
                  {note.title}
                </Heading>
              </Link>
              <Tag
                rounded={'none'}
                my="3"
                variant="subtle"
                fontSize={'12px'}
                fontWeight="normal"
              >
                {moment(note.lastUpdated).format('LL')}
              </Tag>
              <Text
                color="gray.600"
                fontSize={'17px'}
                dangerouslySetInnerHTML={{ __html: note.excerpt }}
              />
            </BookCardLayout>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export async function getServerSideProps(context: {
  params: { username: string };
}) {
  const { username } = context.params;
  if (!username) return;
  const profile = await getUserProfileFromUsername(username);
  if (!profile) throw new Error('profile not found');
  const userNotes = await getUserNotes({ userId: profile.id });
  const notes = await mapUserNotes(userNotes);
  return {
    props: {
      notes: JSON.parse(JSON.stringify(notes)),
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
}

export default UsernameNotes;
