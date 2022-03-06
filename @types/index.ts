import { Timestamp } from 'firebase/firestore';

export type SignupProps = {
  name?: string;
  email: string;
  password: string;
};

export type SigninProps = {
  email: string;
  password: string;
  remember?: boolean;
};

export type Signup = ({ name, email, password }: SignupProps) => Promise<void>;

export type Signin = ({ email, password }: SigninProps) => Promise<void>;

export type UserProfile = {
  id: string;
  userId: string;
  email: string;
  name: string;
  photo: string;
};

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
  slug: string;
  bookId?: string;
  isPublished: boolean;
  rating: number;
  title: string;
  lastUpdated: Date | Timestamp;
  excerpt: string;
};

export type BookNote = DashboardNote & {
  content: string;
  userId: string;
};

export type BookNoteState = {
  selectedBook: Book | null;
  content: string;
  rating: number;
  title: string;
  bookId?: string;
  isPublished: boolean;
  slug: string;
};
