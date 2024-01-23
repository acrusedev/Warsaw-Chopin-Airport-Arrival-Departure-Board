import React, { useState, useEffect } from 'react';

interface LetterProps {
  char: string;
}

const Letter: React.FC<LetterProps> = ({ char }) => {
  const [currentChar, setCurrentChar] = useState(char);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChar(chars[Math.floor(Math.random() * chars.length)]);
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setCurrentChar(char);
    }, 2000); // Change the character after 2 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <span className="letter">
      {currentChar}
    </span>
  );
};

export default Letter;