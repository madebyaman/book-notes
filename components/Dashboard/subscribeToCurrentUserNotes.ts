import { subscribeToNotes } from './subscribeToNotes';
import { getCurrentUser } from '../../utils/auth';
import { DashboardNote } from '../../@types';

export const subscribeToCurrentUserNotes = async (
  cb: (notes: DashboardNote[]) => void
) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return cb([]);
  return subscribeToNotes(currentUser.id, cb);
};
