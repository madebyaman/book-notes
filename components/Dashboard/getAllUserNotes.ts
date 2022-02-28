import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { BookNote } from '../../@types/booktypes';
import db from '../../firebase';

export const getAllUserNotes = async (
  userId: string,
  cb: (notes: BookNote[]) => void
) => {
  const callback = async (querySnap: QuerySnapshot<DocumentData>) => {
    const notes: BookNote[] = [];
    await querySnap.forEach((doc: any) => {
      notes.push({
        ...doc.data(),
        id: doc.id,
      });
    });

    cb(notes);
  };

  const collectionRef = collection(db, 'book-notes');
  const querySnap = query(collectionRef, where('userId', '==', userId));
  return onSnapshot(querySnap, callback);
};
