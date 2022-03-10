import { Timestamp } from 'firebase/firestore';

export type SigninProps = {
  email: string;
  password: string;
  remember?: boolean;
};

export type Signin = ({ email, password }: SigninProps) => Promise<void>;

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  name: string;
  photo?: string;
  bio?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
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

type DefaultNote = {
  content: string;
  isPublished: boolean;
  rating: number;
  title: string;
  excerpt: string;
  slug: string;
  bookId?: string;
};

/**Book Note that we get from firestore */
export interface DashboardNote extends DefaultNote {
  id: string;
  lastUpdated: Timestamp;
  userId: string;
}

export type DashboardNoteWithDate = Omit<DashboardNote, 'lastUpdated'> & {
  lastUpdated: Date;
};

export interface DashboardNoteWithImage extends DashboardNoteWithDate {
  image?: string;
}

/** Book note that we are trying to save */
export type BookNote = DefaultNote & {
  userId: string;
  lastUpdated: Date;
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
