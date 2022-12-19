import { doc, setDoc } from 'firebase/firestore';
import { Book } from '../../@types';
import db from '../../firebase';

export const addBook = async (newBook: Book) => {
  await setDoc(doc(db, 'books', newBook.key), newBook);
};
