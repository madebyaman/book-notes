import { uploadImage } from '..';

/**
 * Upload an image to cloudinary with the given coverId.
 * @param cover This is coverId of the book. It must be from OpenLibrary API
 */
export const uploadBookCover = async (cover: string) => {
  const fileURL = `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;
  const file = await uploadImage(fileURL);
  return file;
};
