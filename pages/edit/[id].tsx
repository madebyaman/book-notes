import NoteEditor from '../../components/NoteEditor';
import { useAuth } from '../../utils/useAuth';
import { useRouter } from 'next/router';

const EditBook = () => {
  // What if id is invalid and doesn't match any book note?
  const router = useRouter();
  const id: string = router.query.id as string;
  const auth = useAuth();

  if (!auth.user) {
    return 'Loading ...';
  } else {
    return <NoteEditor docId={id} />;
  }
};

export default EditBook;
