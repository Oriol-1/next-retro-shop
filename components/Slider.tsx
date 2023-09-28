// Slider.tsx
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styles from './Slider.module.css';

interface SlideProps {
  imageSrc: string;
  title: string;
  description: string;
}

interface SliderProps {
  slides: SlideProps[];
}

const Slider: React.FC<SliderProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 4700);

    return () => {
      clearInterval(intervalId);
    };
  }, [slides.length]);

  return (
    <div className={styles.slider}>
      {slides.map((slide, index) => (
       <div key={index} className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}>
       <div className={styles.slideImage}>
       <Image
    src={slide.imageSrc} 
    alt={slide.title} 
    layout="fill"
    objectFit="cover"  // Consider removing if it's no longer supported
    sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1280px"  // Example sizes; adjust as per your design
    priority={index === 0}  // Only for the first image; adjust if needed
/>
       </div>
       <div className={styles.text}>
         <h1>{slide.title}</h1>
         <p>{slide.description}</p>
       </div>
     </div>
      ))}
    </div>
  );
};

export default Slider;
