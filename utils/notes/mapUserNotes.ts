import { getBook } from '.';
import { DashboardNoteWithDate } from '../../@types';
import { mapAsync } from '../mapAsync';

export const mapUserNotes = async (notes: DashboardNoteWithDate[]) => {
  const map = async (note: DashboardNoteWithDate) => {
    if (!note.bookId) return note;
    const book = await getBook(note.bookId);
    const newNote = {
      ...note,
      image: book?.photoURL || null,
    };
    return newNote;
  };
  const mappedNotes = await mapAsync<DashboardNoteWithDate>({
    arr: notes,
    func: map,
  });
  return mappedNotes;
};
