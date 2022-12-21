import { auth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export async function sendResetPasswordEmail(email: string) {
  return new Promise((resolve, reject) => {
    sendPasswordResetEmail(auth, email)
      .then(() => resolve('Sent successfully'))
      .catch((e) => {
        let message = 'unable to send email';
        if (e && typeof e === 'object' && 'message' in e) message = e.message;
        reject(message);
      });
  });
}
