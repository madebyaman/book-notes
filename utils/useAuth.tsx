import {
  browserLocalPersistence,
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
import { Signin, Signup, SignupProps } from '../types';

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
   * Signin function. Takes email and password and signs in the user. It also persists the user using local browser persistence.
   */
  const signIn: Signin = async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        setUser({ ...userCredential.user });
        return { type: 'SUCCESS' };
      }
    } catch (e) {
      return { type: 'FAILURE', message: 'Invalid email or password' };
    }
  };

  /**
   * Signup function. It creates a new user. It also persists the user using local browser persistence.
   */
  const signUp = async async ({ name, email, password }: SignupProps) => {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          if (auth.currentUser) {
            status = `SUCCESS`;
            await updateProfile(auth.currentUser, { displayName: name });
            setUser({
              ...auth.currentUser,
              displayName: auth.currentUser.displayName,
            });
          }
        } catch (e: any) {
          status = 'FAILURE';
          errorMessage = e.message;
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
