import { Link } from '@chakra-ui/react';
import { sendEmailVerification } from '@firebase/auth';
import { auth } from '@/firebase';

export const ResendVerificationEmail = ({ ...props }) => {
  return (
    <Link
      onClick={() =>
        auth.currentUser && sendEmailVerification(auth.currentUser)
      }
      {...props}
    >
      Send verification email
    </Link>
  );
};
