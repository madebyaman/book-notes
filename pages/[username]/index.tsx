import { Grid, Heading, Text, Tag, Button } from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';

import { getUserProfileFromUsername } from '../../utils/auth';
import { getUserNotes, mapUserNotes } from '../../utils/notes';
import { DashboardNoteWithImage, UserProfile } from '../../@types';
import { BookCardLayout } from '../../components/Dashboard/BookCardLayout';
import { SidebarLayout } from '../../components/Layout';
import { ProfileSidebar } from '../../components/Profile';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../../components/Error';

interface UsernameNotesInterface {
  notes: DashboardNoteWithImage[];
  profile: UserProfile;
}

const UsernameNotes = ({ notes, profile }: UsernameNotesInterface) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SidebarLayout sidebar={<ProfileSidebar profile={profile} />}>
        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={10}>
          {notes.map((note) => (
            <BookCardLayout bookId={note.bookId} key={note.id}>
              <Tag
                rounded={'none'}
                mb="2"
                variant="subtle"
                fontSize={'12px'}
                fontWeight="normal"
              >
                {moment(note.lastUpdated).format('LL')}
              </Tag>
              <Heading
                as="h2"
                fontSize="30px"
                fontWeight={'medium'}
                color="text.400"
                mb="6"
              >
                {note.title}
              </Heading>
              <Text
                color="gray.600"
                fontSize={'17px'}
                dangerouslySetInnerHTML={{ __html: note.excerpt }}
              />
              <Link href={`/${profile.username}/${note.slug}`} passHref>
                <Button
                  mt="4"
                  width={'100%'}
                  _hover={{
                    backgroundColor: 'primary.700',
                    color: 'white',
                  }}
                >
                  Continue Reading
                </Button>
              </Link>
            </BookCardLayout>
          ))}
        </Grid>
      </SidebarLayout>
    </ErrorBoundary>
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
