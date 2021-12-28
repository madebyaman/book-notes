import React, { useContext } from 'react';
import { Service, BookOption, BookJSON } from '../types/JSONresponse';
import Select, { ActionMeta, OnChangeValue } from 'react-select';
import { ErrorContext } from '../pages/add-book';

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
          const { setError } = useContext(ErrorContext);
          setError(e);
        });
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
          {cover ? (
            <img src={`https://covers.openlibrary.org/b/id/${cover}-M.jpg`} />
          ) : (
            <img src="https://ouch-cdn2.icons8.com/mjxVqdtFhvPfgGFLfrqsYTTcouHGsbir4If-F3keGOE/rs:fit:1092:912/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNTkz/LzVhN2NjN2U2LTA1/ODMtNGU3Yi1iM2M1/LTI4ZGE3ZTM3ODEz/Yy5zdmc.png" />
          )}
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
        placeholder="Select Book"
        filterOption={null}
      />
    </div>
  );
};

export default BookSelect;
