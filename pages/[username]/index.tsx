import { Grid } from '@chakra-ui/react';

import { getUserProfileFromUsername } from '@/utils/auth';
import { getTotalNotes, getUsernames, getUserNotes } from '@/utils/notes';
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
  totalNotes: number;
}

const UsernameNotes = ({
  notes,
  profile,
  totalNotes,
}: UsernameNotesInterface) => {
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

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({
  params,
}: {
  params: { username: string };
}) {
  if (!params.username) return { props: null };
  const profile = await getUserProfileFromUsername(params.username);
  let userNotes = null;
  let totalNotes = null;
  if (profile) {
    userNotes = await getUserNotes({ userId: profile.id });
    totalNotes = getTotalNotes({ userId: profile.id });
  }
  return {
    props: {
      notes: JSON.parse(JSON.stringify(userNotes)),
      profile: JSON.parse(JSON.stringify(profile)),
      totalNotes: totalNotes ? Number(totalNotes) : null,
    },
  };
}

export default UsernameNotes;
