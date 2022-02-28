import { auth } from '../../firebase';

export const getCurrentUser = () => {
  const user = auth.currentUser;

  if (!user) return null;
  return { id: user.uid };
};
