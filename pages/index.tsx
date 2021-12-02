import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div>
      <Link href="/add-book">
        <a>Add a new book</a>
      </Link>
    </div>
  );
};

export default Home;
