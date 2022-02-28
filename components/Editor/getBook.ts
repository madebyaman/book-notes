import { doc, getDoc } from 'firebase/firestore';
import db from '../../firebase';

export const getBook = async (bookId: string) => {
  const bookRef = doc(db, 'books', bookId);
  const bookSnap = await getDoc(bookRef);

  if (bookSnap.exists()) {
    return {
      ...bookSnap.data(),
      id: bookSnap.id,
    };
  } else {
    return;
  }
};
