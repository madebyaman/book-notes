import React from 'react';

export default function AddNewBook({
  input,
  submit,
}: {
  input: string;
  submit: ({ name, author }: { name: string; author: string }) => void;
}) {
  const [{ name, author }, setState] = React.useState({
    name: input,
    author: '',
  });

  const nameRef = React.useRef<null | HTMLInputElement>(null);

  React.useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit({ name, author });
  };

  return (
    <form onSubmit={submitForm}>
      <label>
        Book name:
        <input
          type="text"
          value={input}
          onChange={(e) => setState({ name: e.target.value, author })}
          ref={nameRef}
        />
      </label>
      <label>
        Author name:
        <input
          type="text"
          value={author}
          onChange={(e) => setState({ name, author: e.target.value })}
        />
      </label>
      <button type="submit">Add New Book</button>
    </form>
  );
}
