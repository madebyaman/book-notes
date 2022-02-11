import { doc, getDoc } from 'firebase/firestore';
import { FC, ReactNode, useEffect, useState } from 'react';
import db from '../firebase';
import useStatus from '../utils/useStatus';
import { Image, useMenuButton } from '@chakra-ui/react';
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
    setFetchingBookCoverStatus({ type: 'LOADING' });
    let isSubscribed = true;
    if (bookID) {
      // Fetch a document from the book collection with bookID
      const docRef = doc(db, `books/${bookID}`);
      getDoc(docRef)
        .then((docsnap) => {
          if (docsnap.exists()) {
            const data = docsnap.data();
            if (data && data.cover && isSubscribed)
              setBookCoverURL(data.photoURL);
            if (data && data.title && isSubscribed) setBookName(data.title);
          }
        })
        .catch((e) => {
          setFetchingBookCoverStatus({
            type: 'ERROR',
            payload: 'Error fetching book cover',
          });
        });
    }
    setFetchingBookCoverStatus({ type: 'LOADED' });

    return () => (isSubscribed = false);
  }, [bookID]);

  return (
    <Status
      status={fetchingBookCoverStatus.status}
      loading={<div>Loading...</div>}
      error={<div>{fetchingBookCoverStatus.error}</div>}
    >
      {bookID && bookCoverURL ? (
        <Image
          src={bookCoverURL}
          alt={bookName}
          width={'120px'}
          boxShadow="md"
          transform={'translateZ(-15deg)'}
        />
      ) : (
        <DefaultBookCover />
      )}
    </Status>
  );
};

export default BookCover;
