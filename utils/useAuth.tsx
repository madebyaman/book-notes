import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '../firebase';
import { Signin, Signup } from '../@types/types';
import fetcher from './fetcher';

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

  /**
   * Signin function. Takes email and password and signs in the user.
   */
  const signIn: Signin = async ({ email, password, remember = false }) => {
    try {
      const user = await fetcher<User>('/signin', {
        email,
        password,
        remember,
      });
      setUser(user);
    } catch (e) {
      throw e;
    }
  };

  /**
   * Signup function. It creates a new user.
   */
  const signUp: Signup = async ({ name, email, password }) => {
    try {
      const user = await fetcher<User>('/signup', {
        email,
        password,
        name,
      });
      setUser(user);
    } catch (e) {
      throw e;
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
