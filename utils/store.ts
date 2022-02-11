import { QueryDocumentSnapshot } from '@firebase/firestore';
import {
  action,
  Action,
  createStore,
  createTypedHooks,
  Store,
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
  resetState: Action<StoreModel>;
  fetchDoc: Thunk<StoreModel, string>;
  fetchBook: Thunk<StoreModel, string>;
};

export const NoteEditorStore = createStore<StoreModel>(
  {
    selectedBook: null,
    content: '',
    rating: 0,
    title: '',
    excerpt: '',
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
    }),
    fetchDoc: thunk(async (actions, payload) => {
      const noteDocSnap = (await fetchDoc(
        `book-notes/${payload}`
      )) as QueryDocumentSnapshot<BookNote>;

      if (noteDocSnap.exists()) {
        const note = noteDocSnap.data();
        actions.updateContent(note.content);
        actions.updateExcerpt(note.excerpt || '');
        actions.updateRating(note.rating || 0);
        actions.updateTitle(note.title || '');
      }
    }),
    fetchBook: thunk(async (actions, payload) => {
      const bookDocSnap = (await fetchDoc(
        `books/${payload}`
      )) as QueryDocumentSnapshot<Book>;

      if (bookDocSnap.exists()) {
        const book = bookDocSnap.data();
        actions.updateSelectedBook(book);
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
