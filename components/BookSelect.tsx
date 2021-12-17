import React from 'react';
import { Service, Books, BookOption, BookJSON } from '../types/JSONresponse';
import Select, { ActionMeta, OnChangeValue } from 'react-select';

const BookSelect = () => {
  const [bookSearchString, setBookSearchString] = React.useState('');
  const [books, setBooks] = React.useState<Service<BookOption[]>>({
    status: 'init',
  });
  const [selectedBook, setSelectedBook] = React.useState<BookOption | null>(
    null
  );

  React.useEffect(() => {
    const searchString = bookSearchString.replace(/ /g, '+');
    // Do not wait for 1s, but wait for 1s after input has finished entering
    const timer = setTimeout(async () => {
      setBooks({ status: 'loading' });
      try {
        const response = await fetch(
          `http://openlibrary.org/search.json?q=${searchString}`
        );
        const data = await response.json();
        // Not only render book title, but also cover, year and author.
        // Push selected state to firebase
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
              author: book.author_name[0],
              id: book.key,
              year: book.first_publish_year,
            };
          });
        setBooks({ status: 'loaded', payload: newBooks });
      } catch (e) {
        console.error(e);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [bookSearchString]);

  const formatOptionLabel = ({ label, author, cover, year }: BookOption) => {
    return (
      <div>
        <div>
          <strong>{label}</strong> by {author} {year}
        </div>
        <div>
          <img src={`https://covers.openlibrary.org/b/id/${cover}-M.jpg`} />
        </div>
      </div>
    );
  };

  const onInputChange = (inputValue: string) => {
    setBookSearchString(inputValue);
  };

  const handleSelectChange = (
    newVal: OnChangeValue<BookOption, false>,
    actionMeta: ActionMeta<BookOption>
  ) => {
    if (actionMeta.action === 'select-option') {
      setSelectedBook(newVal);
    } else if (actionMeta.action === 'clear') {
      setSelectedBook(null);
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
        value={selectedBook}
        filterOption={null}
      />
    </div>
  );
};

export default BookSelect;
