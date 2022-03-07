import { DashboardNoteWithImage } from '../../@types';
import { getUserProfileFromUsername } from '../../utils/auth';
import { mapUserNote } from '../../utils/notes';
import { getNoteFromSlug } from '../../utils/notes/getNoteFromSlug';

const BookNote = ({
  note,
  profile,
}: {
  note: DashboardNoteWithImage;
  profile: any;
}) => {
  console.log('note', note);
  console.log('profile', profile);
  return 'Hello';
};

export async function getServerSideProps(context: {
  params: { username: any; slug: any };
}) {
  // two things we will get {username: '', slug: ''}
  const { username, slug } = context.params;
  // 1. Check user profile with username exists.
  const profile = await getUserProfileFromUsername(username);
  // 2. Check if note with given slug exists.
  const note = await getNoteFromSlug({ slug, userId: profile.id });
  const mappedNote = await mapUserNote({ note });
  return {
    props: {
      mappedNote,
      profile,
    },
  };
}

export default BookNote;
