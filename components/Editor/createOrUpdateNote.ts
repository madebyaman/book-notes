import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { BookNote } from '../../@types/booktypes';
import db from '../../firebase';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type NewBookNote = Optional<BookNote, 'id'>;

export const createOrUpdateNote = async (
  newDoc: NewBookNote,
  docId?: string
) => {
  if (docId) {
    await setDoc(doc(db, 'book-notes', docId), newDoc);
  } else {
    await addDoc(collection(db, 'book-notes'), newDoc);
  }
};
