import { getBook } from '.';
import { DashboardNote, DashboardNoteWithImage } from '../../@types';
import { mapAsync } from '../mapAsync';

export const mapUserNotes = async (notes: DashboardNote[]) => {
  const map = async (note: DashboardNote) => {
    if (!note.bookId) return note;
    const book = await getBook(note.bookId);
    const newNote: DashboardNoteWithImage = {
      ...note,
      image: book?.photoURL || null,
    };
    return newNote;
  };
  const mappedNotes = await mapAsync<DashboardNote>({ arr: notes, func: map });
  return mappedNotes;
};
