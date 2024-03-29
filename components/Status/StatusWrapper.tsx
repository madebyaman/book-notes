import { ReactNode } from 'react';
import { StatusType } from '../../utils/useStatus';

export const StatusWrapper = ({
  children,
  status,
  loading,
  error,
}: {
  children: ReactNode;
  status: StatusType;
  loading?: ReactNode;
  error?: ReactNode;
}): JSX.Element => {
  if (status === 'LOADING' && loading) {
    return <>{loading}</>;
  }
  if (status === 'ERROR' && error) {
    return <>{error}</>;
  }
  return <>{children}</>;
};
