import { uploadImage } from '../../utils';

export const uploadProfilePicture = async (file?: File) => {
  if (!file) return;
  const fileUrl = await uploadImage(file);
  return fileUrl;
};
