import { getBook } from '.';
import { BookNote } from '../../@types/booktypes';
import { mapAsync } from '../mapAsync';

export const mapUserNotes = async (notes: BookNote[]) => {
  const map = async (note: BookNote) => {
    if (!note.bookId) return note;
    const book = await getBook(note.bookId);
    return {
      ...note,
      image: book?.photoURL || null,
    };
  };
  const mappedNotes = await mapAsync<BookNote>({ arr: notes, func: map });
  return mappedNotes;
};
