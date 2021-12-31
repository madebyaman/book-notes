import { useContext, useState } from 'react';
import {} from 'firebase/auth'
const {auth} from "../firebase"

const useUserContextProvider = ({ children }) => {
  const [state, setState] = useState({
    status: 'idle',
    user: null,
    error: null,
  });
  const UserContext = useContext({});

  const contextValue = {};

  const registerUser = (email, name, password) => {};

  const signInUser = (email, password) => {};

  const logoutUser = () => {};

  const forgotPassword = (email) => {};

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default useUserContextProvider;
