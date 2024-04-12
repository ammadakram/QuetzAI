
import React, { useRef, useEffect, useState } from 'react';
import './TypingAnimation.css'; // Import CSS for styling

interface TypingAnimationProps {
    texts: string[]; // Array of texts to cycle through
    delayBetweenAnimations?: number; // Optional delay in milliseconds between animations
    fontSize?: string; // Optional font size
  }
  
  const TypingAnimation: React.FC<TypingAnimationProps> = ({ texts, delayBetweenAnimations = 6000   , fontSize = '30px' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [textToType, setTextToType] = useState('');
    const cursorRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
          if (textToType.length < texts[currentIndex].length) {
            setTextToType((prevText) => prevText + texts[currentIndex][textToType.length]);
          } else {
            clearInterval(intervalId);
            setTimeout(() => {
              setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
              setTextToType('');
            }, delayBetweenAnimations);
          }
        }, 1500 / 40); // Adjust speed here (1500ms / 40 words per minute)
    
        return () => clearInterval(intervalId); // Cleanup function
      }, [currentIndex, textToType]);
    
      useEffect(() => {
        if (cursorRef.current) {
          cursorRef.current.style.left = `${textToType.length * 15}px`; // Adjust for cursor margin-left
        }
              const textContainer = cursorRef?.current?.parentElement;
      if (textContainer) {
        cursorRef.current.style.bottom = `${textContainer.getBoundingClientRect().height - 2}px`; // Adjust for cursor height
      }
      }, [textToType]);
    
      return (
        <div className="text-container" style={{ fontSize }}>
          {textToType}
          <span ref={cursorRef} className="cursor"></span>
        </div>
      );
    };
    
    export default TypingAnimation;
