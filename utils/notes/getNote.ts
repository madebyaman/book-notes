import { doc, DocumentSnapshot, getDoc } from 'firebase/firestore';
import { BookNote } from '../../@types';
import db from '../../firebase';

export const getNote = async (noteId: string) => {
  const noteRef = doc(db, 'book-notes', noteId);
  const noteSnap = (await getDoc(noteRef)) as DocumentSnapshot<BookNote>;

  if (noteSnap.exists()) {
    return {
      ...noteSnap.data(),
      id: noteSnap.id,
    };
  } else {
    return;
  }
};
