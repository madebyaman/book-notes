import db from '@/firebase';
import { collection, orderBy, query, where, getDocs } from 'firebase/firestore';

export async function getTotalNotes({
  userId,
}: {
  userId: string;
}): Promise<number | null> {
  const bookNotesCollectionRef = collection(db, 'book-notes');
  const q = query(
    bookNotesCollectionRef,
    where('userId', '==', userId),
    where('isPublished', '==', true),
    orderBy('lastUpdated', 'desc')
  );
  try {
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (e) {
    return null;
  }
}
