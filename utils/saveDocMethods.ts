import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import db from '../firebase';

/**
 * Upload an image to cloudinary with the given coverId.
 * @param cover This is coverId of the book. It must be from OpenLibrary API
 */
export const uploadImageFromCoverID = async (
  cover: string
): Promise<string | undefined> => {
  const cloudinaryCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (cloudinaryCloud) {
    const fileURL = `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;
    const formdata = new FormData();
    formdata.append('file', fileURL);
    formdata.append('upload_preset', 'book-covers');
    const data = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloud}/upload`,
      {
        method: 'POST',
        body: formdata,
      }
    ).then((res) => res.json());
    return data.secure_url as string;
  }
  return;
};

/**
 * Creates a new document. Id will be autogenerated if no docId provided.
 * @param collectionName This is the name of the collection in firestore.
 * @param newDoc This is the new document to be saved.
 * @param id string If this id is provided then a new doc with the given id will be created. Else a new doc will be created with an autogenerated id.
 */
export const createDocument = async (
  collectionName: string,
  newDoc: any,
  id?: string
) => {
  if (id) {
    await setDoc(doc(db, collectionName, id), newDoc);
  } else {
    await addDoc(collection(db, collectionName), newDoc);
  }
};

/**
 * If `!docId` then creates a new document. Or else updates it.
 * @param collectionName This is the name of the collection in firestore.
 * @param newDoc This is the new document to be saved.
 * @param docId This is the id of the document.
 */
export const createOrUpdateDocument = async (
  collectionName: string,
  newDoc: any,
  docId?: string | undefined
) => {
  if (!docId) {
    await createDocument(collectionName, newDoc);
  } else {
    const documentRef = doc(db, collectionName, docId);
    await updateDoc(documentRef, newDoc);
  }
};
