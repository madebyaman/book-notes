/**
 * Function to upload an image to cloudinary.
 */
export const uploadImage = async (file: File | string, preset?: string) => {
  const cloudinaryPreset = preset
    ? preset
    : process.env.NEXT_PUBLIC_COUDINARY_PRESET;
  if (!cloudinaryPreset) {
    throw new Error('No cloudinary preset defined in environment variable');
  }
  const formdata = new FormData();
  formdata.append('file', file);
  formdata.append('upload_preset', cloudinaryPreset);
  const data = await fetch(
    `https://api.cloudinary.com/v1_1/dksughwo7/image/upload`,
    {
      method: 'POST',
      body: formdata,
    }
  );
  const json = await data.json();
  return json.secure_url as string;
};
