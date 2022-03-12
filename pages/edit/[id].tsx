import { NoteEditor } from '../../components/Editor';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../components/Auth';
import Head from 'next/head';

const EditBook = () => {
  const router = useRouter();
  const id: string = router.query.id as string;
  const user = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    }
  }, [router, user]);

  return (
    <>
      <Head>
        <title>Edit book note</title>
      </Head>
      <NoteEditor docId={id} />
    </>
  );
};

export default EditBook;
