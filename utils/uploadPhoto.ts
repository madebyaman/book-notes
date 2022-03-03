import { v4 as uuid } from 'uuid';
import { storage } from '../firebase';
import { ref, uploadBytes } from 'firebase/storage';

const prefix =
  'https://storage.googleapis.com/book-notes-app-9ea54.appspot.com/profilePictures';

export const uploadPhoto = async (
  file: File,
  folderName: 'profilePictures' | 'bookCovers'
) => {
  const fileExtension =
    file.type === 'image/png'
      ? '.png'
      : file.type === 'image/jpeg'
      ? '.jpg'
      : '';
  const filePath = folderName + '/' + uuid() + fileExtension;
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file);
  return prefix + filePath;
};
