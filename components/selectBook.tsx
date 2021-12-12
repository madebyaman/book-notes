import React from 'react';
import Creatable from 'react-select/creatable';
import db from '../firebase';
import {
  collection,
  query,
  where,
  startAt,
  endAt,
  getDocs,
  onSnapshot,
  doc,
} from 'firebase/firestore';
import { Service, Books, BookOption } from '../types/JSONresponse';
import { ActionMeta, OnChangeValue } from 'react-select';

const SelectBook = () => {
  const [selectedBook, setSelectedBook] = React.useState('');
  const [books, setBooks] = React.useState<Service<Books>>({
    status: 'loading',
  });

  const [bookOptions, setBookOptions] = React.useState<BookOption[]>([]);

  React.useEffect(() => {
    setBooks({
      status: 'loading',
    });
    const unsub = onSnapshot(
      collection(db, 'books'),
      (snapshot) => {
        const books: Books = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setBooks({
          status: 'loaded',
          payload: books,
        });
      },
      (error) => {
        setBooks({
          status: 'error',
          error,
        });
      }
    );

    return () => unsub();
  }, [setBooks]);

  React.useEffect(() => {
    if (books.status === 'loaded') {
      const newBookOptions = books.payload.map(({ title, author }) => {
        if (title) {
          const value = title.toLowerCase().replace(/ /g, '-');
          let label = title;

          if (title && author) {
            label = `${title} by ${author}`;
          }

          return { label, value };
        } else {
          return { label: '', value: '' };
        }
      });
      setBookOptions(newBookOptions);
      console.log(bookOptions);
    }
  }, [books]);

  const loadOptions = async (input: string) => {
    // 1. Move newBooks into state.
    // 2. Status should be bound to AsyncSelect.
    // 3. Create Error Boundary
    // 4. Resolve https://stackoverflow.com/questions/61290173/react-select-how-do-i-resolve-warning-prop-id-did-not-match
    // 5. Remove .then statements into async await
    // 6. Create styles for React Select
    // 7. Input should be able to handle multiwords.
    // Hook into firebase
  };

  const handleSelectChange = (
    newValue: OnChangeValue<BookOption, false>,
    actionMeta: ActionMeta<BookOption>
  ) => {
    // TODO Set selected option value
    // TODO Create selected option and push it to firebase
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* DONE Change style of options */}
      {/* TODO Paginate */}
      <Creatable
        isClearable
        onChange={handleSelectChange}
        options={bookOptions}
        instanceId={'books'}
        className="book-select-container"
        classNamePrefix="book-select"
        defaultMenuIsOpen={true}
      />
    </div>
  );
};

export default SelectBook;
