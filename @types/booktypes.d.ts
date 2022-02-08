interface BooksInitialized {
  status: 'init';
}
interface BooksLoading {
  status: 'loading';
}
interface BooksLoaded<T> {
  status: 'loaded';
  payload: T;
}
interface BooksError {
  status: 'error';
  error: Error;
}
export type Service<T> =
  | BooksLoading
  | BooksInitialized
  | BooksLoaded<T>
  | BooksError;

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
