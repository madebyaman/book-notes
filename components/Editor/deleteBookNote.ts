import { deleteDoc, doc } from 'firebase/firestore';
import db from '../../firebase';

export const deleteBookNote = async (docId: string) => {
  await deleteDoc(doc(db, 'book-notes', docId));
};
