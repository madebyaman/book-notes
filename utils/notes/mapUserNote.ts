import { DashboardNoteWithDate, DashboardNoteWithImage } from '../../@types';
import { getBook } from './getBook';

/**
 * Adds image property to DashboardNote
 */
export const mapUserNote = async ({
  note,
}: {
  note: DashboardNoteWithDate;
}): Promise<DashboardNoteWithImage | DashboardNoteWithDate> => {
  if (!note.bookId) return note;
  const book = await getBook(note.bookId);
  const newNote = {
    ...note,
    image: book?.photoURL || null,
  };
  return newNote;
};
