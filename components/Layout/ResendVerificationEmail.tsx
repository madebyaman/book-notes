import { Text, Link, createStandaloneToast } from '@chakra-ui/react';
import { sendEmailVerification } from '@firebase/auth';
import { auth } from '@/firebase';
import { MouseEvent, useState } from 'react';

export const ResendVerificationEmail = ({ ...props }) => {
  const [status, setStatus] = useState<'INIT' | 'LOADING' | 'SUCCESS'>('INIT');
  const { toast } = createStandaloneToast();

  async function sendEmail(e: MouseEvent) {
    e.preventDefault();
    setStatus('LOADING');
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setStatus('SUCCESS');
        toast({
          title: '🍺 Email sent',
          description: 'Email has been sent. Check your inbox or spam folder.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: '⚠️ Unable to send email',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
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
