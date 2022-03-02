import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { BookNote } from '../../@types/booktypes';
import db from '../../firebase';

export const createOrUpdateDocument = async (
  newDoc: BookNote,
  docId?: string
) => {
  if (docId) {
    await setDoc(doc(db, 'book-notes', docId), newDoc);
  } else {
    await addDoc(collection(db, 'book-notes'), newDoc);
  }
};
