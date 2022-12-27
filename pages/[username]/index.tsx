import { Button, Grid, Stack } from '@chakra-ui/react';

import { DashboardNoteWithDate, UserProfile } from '@/@types';
import { BookCard } from '@/components/BookCard';
import { ErrorFallback } from '@/components/Error';
import { SidebarLayout } from '@/components/Layout';
import { ProfileSidebar } from '@/components/Profile';
import { getUserProfileFromUsername } from '@/utils/auth';
import { getTotalPages, getUsernames, getUserNotes } from '@/utils/notes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ErrorBoundary } from 'react-error-boundary';
import Link from 'next/link';

interface UsernameNotesInterface {
  notes: DashboardNoteWithDate[];
  profile: UserProfile;
  pages: number;
}

const UsernameNotes = ({ notes, profile, pages }: UsernameNotesInterface) => {
  const router = useRouter();
  const { username } = router.query;
  if (typeof username !== 'string') return 'User not found';
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
        {pages > 1 && (
          <Stack
            direction={'row'}
            spacing={4}
            mt={8}
            textAlign="center"
            align="center"
          >
            <Button
              disabled={true}
              as={Link}
              colorScheme="teal"
              variant="solid"
              href={'#'}
            >
              1
            </Button>
            {Array.from(Array(pages - 1).keys()).map((page) => (
              <Button
                as={Link}
                colorScheme="teal"
                variant={'outline'}
                key={page}
                href={`/${username}/page/${page + 2}`}
              >
                {page + 2}
              </Button>
            ))}
          </Stack>
        )}
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
  let pages = null;
  if (profile) {
    userNotes = await getUserNotes({ userId: profile.id });
    pages = await getTotalPages({ userId: profile.id });
  }
  return {
    props: {
      notes: JSON.parse(JSON.stringify(userNotes)),
      profile: JSON.parse(JSON.stringify(profile)),
      pages: pages ? Number(pages) : null,
    },
    revalidate: 10,
  };
}

export default UsernameNotes;
