import { useState } from 'react';
import { Input } from '@chakra-ui/react';

const ISBN = () => {
  const [bookISBN, setBookISBN] = useState('');

  return (
    <Input
      placeholder="Enter book ISBN"
      value={bookISBN}
      variant={'outline'}
      onChange={(e) => setBookISBN(e.target.value)}
      size="lg"
    />
  );
};

export default ISBN;
