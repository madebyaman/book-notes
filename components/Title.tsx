import { useState } from 'react';
import { Input } from '@chakra-ui/react';

const Title = () => {
  const [bookTitle, setBookTitle] = useState('');

  return (
    <Input
      placeholder="Enter title"
      value={bookTitle}
      variant={'outline'}
      onChange={(e) => setBookTitle(e.target.value)}
      size="lg"
    />
  );
};

export default Title;
