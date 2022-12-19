import { uploadImage } from '../../utils';

export const uploadProfilePicture = async (file?: File) => {
  if (!file) return;
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_PROFILE_PRESET) {
    throw new Error('Upload preset not found');
  }
  const fileUrl = await uploadImage(
    file,
    process.env.NEXT_PUBLIC_CLOUDINARY_PROFILE_PRESET
  );
  return fileUrl;
};
