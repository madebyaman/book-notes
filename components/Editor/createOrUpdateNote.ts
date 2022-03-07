import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { BookNote } from '../../@types';
import db from '../../firebase';
import { checkNoteSlugExists } from '../../utils/notes';

export const createOrUpdateNote = async (newDoc: BookNote, docId?: string) => {
  // First, check if slug is valid
  if (await checkNoteSlugExists({ slug: newDoc.slug, userId: newDoc.userId }))
    throw new Error('Provided slug exists');

  if (docId) {
    await setDoc(doc(db, 'book-notes', docId), newDoc);
  } else {
    await addDoc(collection(db, 'book-notes'), newDoc);
  }
};
