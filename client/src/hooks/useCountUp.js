import { useEffect, useState } from 'react';

export const useCountUp = (target, duration = 1500, delay = 0) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    let timeout;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(eased * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [target, duration, delay]);

  return value;
};
