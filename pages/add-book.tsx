import type { NextPage } from 'next';
import { useContext, useEffect } from 'react';
import NoteEditor from '../components/NoteEditor';
import UserContextProvider, { UserContext } from '../components/UserContext';
import { useRouter } from 'next/router';

const AddBook: NextPage = () => {
  const { state } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!state.user) {
      router.push('/login');
    }
  }, []);

  return (
    <UserContextProvider>
      <NoteEditor />
    </UserContextProvider>
  );
};

export default AddBook;
