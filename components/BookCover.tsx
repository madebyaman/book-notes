import { doc, getDoc } from 'firebase/firestore';
import { FC, ReactNode, useEffect, useState } from 'react';
import db from '../firebase';
import useStatus from '../utils/useStatus';
import { Image } from '@chakra-ui/react';
import Status from './Status';

const DefaultBookCover = () => (
  <Image src="./Book.png" alt="Book Cover" width={'150px'} />
);

const BookCover = ({ bookID }: { bookID: string | undefined }) => {
  const [bookCoverURL, setBookCoverURL] = useState<string | null>(null);
  const [bookName, setBookName] = useState<string>('book');
  const {
    state: fetchingBookCoverStatus,
    dispatch: setFetchingBookCoverStatus,
  } = useStatus();

  // Get the book cover URL from the book ID
  useEffect(() => {
    if (bookID) {
      setFetchingBookCoverStatus({ type: 'LOADING' });
      // Fetch a document from the book collection with bookID
      const docRef = doc(db, `books/${bookID}`);
      getDoc(docRef)
        .then((docsnap) => {
          if (docsnap.exists()) {
            const data = docsnap.data();
            if (data && data.cover) setBookCoverURL(data.photoURL);
            if (data && data.title) setBookName(data.title);
          }
        })
        .catch((e) => {
          setFetchingBookCoverStatus({
            type: 'ERROR',
            payload: 'Error fetching book cover',
          });
        });
      setFetchingBookCoverStatus({ type: 'LOADED' });
    }
  }, [bookID]);

  return (
    <Status
      status={fetchingBookCoverStatus.status}
      loading={<div>Loading...</div>}
      error={<div>{fetchingBookCoverStatus.error}</div>}
    >
      {bookID && bookCoverURL ? (
        <Image src={bookCoverURL} alt={bookName} width={'150px'} />
      ) : (
        <DefaultBookCover />
      )}
    </Status>
  );
};

export default BookCover;
