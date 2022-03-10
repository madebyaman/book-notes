import { Grid } from '@chakra-ui/react';

import { getUserProfileFromUsername } from '../../utils/auth';
import { getUserNotes } from '../../utils/notes';
import { DashboardNoteWithDate, UserProfile } from '../../@types';
import { SidebarLayout } from '../../components/Layout';
import { ProfileSidebar } from '../../components/Profile';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../../components/Error';
import { BookCard } from '../../components/BookCard';

interface UsernameNotesInterface {
  notes: DashboardNoteWithDate[];
  profile: UserProfile;
}

const UsernameNotes = ({ notes, profile }: UsernameNotesInterface) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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

export async function getServerSideProps(context: {
  params: { username: string };
}) {
  const { username } = context.params;
  if (!username) return;
  const profile = await getUserProfileFromUsername(username);
  if (!profile) throw new Error('profile not found');
  const userNotes = await getUserNotes({ userId: profile.id });
  return {
    props: {
      notes: JSON.parse(JSON.stringify(userNotes)),
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
}

export default UsernameNotes;
