import { Button, Grid, Stack } from '@chakra-ui/react';

import { getUserProfileFromUsername } from '@/utils/auth';
import { getTotalPages, getUsernames, getUserNotes } from '@/utils/notes';
import { DashboardNoteWithDate, UserProfile } from '@/@types';
import { SidebarLayout } from '@/components/Layout';
import { ProfileSidebar } from '@/components/Profile';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/Error';
import { BookCard } from '@/components/BookCard';
import Head from 'next/head';
import { mapUsernameToPages } from '@/utils/notes/mapUsernameToPages';

interface UsernameNotesInterface {
  notes: DashboardNoteWithDate[];
  profile: UserProfile;
  pages: number;
}

const UsernameNotes = ({ notes, profile, pages }: UsernameNotesInterface) => {
  if (!profile) {
    return 'User profile not found';
  }

  if (!notes) {
    return 'No notes found for the user';
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Head>
        <title>Book notes</title>
      </Head>
      <SidebarLayout sidebar={<ProfileSidebar profile={profile} />}>
        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={10}>
          {notes.map((note) => (
            <BookCard
              card={note}
              key={note.id}
              isProfileCard={true}
              username={profile.username}
            />
          ))}
        </Grid>
        <Stack direction={'row'} spacing={4} align="center">
          <Button colorScheme="teal" variant="solid">
            Page 1
          </Button>
        </Stack>
      </SidebarLayout>
    </ErrorBoundary>
  );
};

export async function getStaticPaths() {
  const usernames = await getUsernames();
  const usernameWithPages = await mapUsernameToPages(usernames);

  const paths = usernames.map((username) => {
    return {
      params: usernameWithPages,
    };
  });

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({
  params,
}: {
  params: { username: string; page: string };
}) {
  const numberedPage = Number(params.page);
  if (!params.username || Number.isNaN(numberedPage)) return;
  const profile = await getUserProfileFromUsername(params.username);
  let userNotes = null;
  let pages = null;
  if (profile) {
    await Promise.all([
      getUserNotes({ userId: profile.id, page: numberedPage }),
      getTotalPages({ userId: profile.id }),
    ]).then((values) => {
      if (values[0]) {
        userNotes = values[0];
      }
      if (values[1]) {
        pages = values[1];
      }
    });
  }
  return {
    props: {
      notes: JSON.parse(JSON.stringify(userNotes)),
      profile: JSON.parse(JSON.stringify(profile)),
      pages: pages ? Number(pages) : null,
    },
  };
}

export default UsernameNotes;
