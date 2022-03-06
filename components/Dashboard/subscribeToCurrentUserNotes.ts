import { subscribeToNotes } from './subscribeToNotes';
import { getCurrentUser } from '../../utils/auth';
import { BookNote } from '../../@types';

export const subscribeToCurrentUserNotes = async (
  cb: (notes: BookNote[]) => void
) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return cb([]);
  return subscribeToNotes(currentUser.id, cb);
};
