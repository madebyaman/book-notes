import { auth } from '@/firebase';
import { confirmPasswordReset } from 'firebase/auth';

export async function updateUserPassword(
  code: string,
  newPassword: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    confirmPasswordReset(auth, code, newPassword)
      .then(() => {
        resolve('Password reset');
      })
      .catch((e) => {
        let message = 'unable to reset password';
        if (e && typeof e === 'object' && 'message' in e) message = e.message;
        reject(message);
      });
  });
}
