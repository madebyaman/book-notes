import { auth } from '@/firebase';
import { applyActionCode } from 'firebase/auth';

export function verifyEmail(actionCode: string) {
  return new Promise((resolve, reject) => {
    applyActionCode(auth, actionCode)
      .then(() => resolve(true))
      .catch((e) => {
        reject(e);
      });
  });
}
