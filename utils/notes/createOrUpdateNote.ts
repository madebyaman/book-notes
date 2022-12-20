import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { BookNote } from '../../@types';
import db from '../../firebase';
import { checkNoteSlugExists } from '../../utils/notes';

export class SlugError extends Error {}
export class RatingError extends Error {}

export const createOrUpdateNote = async ({
  newDoc,
  docId,
}: {
  newDoc: BookNote;
  docId?: string;
}) => {
  console.log('Doc', newDoc);
  // First, check if slug is valid
  if (
    newDoc.slug &&
    (await checkNoteSlugExists({
      slug: newDoc.slug,
      userId: newDoc.userId,
      docId,
    }))
  )
    throw new SlugError('Provided slug exists');

  if (newDoc.isPublished && !Boolean(newDoc.rating))
    throw new RatingError('Rating not found');

  if (docId) {
    await setDoc(doc(db, 'book-notes', docId), newDoc);
  } else {
    await addDoc(collection(db, 'book-notes'), newDoc);
  }
};
