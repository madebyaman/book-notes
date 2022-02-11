import React, { useEffect, useState } from 'react';
import { Book, BookJSON } from '../@types/booktypes';
import Select from 'react-select';
import { useStoreActions, useStoreState } from '../utils/store';
import useStatus from '../utils/useStatus';

/**
 * Convert space inside a string to +
 */
function convertToPlus(str: string) {
  return str.replace(/ /g, '+');
}

/**
 * Convert / in a string to +
 */
function convertSlashToPlus(str: string) {
  return str.replace(/\//g, '+');
}

const BookSelect = () => {
  const [bookSearchString, setBookSearchString] = React.useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const selectedBook = useStoreState((state) => state.selectedBook);
  const setSelectedBook = useStoreActions((state) => state.updateSelectedBook);
  const updateBookId = useStoreActions((state) => state.updateBookId);
  const { state, dispatch } = useStatus();

  useEffect(() => {
    // Do not wait for 1s, but wait for 1s after input has finished entering
    const timer = setTimeout(() => {
      dispatch({ type: 'LOADING' });
      fetch(
        `http://openlibrary.org/search.json?q=${convertToPlus(
          bookSearchString
        )}`
      )
        .then((data) => data.json())
        .then((data) => {
          const newBooks: Book[] = data.docs
            .filter(
              (book: BookJSON) =>
                book.author_name &&
                book.author_name.length > 0 &&
                book.first_publish_year &&
                book.cover_i
            )
            .map((book: BookJSON) => {
              return {
                title: book.title_suggest,
                cover: book.cover_i,
                author: book.author_name ? book.author_name[0] : null,
                key: book.key,
                year: book.first_publish_year,
              };
            });
          dispatch({ type: 'LOADED' });
          setBooks(newBooks);
        })
        .catch((e) => {
          dispatch({ type: 'ERROR', payload: 'Error fetching data' });
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, [bookSearchString]);

  const formatOptionLabel = ({ title, author, year }: Book) => {
    return (
      <div>
        <div>
          <strong>{title}</strong> by {author}, {year}
        </div>
      </div>
    );
  };

  const onInputChange = (inputValue: string) => {
    setBookSearchString(inputValue);
  };

  const handleSelectChange = (newVal: Book | null) => {
    if (newVal) {
      const value = { ...newVal, key: convertSlashToPlus(newVal.key) };
      console.log('changin to plus', value);
      setSelectedBook(value);
      updateBookId(value.key);
      return;
    }
    setSelectedBook(newVal);
  };

  return (
    <div>
      <Select
        isLoading={state.status === 'LOADING' ? true : false}
        options={state.status === 'LOADED' ? books : []}
        getOptionLabel={(book: Book) => book.title}
        getOptionValue={(book: Book) => book.key}
        isClearable
        instanceId="book-select"
        inputValue={bookSearchString}
        onInputChange={onInputChange}
        formatOptionLabel={formatOptionLabel}
        onChange={handleSelectChange}
        value={selectedBook}
        placeholder="Select Book"
        filterOption={null}
      />
    </div>
  );
};

export default BookSelect;
