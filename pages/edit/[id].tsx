import { NoteEditor } from '../../components/Editor';
import { useRouter } from 'next/router';

const EditBook = () => {
  // What if id is invalid and doesn't match any book note?
  const router = useRouter();
  const id: string = router.query.id as string;

  return <NoteEditor docId={id} />;
};

export default EditBook;
