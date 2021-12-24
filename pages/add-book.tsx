import type { NextPage } from 'next';
import {
  useState,
  useContext,
  createContext,
  SetStateAction,
  Dispatch,
} from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import BookSelect from '../components/BookSelect';
import {
  DateFields,
  DayField,
  MonthField,
  YearField,
} from '../components/DateFields';
import Editor from '../components/editor';
import { FaRegStar, FaStar } from 'react-icons/fa';

const NoteEditor = (props: { children: JSX.Element | JSX.Element[] }) => (
  <div>{props.children}</div>
);
const Recommendation = () => {
  const [rating, setRating] = useState(0);

  return (
    <div>
      {[...Array(5)].map((star, id) => {
        id += 1;
        return (
          <span
            key={id}
            className={id <= rating ? 'on' : 'off'}
            onClick={() => setRating(+id)}
          >
            {id <= rating ? <FaStar /> : <FaRegStar />}
          </span>
        );
      })}
    </div>
  );
};

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

type ErrorContextTypes = {
  error: any | null;
  setError: Dispatch<SetStateAction<any | null>>;
};

export const ErrorContext = createContext<ErrorContextTypes>({
  error: null,
  setError: () => {},
});

const AddBook: NextPage = () => {
  const [startDate, setStartDate] = useState(new Date('January 1, 1990'));
  const [error, setError] = useState<Error | null>(null);

  return (
    <div>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => setError(null)}
      >
        <ErrorContext.Provider value={{ error, setError }}>
          <NoteEditor>
            <BookSelect />
            <Editor />
            <DateFields value={startDate} onChange={setStartDate}>
              <MonthField aria-label="Start Month" /> /{' '}
              <DayField aria-label="Start Day" /> /{' '}
              <YearField start={1990} end={2022} aria-label="Start year" />
            </DateFields>
            <Recommendation />
          </NoteEditor>
        </ErrorContext.Provider>
      </ErrorBoundary>
    </div>
  );
};

export default AddBook;
