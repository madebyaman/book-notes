import { ReactNode } from 'react';
import { StatusType } from './useStatus';

export const StatusWrapper = ({
  children,
  status,
  loading,
}: {
  children: ReactNode;
  status: StatusType;
  loading: ReactNode;
}): JSX.Element => {
  if (status === 'LOADING') {
    return <>{loading}</>;
  }
  return <>{children}</>;
};
