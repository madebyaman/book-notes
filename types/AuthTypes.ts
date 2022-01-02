import { User } from '@firebase/auth';
import { Dispatch, SetStateAction } from 'react';

export type AUTHSTATE = {
  status: 'idle' | 'pending' | 'resolved' | 'rejected';
  user: User | null;
  error: Error | null;
};

export type AUTH_SET_STATE = Dispatch<SetStateAction<AUTHSTATE>>;
