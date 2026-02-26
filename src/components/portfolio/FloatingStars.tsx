import React, { useMemo } from 'react';

const STAR_COUNT = 60;
const STAR_SIZES = [1, 1.5, 2];

function FloatingStars() {
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: STAR_SIZES[Math.floor(Math.random() * STAR_SIZES.length)],
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
    }));
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default FloatingStars;
