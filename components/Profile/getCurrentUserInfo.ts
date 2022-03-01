import { getCurrentUser } from '../../utils/auth';
import { getUserInfo } from './getUserInfo';

export const getCurrentUserInfo = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return await getUserInfo(user.id);
};
