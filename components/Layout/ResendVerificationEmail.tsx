import { Text, Link } from '@chakra-ui/react';
import { sendEmailVerification } from '@firebase/auth';
import { auth } from '@/firebase';
import { MouseEvent, useState } from 'react';

export const ResendVerificationEmail = ({ ...props }) => {
  const [status, setStatus] = useState<
    'INIT' | 'LOADING' | 'SUCCESS' | 'FAILED'
  >('INIT');

  async function sendEmail(e: MouseEvent) {
    e.preventDefault();
    setStatus('LOADING');
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setStatus('SUCCESS');
      } catch (error) {
        setStatus('FAILED');
      }
    }
  }

  if (status === 'SUCCESS') {
    return <Text>Email has been sent successfully</Text>;
  }

  if (status === 'FAILED') {
    return (
      <Text>
        Failed to send email.{' '}
        <Link onClick={sendEmail} {...props}>
          Try again
        </Link>
      </Text>
    );
  }

  return (
    <>
      {status === 'LOADING' ? (
        <Text>Sending Email</Text>
      ) : (
        <Link onClick={sendEmail} {...props}>
          Send verification email
        </Link>
      )}
    </>
  );
};
