//Background.js
import React from 'react';

interface BackgroundProps {
  children: React.ReactNode;
}

const Background = ({ children }: BackgroundProps) => {
  return <body className="bg-white dark:bg-black transition-all">{children}</body>;
};

export default Background;
