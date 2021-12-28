import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateOfBookRead = () => {
  const [dateRead, setDateRead] = useState<Date | null>(new Date());

  return (
    <DatePicker
      selected={dateRead}
      onChange={(date: Date | null) => setDateRead(date)}
    />
  );
};

export default DateOfBookRead;
