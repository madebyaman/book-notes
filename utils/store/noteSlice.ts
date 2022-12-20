import { BookNoteState } from '@/@types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addBook,
  createOrUpdateNote,
  getBook,
  getNote,
  uploadBookCover,
} from '../notes';

const initialState: BookNoteState = {
  selectedBook: null,
  content: '',
  rating: 0,
  title: '',
  bookId: undefined,
  slug: '',
  isPublished: false,
};

const saveData = createAsyncThunk<void, { docId?: string; userId: string }>(
  'note/saveData',
  async ({ docId, userId }, thunkApi) => {
    console.log(';1');
    const state = thunkApi.getState() as { note: BookNoteState };
    console.log(';2');
    const paragraphs = state.note.content.split('</p>');
    const excerpt = paragraphs[0] + '</p>';
    console.log(';3');
    const newDate = new Date();
    console.log(excerpt);
    const { selectedBook, ...note } = state.note;
    const newDocument = {
      ...note,
      excerpt,
      lastUpdated: newDate,
      userId: userId,
    };
    console.log('New', newDocument);
    await createOrUpdateNote({ newDoc: newDocument, docId });
  }
);

const saveBook = createAsyncThunk('note/saveBook', async (args, thunkApi) => {
  const state = thunkApi.getState() as { note: BookNoteState };
  if (!state.note.selectedBook) return;
  const bookDocSnap = await getBook(state.note.selectedBook.key);
  // If no book found, create a new book
  if (!bookDocSnap) {
    // First upload the book cover if selectedBook.cover exists
    const coverURL = await uploadBookCover(state.note.selectedBook.cover);
    // The, get the URL of the uploaded image and set it to selectedBook.photoURL
    const newBook = {
      ...state.note.selectedBook,
      photoURL: coverURL || undefined,
    };

    try {
      await addBook(newBook);
    } catch (e) {
      return thunkApi.rejectWithValue('Error saving book');
    }
  }
});

const fetchDocument = createAsyncThunk(
  'note/fetchDocument',
  async ({ docId }: { docId: string }, thunkApi) => {
    return await getNote(docId);
  }
);

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
  extraReducers(builder) {
    builder.addCase(fetchDocument.fulfilled, (state, action) => {
      const note = action.payload;
      if (!note) return;
      state.content = note.content;
      state.rating = note.rating || 0;
      state.title = note.title || '';
      state.bookId = note.bookId || '';
      state.isPublished = note.isPublished;
      state.slug = note.slug;
    });
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
export { fetchDocument, saveBook, saveData };
