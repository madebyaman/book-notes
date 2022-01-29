import {
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, DocumentSnapshot, getDoc, setDoc } from 'firebase/firestore';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
} from 'react';
import nookies from 'nookies';
import db, { auth } from '../firebase';
import { STATUSSTATE, useStatus } from './useStatus';
import { useRouter } from 'next/router';

interface CustomUser {
  uid: string;
  email: string;
  name: string;
}

type SignupProps = {
  name: string;
  email: string;
  password: string;
};

type SigninProps = {
  email: string;
  password: string;
};

type Signup = ({ name, email, password }: SignupProps) => Promise<any>;
type Signin = ({ email, password }: SigninProps) => Promise<void>;

type AUTHCONTEXT = {
  authState: STATUSSTATE<CustomUser | null>;
  signUp: Signup;
  signIn: Signin;
  handleSignout: () => Promise<void>;
};

const authContext = createContext({} as AUTHCONTEXT);
const { Provider } = authContext;

export function AuthProvider(props: { children: ReactNode }): JSX.Element {
  const auth = useAuthProvider();
  return <Provider value={auth}>{props.children}</Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

const useAuthProvider = () => {
  const authState = useStatus<CustomUser | null>();

  useEffect(() => {
    authState.setStatusState({ status: 'loading' });
    if (typeof window !== 'undefined') {
      (window as any).nookies = nookies;
    }
    return onIdTokenChanged(auth, async (user) => {
      console.log(`token changed!`);
      if (!user) {
        console.log(`no token found...`);
        authState.setStatusState({
          status: 'loaded',
          state: null,
        });
        nookies.destroy(null, 'token');
        nookies.set(null, 'token', '', { path: '/' });
        return;
      }

      console.log(`updating token...`);
      const token = await user.getIdToken();
      const docRef = doc(db, 'users', user.uid);
      const docSnap = (await getDoc(docRef)) as DocumentSnapshot<CustomUser>;
      if (docSnap.exists()) {
        authState.setStatusState({
          status: 'loaded',
          state: docSnap.data(),
        });
      }
      nookies.destroy(null, 'token');
      nookies.set(null, 'token', token, { path: '/' });
    });
  }, []);

  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  const createUser = async (user: CustomUser) => {
    try {
      await setDoc(doc(db, 'users', user.uid), user);
    } catch (err) {
      authState.setStatusState({
        status: 'error',
        error: err,
      });
    }
  };

  const signIn = async ({ email, password }: SigninProps) => {
    authState.setStatusState({ status: 'loading' });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      authState.setStatusState({
        status: 'error',
        error: err,
      });
    }
  };

  const signUp = async ({ name, email, password }: SignupProps) => {
    authState.setStatusState({ status: 'loading' });
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(response.user);
      return createUser({ uid: response.user.uid, email, name });
    } catch (err) {
      authState.setStatusState({
        status: 'error',
        error: err,
      });
    }
  };

  const handleSignout = async () => {
    authState.setStatusState({ status: 'loading' });
    await signOut(auth);
    authState.setStatusState({
      status: 'loaded',
      state: null,
    });
  };

  return {
    authState: authState.useStatusState,
    signUp,
    signIn,
    handleSignout,
  };
};
