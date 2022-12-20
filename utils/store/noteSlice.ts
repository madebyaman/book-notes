import { BookNoteState } from '@/@types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: BookNoteState = {
  selectedBook: null,
  content: '',
  rating: 0,
  title: '',
  bookId: undefined,
  slug: '',
  isPublished: false,
};
export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    updateSlug: (state, action) => {
      state.slug = action.payload;
    },
    updateIsPublished: (state, action) => {
      state.isPublished = action.payload;
    },
    updateContent: (state, action) => {
      state.content = action.payload;
    },
    updateRating: (state, action) => {
      state.rating = action.payload;
    },
    updateTitle: (state, action) => {
      state.title = action.payload;
    },
    updateSelectedBook: (state, action) => {
      state.selectedBook = action.payload;
    },
    updateBookId: (state, action) => {
      state.bookId = action.payload;
    },
    resetState: (state) => {
      state.selectedBook = null;
      state.rating = 0;
      state.title = '';
      state.bookId = undefined;
      state.isPublished = false;
      state.slug = '';
      state.content = '';
    },
  },
});

export const {
  updateSlug,
  updateBookId,
  updateContent,
  updateIsPublished,
  updateRating,
  updateSelectedBook,
  updateTitle,
  resetState,
} = noteSlice.actions;

export default noteSlice.reducer;
