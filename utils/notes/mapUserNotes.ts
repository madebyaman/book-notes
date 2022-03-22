import { getBook } from '.';
import { DashboardNoteWithDate, DashboardNoteWithImage } from '../../@types';

export const mapUserNotes = async (notes: DashboardNoteWithDate[]) => {
  const map = async (
    note: DashboardNoteWithDate
  ): Promise<DashboardNoteWithImage> => {
    if (!note.bookId) return note;
    const book = await getBook(note.bookId);
    const newNote = {
      ...note,
      image: book?.photoURL || undefined,
    };
    return newNote;
  };

  const mappedNotes = await Promise.all(notes.map(async (note) => map(note)));

  return mappedNotes;
};
