import React from 'react';
import Creatable from 'react-select/creatable';
import db from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Service, Books, BookOption } from '../types/JSONresponse';
import { ActionMeta, OnChangeValue } from 'react-select';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback';
import AddNewBook from './AddNewBook';

const SelectBook = () => {
  const [selectedBook, setSelectedBook] = React.useState<BookOption | null>(
    null
  );
  const [books, setBooks] = React.useState<Service<Books>>({
    status: 'loading',
  });
  const [bookOptions, setBookOptions] = React.useState<BookOption[]>([]);
  const [input, setInput] = React.useState<string>('');
  const [createNewBook, setCreateNewBook] = React.useState(false);
  const inputRef = React.useRef(null);

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
    }
  }, [books]);

  const handleSelectChange = (
    newValue: OnChangeValue<BookOption, false>,
    actionMeta: ActionMeta<BookOption>
  ) => {
    // TODO Push selected option along with content when saved
    console.log(actionMeta.action);
    if (actionMeta.action === 'select-option') {
      setSelectedBook(newValue);
    } else if (actionMeta.action === 'create-option') {
      if (newValue?.value) {
        setInput(newValue.value);
      }
      setCreateNewBook(true);
      // Clear the select
      // https://thewebdev.info/2021/02/06/how-to-programmatically-clear-or-reset-a-react-select-dropdown/
      setSelectedBook(null);
    } else if (actionMeta.action === 'clear') {
      setSelectedBook(null);
    }
  };

  const resetError = () => {
    setBooks({ status: 'init' });
    setInput('');
    setSelectedBook(null);
  };

  const submitForm = ({ name, author }: { name: string; author: string }) => {
    console.log(name, author);
    // On submit, add that value into firebase and select it.
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={resetError}
      resetKeys={[input]}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {createNewBook && <AddNewBook input={input} submit={submitForm} />}
        <Creatable
          isClearable
          onChange={handleSelectChange}
          options={bookOptions}
          instanceId={'books'}
          className="book-select-container"
          classNamePrefix="book-select"
          defaultMenuIsOpen={true}
          value={selectedBook}
        />
      </div>
    </ErrorBoundary>
  );
};

export default SelectBook;
