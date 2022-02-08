import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import Router, { useRouter } from 'next/router';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '../firebase';
import { Signin, Signup } from '../@types/types';

/**
 * Auth Context containing user, signup, signin, and signout methods
 */
const AuthContext = createContext<{
  status: 'loading' | 'loaded';
  user: User | null;
  signUp?: Signup;
  signIn?: Signin;
  handleSignout?: () => Promise<void>;
}>({ user: null, status: 'loaded' });
const { Provider } = AuthContext;

export function AuthProvider(props: { children: ReactNode }): JSX.Element {
  const auth = useAuthState();
  const router = useRouter();
  const protectedPages = ['/dashboard', '/add-book', '/edit-book'];

  useEffect(() => {
    if (
      auth.status === 'loaded' &&
      !auth.user &&
      protectedPages.includes(router.pathname)
    ) {
      console.log('redirecting');
      console.log(auth);

      router.push('/login');
    }
    // Todo what about login and signup pages. You should not show them if the user is logged in.
  }, [auth]);

  return <Provider value={auth}>{props.children}</Provider>;
}

/**
 * Hook to get the current user with signup, signing, signout methods
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Auth state function which returns the current user and signup, signing, signout methods
 */
const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authStateStatus, setAuthStateStatus] = useState<'loading' | 'loaded'>(
    'loaded'
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthStateStatus('loading');
      if (user) setUser(user);
      if (!user) setUser(null);
      setAuthStateStatus('loaded');
    });
    return () => unsub();
  }, []);

  /**
   * Signin function. Takes email and password and signs in the user.
   */
  const signIn: Signin = async ({ email, password }) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Signup function. It creates a new user.
   */
  const signUp: Signup = async ({ name, email, password }) => {
    await createUserWithEmailAndPassword(auth, email, password);
    if (auth.currentUser && name) {
      await updateProfile(auth.currentUser, { displayName: name });
    }
  };

  /**
   * Signout function. It signs out the user.
   */
  const handleSignout = async () => {
    await signOut(auth);
  };

  return {
    user,
    status: authStateStatus,
    signUp,
    signIn,
    handleSignout,
  };
};
