interface ServiceInit {
  status: 'init';
}
interface ServiceLoading {
  status: 'loading';
}
interface ServiceLoaded<T> {
  status: 'loaded';
  payload: T;
}
interface ServiceError {
  status: 'error';
  error: Error;
}
export type Service<T> =
  | ServiceInit
  | ServiceLoading
  | ServiceLoaded<T>
  | ServiceError;

export type Book = {
  title?: string;
  author?: string;
  id: string;
  cover?: string;
};

export type Books = Book[];

export interface BookOption {
  value: string;
  label: string;
  cover?: string;
  id: string;
  author?: string;
  year?: number;
}

export type BookJSON = {
  title_suggest: string;
  cover_i: string;
  key: string;
  first_publish_year?: number;
  author_name?: string[];
};
