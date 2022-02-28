import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import db from '../../firebase';
import { useStatus } from '../Status';
import { Image } from '@chakra-ui/react';
import { StatusWrapper } from '../Status';

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

    return () => {
      isSubscribed = false;
    };
  }, [bookID]);

  return (
    <StatusWrapper
      status={fetchingBookCoverStatus.status}
      loading={
        <div>
          <DefaultBookCover />
        </div>
      }
      error={
        <div>
          <DefaultBookCover />
        </div>
      }
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
    </StatusWrapper>
  );
};

export default BookCover;
