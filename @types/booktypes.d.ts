export type Book = {
  key: string;
  title: string;
  photoURL?: string;
  cover: string;
  author: string;
  year: number;
};

export type Books = Book[];

export type BookJSON = {
  title_suggest: string;
  cover_i: string;
  key: string;
  first_publish_year?: number;
  author_name?: string[];
};

export type DashboardNote = {
  id: string;
  bookId?: string;
  published: boolean;
  rating: number;
  title: string;
  excerpt?: string;
};

export type BookNote = DashboardNote & {
  content: string;
};

export type BookNoteState = {
  selectedBook: Book | null;
  content: string;
  rating: number;
  title: string;
  excerpt: string;
  bookId?: string;
  isPublished: boolean;
};
