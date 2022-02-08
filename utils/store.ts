import { action, Action, createStore, createTypedHooks } from 'easy-peasy';
import { BookOption } from '../@types/BookTypes';

interface StoreModel {
  selectedBook: BookOption | null;
  bookNote: string;
  rating: number | null;
  title: string | undefined;
  updateContent: Action<StoreModel, string>;
  updateSelectedBook: Action<StoreModel, BookOption>;
  updateRating: Action<StoreModel, number>;
  updateTitle: Action<StoreModel, string>;
}

export const NoteEditorStore = createStore<StoreModel>(
  {
    selectedBook: null,
    bookNote: '',
    rating: null,
    title: undefined,
    updateContent: action((state, payload) => {
      state.bookNote = payload;
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
  },
  {
    name: 'Note Editing Store',
  }
);

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
