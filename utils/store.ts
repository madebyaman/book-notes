import { QueryDocumentSnapshot } from '@firebase/firestore';
import {
  action,
  Action,
  createStore,
  createTypedHooks,
  thunk,
  Thunk,
} from 'easy-peasy';
import { BookNoteState, Book, BookNote } from '../@types/booktypes';
import { fetchDoc } from './fetchDoc';

type StoreModel = BookNoteState & {
  updateContent: Action<StoreModel, string>;
  updateSelectedBook: Action<StoreModel, Book | null>;
  updateRating: Action<StoreModel, number>;
  updateTitle: Action<StoreModel, string>;
  updateExcerpt: Action<StoreModel, string>;
  updateBookId: Action<StoreModel, string>;
  updateIsPublished: Action<StoreModel, boolean>;
  resetState: Action<StoreModel>;
  fetchDocument: Thunk<StoreModel, string>;
  fetchBook: Thunk<StoreModel, string>;
};

export const NoteEditorStore = createStore<StoreModel>(
  {
    selectedBook: null,
    content: '',
    rating: 0,
    title: '',
    excerpt: '',
    bookId: undefined,
    isPublished: false,
    updateIsPublished: action((state, payload) => {
      state.isPublished = payload;
    }),
    updateBookId: action((state, payload) => {
      state.bookId = payload;
    }),
    updateContent: action((state, payload) => {
      state.content = payload;
    }),
    updateSelectedBook: action((state, payload) => {
      state.selectedBook = payload;
    }),
    updateRating: action((state, payload) => {
      state.rating = payload;
    }),
    updateTitle: action((state, payload) => {
      state.title = payload;
    }),
    updateExcerpt: action((state, payload) => {
      state.excerpt = payload;
    }),
    resetState: action((state) => {
      state.selectedBook = null;
      state.content = '';
      state.rating = 0;
      state.title = '';
      state.excerpt = '';
      state.bookId = undefined;
      state.isPublished = false;
    }),
    fetchDocument: thunk(async (actions, payload) => {
      const noteDocSnap = (await fetchDoc(
        `book-notes/${payload}`
      )) as QueryDocumentSnapshot<BookNote>;

      if (!noteDocSnap || !noteDocSnap.exists()) {
        throw new Error('Error fetching note');
      } else {
        const note = noteDocSnap.data();
        actions.updateContent(note.content);
        actions.updateExcerpt(note.excerpt || '');
        actions.updateRating(note.rating || 0);
        actions.updateTitle(note.title || '');
        actions.updateBookId(note.bookId || '');
        actions.updateIsPublished(note.published || false);
      }
    }),
    fetchBook: thunk(async (actions, payload) => {
      const bookDocSnap = (await fetchDoc(
        `books/${payload}`
      )) as QueryDocumentSnapshot<Book>;

      if (bookDocSnap && bookDocSnap.exists()) {
        const book = bookDocSnap.data();
        actions.updateSelectedBook(book);
      } else {
        throw new Error('Error fetching the book');
      }
    }),
  },
  {
    name: 'Note Editing Store',
  }
);

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
