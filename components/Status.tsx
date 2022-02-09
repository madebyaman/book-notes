import { ReactNode } from 'react';
import { StatusType } from '../utils/useStatus';

export default function Status({
  children,
  status,
  loading,
  error,
}: {
  children: ReactNode;
  status: StatusType;
  loading: ReactNode;
  error: ReactNode;
}): JSX.Element {
  if (status === 'LOADING') {
    return <>{loading}</>;
  } else if (status === 'ERROR') {
    return <>{error}</>;
  }
  return <>{children}</>;
}
