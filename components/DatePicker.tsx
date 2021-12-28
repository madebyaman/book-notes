import { useState } from 'react';
import DatePicker from 'react-datepicker';

const DateOfBookRead = () => {
  const [dateRead, setDateRead] = useState<Date | null>(new Date());

  return (
    <DatePicker selected={dateRead} onChange={(date) => setDateRead(date)} />
  );
};
