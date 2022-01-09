import { useState } from 'react';

interface ServiceLoading {
  status: 'loading';
}
interface ServiceLoaded<T> {
  status: 'loaded';
  state: T;
}
interface ServiceError {
  status: 'error';
  error: unknown;
}

export type STATUSSTATE<T> = ServiceLoading | ServiceLoaded<T> | ServiceError;

export function useStatus<Type>() {
  const [useStatusState, setStatusState] = useState<STATUSSTATE<Type>>({
    status: 'loading',
  });

  return { useStatusState, setStatusState };
}
