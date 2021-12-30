import React, { useContext } from 'react';
import { Service, BookOption, BookJSON } from '../types/JSONresponse';
import Select, { ActionMeta } from 'react-select';
import { NoteEditorContext } from './NoteEditor';

const BookSelect = () => {
  const [bookSearchString, setBookSearchString] = React.useState('');
  const [books, setBooks] = React.useState<Service<BookOption[]>>({
    status: 'init',
  });
  const { state, dispatch } = useContext(NoteEditorContext);

  React.useEffect(() => {
    const searchString = bookSearchString.replace(/ /g, '+');
    // Do not wait for 1s, but wait for 1s after input has finished entering
    const timer = setTimeout(() => {
      setBooks({ status: 'loading' });
      fetch(`http://openlibrary.org/search.json?q=${searchString}`)
        .then((data) => data.json())
        .then((data) => {
          const newBooks = data.docs
            .filter(
              (book: BookJSON) =>
                book.author_name &&
                book.author_name.length > 0 &&
                book.first_publish_year
            )
            .map((book: BookJSON) => {
              return {
                value: book.title_suggest.toLowerCase().replace(/ /g, '-'),
                label: book.title_suggest,
                cover: book.cover_i,
                author: book.author_name ? book.author_name[0] : null,
                id: book.key,
                year: book.first_publish_year,
              };
            });
          setBooks({ status: 'loaded', payload: newBooks });
        })
        .catch((e) => {
          const { dispatch } = useContext(NoteEditorContext);
          dispatch({ type: 'ERROR_FOUND', payload: e });
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, [bookSearchString]);

  const formatOptionLabel = ({ label, author, year }: BookOption) => {
    return (
      <div>
        <div>
          <strong>{label}</strong> by {author}, {year}
        </div>
      </div>
    );
  };

  const onInputChange = (inputValue: string) => {
    setBookSearchString(inputValue);
  };

  const handleSelectChange = (
    newVal: BookOption | null,
    actionMeta: ActionMeta<BookOption>
  ) => {
    if (actionMeta.action === 'select-option') {
      dispatch({ type: 'NEW_BOOK_SELECTED', payload: newVal });
    } else if (actionMeta.action === 'clear') {
      dispatch({ type: 'RESET_SELECTED_BOOK' });
    }
  };

  return (
    <div>
      <Select
        isLoading={books.status === 'loading' ? true : false}
        options={books.status === 'loaded' ? books.payload : []}
        isClearable
        instanceId="book-select"
        inputValue={bookSearchString}
        onInputChange={onInputChange}
        formatOptionLabel={formatOptionLabel}
        onChange={handleSelectChange}
        value={state.selectedBook}
        placeholder="Select Book"
        filterOption={null}
      />
    </div>
  );
};

export default BookSelect;
