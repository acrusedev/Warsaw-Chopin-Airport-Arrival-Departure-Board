import React from 'react';
import Letter  from './Letter';

const Departures = () => {
  const text = 'HELLO, WORLD!';

  return (
    <div className="departure-board">
      {text.split('').map((char, index) => (
        <Letter key={index} char={char} />
      ))}
    </div>
  );
};

export default Departures;