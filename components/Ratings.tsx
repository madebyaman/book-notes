import { FaStar } from 'react-icons/fa';
import { useState } from 'react';

const Ratings = () => {
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
            <FaStar fill={id <= rating ? '#1abc9c' : '#bdc3c7'} />
          </span>
        );
      })}
    </div>
  );
};

export default Ratings;
