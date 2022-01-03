import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, DocumentSnapshot, getDoc, setDoc } from 'firebase/firestore';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import db, { auth } from '../firebase';

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
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        handleAuthStateChanged(user);
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  const createUser = (user: CustomUser) => {
    return setDoc(doc(db, 'users', user.uid), user)
      .then(() => {
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
