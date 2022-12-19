import { Grid } from '@chakra-ui/react';

import { getUserProfileFromUsername } from '@/utils/auth';
import { getUsernames, getUserNotes } from '@/utils/notes';
import { DashboardNoteWithDate, UserProfile } from '@/@types';
import { SidebarLayout } from '@/components/Layout';
import { ProfileSidebar } from '@/components/Profile';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/Error';
import { BookCard } from '@/components/BookCard';
import Head from 'next/head';

interface UsernameNotesInterface {
  notes: DashboardNoteWithDate[];
  profile: UserProfile;
}

const UsernameNotes = ({ notes, profile }: UsernameNotesInterface) => {
  if (!profile) {
    return 'User profile not found';
  }

  if (!notes) {
    return 'No notes found for the user';
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Head>
        <title>Book notes by {profile.name}</title>
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
      </SidebarLayout>
    </ErrorBoundary>
  );
};

export async function getStaticPaths() {
  const usernames = await getUsernames();

  const paths = usernames.map((username) => ({
    params: {
      username,
    },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({
  params,
}: {
  params: { username: string };
}) {
  if (!params.username) return;
  const profile = await getUserProfileFromUsername(params.username);
  const userNotes = profile && (await getUserNotes({ userId: profile.id }));
  return {
    props: {
      notes: JSON.parse(JSON.stringify(userNotes)),
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
}

export default UsernameNotes;
