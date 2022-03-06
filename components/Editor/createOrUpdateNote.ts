import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { BookNote } from '../../@types';
import db from '../../firebase';
import { checkNoteSlugExists } from './Sidebar/checkNoteSlugExists';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type NewDocNote = PartialBy<BookNote, 'id'>;

export const createOrUpdateNote = async (
  newDoc: NewDocNote,
  docId?: string
) => {
  // First, check if slug is valid
  if (await checkNoteSlugExists({ slug: newDoc.slug, userId: newDoc.userId }))
    throw new Error('Provided slug exists');

  if (docId) {
    await setDoc(doc(db, 'book-notes', docId), newDoc);
  } else {
    await addDoc(collection(db, 'book-notes'), newDoc);
  }
};
