import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  onIdTokenChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  User,
  getAuth,
} from 'firebase/auth';
import { doc, DocumentSnapshot, getDoc, setDoc } from 'firebase/firestore';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import nookies from 'nookies';
import db, { auth, fb } from '../firebase';

type CustomUser = {
  uid: string;
  email: string;
  name?: string;
};

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
type Signin = ({ email, password }: SigninProps) => void;

const authContext = createContext<{
  user: User | CustomUser | null;
  signUp?: Signup;
  signIn?: Signin;
  handleSignout?: () => Promise<void>;
}>({ user: null });
const { Provider } = authContext;

export function AuthProvider(props: { children: ReactNode }): JSX.Element {
  const auth = useAuthProvider();
  return <Provider value={auth}>{props.children}</Provider>;
}

export const useAuth: any = () => {
  return useContext(authContext);
};

const useAuthProvider = () => {
  const [user, setUser] = useState<User | CustomUser | null>(null);

  const handleAuthStateChanged = (user: User) => {
    setUser(user);
    if (user) {
      getUserAdditionalData(user);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).nookies = nookies;
    }
    return onIdTokenChanged(auth, async (user) => {
      console.log(`token changed!`);
      if (!user) {
        console.log(`no token found...`);
        setUser(null);
        nookies.destroy(null, 'token');
        nookies.set(null, 'token', '', { path: '/' });
        return;
      }

      console.log(`updating token...`);
      const token = await user.getIdToken();
      setUser(user);
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

  const createUser = (user: CustomUser) => {
    return setDoc(doc(db, 'users', user.uid), user)
      .then(() => {
        // Verify your email message
        setUser(user);
        return user;
      })
      .catch((err) => {
        return err;
      });
  };

  const getUserAdditionalData = async (user: User) => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = (await getDoc(docRef)) as DocumentSnapshot<CustomUser>;

    if (docSnap.exists()) {
      setUser(docSnap.data());
    }
  };

  const signIn = ({ email, password }: SigninProps) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential.user) {
          setUser(userCredential.user);
          getUserAdditionalData(userCredential.user);
        }
      })
      .catch((err) => err);
  };

  const signUp = ({ name, email, password }: SignupProps) => {
    console.log('signin in', email);
    return createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        if (auth.currentUser) {
          sendEmailVerification(auth.currentUser);
        }
        return createUser({ uid: response.user.uid, email, name });
      })
      .catch((error) => {
        return { error };
      });
  };

  const handleSignout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return {
    user,
    signUp,
    signIn,
    handleSignout,
  };
};
