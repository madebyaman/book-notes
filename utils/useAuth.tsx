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
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
} from 'react';
import { auth } from '../firebase';
import { Signin, SigninProps, Signup, SignupProps } from '../types';

/**
 * Auth Context containing user, signup, signin, and signout methods
 */
const AuthContext = createContext<{
  user: User | null;
  signUp?: Signup;
  signIn?: Signin;
  handleSignout?: () => Promise<void>;
}>({ user: null });
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

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      if (!user) setUser(null);
    });
  });

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
      } else {
        return { type: 'FAILURE', message: 'Invalid email or password' };
      }
    } catch (e) {
      return { type: 'FAILURE', message: 'User not found' };
    }
  };

  /**
   * Signup function. It creates a new user. It also persists the user using local browser persistence.
   */
  const signUp = ({ name, email, password }: SignupProps) => {
    let status: 'SUCCESS' | 'FAILURE' | 'LOADING' = 'LOADING';
    let errorMessage: string = '';
    setPersistence(auth, browserLocalPersistence)
      .then(async () => {
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
      })
      .catch((e) => {
        status = 'FAILURE';
        errorMessage = e.message;
      });
    return { status, errorMessage };
  };

  /**
   * Signout function. It signs out the user.
   */
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
