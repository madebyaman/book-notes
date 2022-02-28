import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '../firebase';
import { Signin, Signup } from '../@types/types';
import { useRouter } from 'next/router';

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
  const protectedRoutes = ['/', '/dashboard', '/edit/:id', '/add'];
  const authPages = ['/signin', '/signup'];

  // Redirect to login page if user is not signed in. Else,
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (
      auth.status === 'loaded' &&
      !auth.user &&
      protectedRoutes.includes(router.pathname)
    ) {
      timerId = setTimeout(() => {
        router.push('/signin');
      }, 3_000);
    }

    // Redirect to dashboard if user is signed in.
    if (
      auth.status === 'loaded' &&
      auth.user &&
      authPages.includes(router.pathname)
    ) {
      timerId = setTimeout(() => {
        router.push('/dashboard');
      }, 3_000);
    }

    return () => clearTimeout(timerId);
  }, [auth.status, auth.user, router]);

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

  // Hook to check if user is signed in
  useEffect(() => {
    setAuthStateStatus('loading');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthStateStatus('loaded');
    });
    return () => unsubscribe();
  }, []);

  /**
   * Signin function. Takes email and password and signs in the user.
   */
  const signIn: Signin = async ({ email, password, remember }) => {
    setPersistence(
      auth,
      remember ? browserLocalPersistence : browserSessionPersistence
    );
    await signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Signup function. It creates a new user.
   */
  const signUp: Signup = async ({ name, email, password }) => {
    setPersistence(auth, browserLocalPersistence);
    await createUserWithEmailAndPassword(auth, email, password);
    if (auth.currentUser) {
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
