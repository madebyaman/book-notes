import React, { createContext, useContext } from 'react';

function daysInMonth(m: number, y: number) {
  switch (m) {
    case 1:
      return (y % 4 === 0 && y % 100) || y % 400 === 0 ? 29 : 28;
    case 8:
    case 3:
    case 5:
    case 10:
      return 30;
    default:
      return 31;
  }
}

interface DateFieldsContextValue {
  date: Date;
  onChange: Function;
}

const Context = createContext<DateFieldsContextValue>({
  date: new Date(),
  onChange() {},
});

type DateFieldsProps = {
  children?: React.ReactNode;
  value: Date;
  onChange: Function;
};

export function DateFields({
  children,
  value: controlledValue,
  onChange,
}: DateFieldsProps) {
  const date = controlledValue;
  const context = { date, onChange };
  return <Context.Provider value={context} children={children} />;
}

export function DayField(props: { [x: string]: any }) {
  const { date, onChange } = useContext(Context);
  const month = date.getMonth();
  const year = date.getFullYear();
  const days = Array.from({ length: daysInMonth(month, year) });
  const value = date.getDate();
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(date.getTime());
    newDate.setDate(parseInt(event.target.value));
    onChange(newDate);
  };

  return (
    <select value={value} onChange={handleChange} {...props}>
      {days.map((_, index) => (
        <option key={index} value={index + 1}>
          {index < 9 ? '0' : ''}
          {index + 1}
        </option>
      ))}
    </select>
  );
}

export function MonthField(props: { [x: string]: any }) {
  const { date, onChange } = useContext(Context);
  const month = date.getMonth();
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(date.getTime());
    newDate.setMonth(parseInt(event.target.value));
    onChange(newDate);
  };

  return (
    <select value={month} onChange={handleChange} {...props}>
      <option value="0">Jan</option>
      <option value="1">Feb</option>
      <option value="2">Mar</option>
      <option value="3">Apr</option>
      <option value="4">May</option>
      <option value="5">Jun</option>
      <option value="6">Jul</option>
      <option value="7">Aug</option>
      <option value="8">Sep</option>
      <option value="9">Oct</option>
      <option value="10">Nov</option>
      <option value="11">Dec</option>
    </select>
  );
}

type YearFieldProps = {
  start: number;
  end: number;
  rest?: {
    [x: string]: any;
  };
};

export function YearField({ start, end, ...rest }: YearFieldProps) {
  const { date, onChange } = useContext(Context);
  const difference = end - start + 1;
  const years = Array.from({ length: difference }).map(
    (_, index) => index + start
  );
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(date.getTime());
    newDate.setFullYear(parseInt(event.target.value), 1);
    onChange(newDate);
  };

  return (
    <select value={date.getFullYear()} onChange={handleChange} {...rest}>
      {years.map((year) => (
        <option key={year}>{year}</option>
      ))}
    </select>
  );
}
