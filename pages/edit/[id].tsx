import { NoteEditor } from '../../components/Editor';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../components/Auth';

const EditBook = () => {
  const router = useRouter();
  const id: string = router.query.id as string;
  const user = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    }
  }, []);

  return <NoteEditor docId={id} />;
};

export default EditBook;
