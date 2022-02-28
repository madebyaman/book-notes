import { subscribeToNotes } from './subscribeToNotes';
import { getCurrentUser } from '../../utils/auth';
import { BookNote } from '../../@types/booktypes';

export const subscribeToCurrentUserNotes = (
  cb: (notes: BookNote[]) => void
) => {
  const currentUser = getCurrentUser();

  if (!currentUser) return cb([]);
  return subscribeToNotes(currentUser.id, cb);
};
