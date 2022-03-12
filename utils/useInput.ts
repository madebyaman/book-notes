import { ChangeEvent, useState } from 'react';

export const useInput = (
  initialValue: string
): [
  { value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void },
  () => void
] => {
  const [value, setValue] = useState(initialValue);

  return [
    {
      value,
      onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    },
    () => setValue(initialValue),
  ];
};
