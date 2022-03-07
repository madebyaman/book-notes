import { doc, DocumentSnapshot, getDoc } from 'firebase/firestore';
import { Book } from '../../@types';
import db from '../../firebase';

export const getBook = async (bookId: string) => {
  const bookRef = doc(db, 'books', bookId);
  const bookSnap = (await getDoc(bookRef)) as DocumentSnapshot<Book>;

  if (bookSnap.exists()) {
    return {
      ...bookSnap.data(),
      id: bookSnap.id,
    };
  } else {
    return;
  }
};
