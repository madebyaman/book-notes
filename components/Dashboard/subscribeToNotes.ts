import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { DashboardNote } from '../../@types';
import db from '../../firebase';

export const subscribeToNotes = (
  userId: string,
  cb: (notes: DashboardNote[]) => void
) => {
  const callback = (querySnap: QuerySnapshot<DocumentData>) => {
    const notes: DashboardNote[] = [];
    querySnap.forEach((doc: any) => {
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
