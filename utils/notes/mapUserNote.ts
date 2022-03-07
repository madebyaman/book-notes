import { DashboardNote, DashboardNoteWithImage } from '../../@types';
import { getBook } from './getBook';

/**
 * Adds image property to DashboardNote
 */
export const mapUserNote = async ({
  note,
}: {
  note: DashboardNote;
}): Promise<DashboardNoteWithImage | DashboardNote> => {
  if (!note.bookId) return note;
  const book = await getBook(note.bookId);
  const newNote: DashboardNoteWithImage = {
    ...note,
    image: book?.photoURL || null,
  };
  return newNote;
};
