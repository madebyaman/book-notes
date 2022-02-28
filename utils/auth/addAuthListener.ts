import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebase';

export const addAuthListener = (
  callback: (user: { id: string } | null) => void
) => {
  // Intermediate wrapper callback for callback. This is so we only send the relevant information that callback needs.
  const onChange = (user: User | null) => {
    if (user) {
      callback({ id: user.uid });
    } else {
      callback(null);
    }
  };

  // It will return unsubscribe function. It will also call `onChange` which will call `callback` with the relevant information.
  return onAuthStateChanged(auth, onChange);
};
