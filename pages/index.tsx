import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = function () {
  return (
    <div>
      <Link href="/add-book">
        <a className="text-lg">Add a new book</a>
      </Link>
      <Link href={'/login'}>
        <a>Login</a>
      </Link>
    </div>
  );
};

export default Home;
