import { doc, getDoc } from 'firebase/firestore';
import db from '../firebase';

/**
 * Function to fetch a document with a url. It should return a document snapshot if everything went well.
 * @param url The url of document to be fetched.
 * Are we even using it?
 */
export const fetchDoc = async (url: string) => {
  const docRef = doc(db, url);
  const docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists()) {
    return docSnapshot;
  }
};
