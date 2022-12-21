import { getUserProfileFromUsername } from '../auth';
import { totalNotesInOnePage } from './constants';
import { getTotalPages } from './getTotalPages';

export async function mapUsernameToPages(usernames: string[]) {
  const getPages = async (username: string) => {
    const userProfile = await getUserProfileFromUsername(username);

    if (!userProfile) return null;
    const pages = await getTotalPages({ userId: userProfile.id });
    return pages;
  };

  return await Promise.all(
    usernames.map(async (username) => {
      const pages = await getPages(username);
      return {
        username,
        page: pages,
      };
    })
  );
}
