import React, { useRef, useEffect, useState } from 'react';
import './TypingAnimation.css'; // Import CSS for styling

interface TypingAnimationProps {
  texts: string[]; // Array of texts to cycle through
  delayBetweenAnimations?: number; // Optional delay in milliseconds between animations
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  texts,
  delayBetweenAnimations = 1500,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textToType, setTextToType] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (textToType.length < texts[currentIndex].length) {
        setTextToType(
          (prevText) => prevText + texts[currentIndex][textToType.length]
        );
      } else {
        clearInterval(intervalId);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
          setTextToType('');
        }, delayBetweenAnimations);
      }
    }, 2000 / 40); // Adjust speed here (1500ms / 40 words per minute)

    return () => clearInterval(intervalId); // Cleanup function
  }, [currentIndex, textToType]);

  // Effect to toggle cursor visibility
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prevShowCursor) => !prevShowCursor);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className={`text-container`}>
      {textToType}
      {showCursor && <span className="typing-cursor">_</span>}
    </div>
  );
};

export default TypingAnimation;
