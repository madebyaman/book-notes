import {
  action,
  Action,
  createStore,
  createTypedHooks,
  thunk,
  Thunk,
} from 'easy-peasy';

import { Book, BookNoteState } from '../../@types';
import { getNote, getBook } from '../../utils/notes';

type StoreModel = BookNoteState & {
  updateContent: Action<StoreModel, string>;
  updateSlug: Action<StoreModel, string>;
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
    slug: '',
    isPublished: false,
    updateSlug: action((state, payload) => {
      state.slug = payload;
    }),
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
      state.slug = '';
    }),
    /**
     * Fetch a document with a url. It should update the note state if everything went well.
     */
    fetchDocument: thunk(async (actions, payload) => {
      const note = await getNote(payload.docId);
      if (note && payload.isSubscribed) {
        actions.updateContent(note.content);
        actions.updateRating(note.rating || 0);
        actions.updateTitle(note.title || '');
        actions.updateBookId(note.bookId || '');
        actions.updateIsPublished(note.isPublished || false);
        actions.updateSlug(note.slug);
      }
    }),
    /**
     * Gets a book with the given bookId. And updates `selectedBook` state.
     */
    fetchBook: thunk(async (actions, payload) => {
      const book = await getBook(payload.bookId);
      if (book && payload.isSubscribed) {
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
