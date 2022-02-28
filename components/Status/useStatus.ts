import { useReducer } from 'react';

export type StatusType = 'LOADING' | 'LOADED' | 'ERROR';

type UseStatusState = {
  status: StatusType;
  error?: string;
};

const initialState: UseStatusState = {
  status: 'LOADING',
};

type UseStatusAction =
  | { type: 'LOADING' }
  | { type: 'LOADED' }
  | { type: 'ERROR'; payload: string };

function reducer(
  state: UseStatusState,
  action: UseStatusAction
): UseStatusState {
  switch (action.type) {
    case 'LOADING':
      return { ...state, status: 'LOADING' };
    case 'LOADED':
      return { ...state, status: 'LOADED' };
    case 'ERROR':
      return { ...state, status: 'ERROR', error: action.payload };
    default:
      return state;
  }
}

/**
 * UseStatus hook. It contains the state and dispatch function.State consists of status and error.
 */
export const useStatus = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};
