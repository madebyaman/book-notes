import React, { useEffect, useState } from 'react';
import { Book, BookJSON } from '@/@types';
import Select from 'react-select';
import { useStatus } from '@/utils';
import {
  updateBookId,
  updateSelectedBook,
  useAppDispatch,
  useAppSelector,
} from '@/utils/store';

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
  const selectedBook = useAppSelector((state) => state.note.selectedBook);
  const noteDispatch = useAppDispatch();
  const { state, dispatch } = useStatus();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'LOADING' });
      fetch(
        `https://openlibrary.org/search.json?q=${convertToPlus(
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
  }, [bookSearchString, dispatch]);

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
      noteDispatch(updateSelectedBook(value));
      noteDispatch(updateBookId(value.key));
      return;
    }
    noteDispatch(updateSelectedBook(newVal));
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
        className="select-book-container"
        classNamePrefix="select-book"
        filterOption={null}
      />
    </div>
  );
};

export default BookSelect;
