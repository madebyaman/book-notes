import type { NextPage } from 'next';
import Head from 'next/head';
import { NoteEditor } from '@/components/Editor';

const AddBook: NextPage = () => {
  return (
    <>
      <Head>
        <title>Add book note</title>
      </Head>
      <NoteEditor />
    </>
  );
};

export default AddBook;
