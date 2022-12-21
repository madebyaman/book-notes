import { getUserProfileFromUsername } from '../auth';
import { totalNotesInOnePage } from './constants';
import { getTotalPages } from './getTotalPages';

export async function mapUsernameToPages(usernames: string[]) {
  const getPages = async (username: string) => {
    const userProfile = await getUserProfileFromUsername(username);

    if (!userProfile) return null;
    const pages = await getTotalPages({ userId: userProfile.id });
    return {
      params: {
        username,
        page: pages ? pages.toString() : '1',
      },
    };
  };

  const userNameWithPages = await Promise.all(
    usernames.map(async (username) => {
      return await getPages(username);
    })
  );

  return userNameWithPages;
}
