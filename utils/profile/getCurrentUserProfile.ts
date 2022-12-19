import { getUserProfile, getCurrentUser } from '../auth';

export const getCurrentUserProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return await getUserProfile(user.id);
};
