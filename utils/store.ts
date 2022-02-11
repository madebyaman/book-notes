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
  updateBookId: Action<StoreModel, string>;
  updateIsPublished: Action<StoreModel, boolean>;
  resetState: Action<StoreModel>;
  fetchDocument: Thunk<StoreModel, { docId: string; isSubscribed: boolean }>;
  fetchBook: Thunk<StoreModel, { bookId: string; isSubscribed: boolean }>;
};

export const NoteEditorStore = createStore<StoreModel>(
  {
    selectedBook: null,
    content: '',
    rating: 0,
    title: '',
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
    resetState: action((state) => {
      state.selectedBook = null;
      state.content = '';
      state.rating = 0;
      state.title = '';
      state.bookId = undefined;
      state.isPublished = false;
    }),
    /**
     * Fetch a document with a url. It should update the note state if everything went well.
     */
    fetchDocument: thunk(async (actions, payload) => {
      const noteDocSnap = (await fetchDoc(
        `book-notes/${payload.docId}`
      )) as QueryDocumentSnapshot<BookNote>;

      if (!noteDocSnap || !noteDocSnap.exists()) {
        throw new Error('Error fetching note');
      } else if (payload.isSubscribed) {
        const note = noteDocSnap.data();
        actions.updateContent(note.content);
        actions.updateRating(note.rating || 0);
        actions.updateTitle(note.title || '');
        actions.updateBookId(note.bookId || '');
        actions.updateIsPublished(note.isPublished || false);
      }
    }),
    /**
     * Gets a book with the given bookId. And updates `selectedBook` state.
     */
    fetchBook: thunk(async (actions, payload) => {
      const bookDocSnap = (await fetchDoc(
        `books/${payload.bookId}`
      )) as QueryDocumentSnapshot<Book>;

      if (bookDocSnap && bookDocSnap.exists()) {
        const book = bookDocSnap.data();
        if (payload.isSubscribed) actions.updateSelectedBook(book);
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
