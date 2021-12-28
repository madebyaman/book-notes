import { useState } from 'react';

const Title = () => {
  const [bookTitle, setBookTitle] = useState('');

  return (
    <input value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} />
  );
};

export default Title;
