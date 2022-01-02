import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { AUTHSTATE, AUTH_SET_STATE } from '../types/AuthTypes';

const initialState: AUTHSTATE = {
  status: 'idle',
  user: null,
  error: null,
};

type UserContextTypes = {
  state: AUTHSTATE;
  setState: AUTH_SET_STATE;
};

export const UserContext = createContext<UserContextTypes>({
  state: initialState,
  setState: () => undefined,
});

export const useUserContext = () => {
  return useContext(UserContext);
};

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AUTHSTATE>(initialState);

  useEffect(() => {
    setState({ ...state, status: 'pending' });
    const unsubscribe = onAuthStateChanged(auth, (res) => {
      res
        ? setState({ user: res, status: 'resolved', error: null })
        : setState({ status: 'resolved', error: null, user: null });
    });

    return () => unsubscribe();
  }, []);

  const contextValue = {
    state,
    setState,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
