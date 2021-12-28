import { useState } from 'react';
import { Input } from '@chakra-ui/react';

const Title = () => {
  const [bookTitle, setBookTitle] = useState('');

  return (
    <Input
      placeholder="Enter title"
      value={bookTitle}
      variant={'filled'}
      colorScheme={'teal'}
      onChange={(e) => setBookTitle(e.target.value)}
    />
  );
};

export default Title;
