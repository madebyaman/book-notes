import { doc, getDoc } from 'firebase/firestore';
import db from '../../firebase';

export const getNote = async (noteId: string) => {
  const noteRef = doc(db, 'books', noteId);
  const noteSnap = await getDoc(noteRef);

  if (noteSnap.exists()) {
    return {
      ...noteSnap.data(),
      id: noteSnap.id,
    };
  } else {
    return;
  }
};
