import { SigninProps, SignupProps } from '../@types/types';

/**
 * Fetcher function wrapper
 */
export default function fetcher<T>(
  url: string,
  data: SigninProps | SignupProps | undefined = undefined
): Promise<T> {
  return fetch(`${window.location.origin}/api${url}`, {
    method: data ? 'POST' : 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  }).then((res) => {
    if (res.status > 199 && res.status < 300) return res.json() as unknown as T;
    return res.json().then((err) => {
      throw new Error(err.message);
    });
  });
}
