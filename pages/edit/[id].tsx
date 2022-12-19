import { NoteEditor } from '@/components/Editor';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/components/Auth';
import Head from 'next/head';
import { CenteredLayout } from '@/components/Layout';
import { CircularProgress } from '@chakra-ui/react';

const EditBook = () => {
  const router = useRouter();
  const id: string = router.query.id as string;
  const user = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        router.push('/signin');
      }, 2_000);

      return () => clearTimeout(timer);
    }
  }, [router, user]);

  if (!user) {
    <CenteredLayout>
      <CircularProgress isIndeterminate color="teal.300" />
    </CenteredLayout>;
  }

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
