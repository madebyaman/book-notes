import { action, Action, createStore, createTypedHooks } from 'easy-peasy';
import { BookNoteState, Book } from '../@types/booktypes';

type StoreModel = BookNoteState & {
  updateContent: Action<StoreModel, string>;
  updateSelectedBook: Action<StoreModel, Book>;
  updateRating: Action<StoreModel, number>;
  updateTitle: Action<StoreModel, string>;
  updateExcerpt: Action<StoreModel, string>;
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
  },
  {
    name: 'Note Editing Store',
  }
);

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
