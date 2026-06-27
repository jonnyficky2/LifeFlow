import React from 'react';
import '../../assets/css/skeletons.css';

interface SkeletonProps {
  type?: 'text' | 'title' | 'block' | 'circle';
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  type = 'text', 
  width, 
  height, 
  style = {},
  className = ''
}) => {
  const mergedStyle = { ...style };
  
  if (width) mergedStyle.width = width;
  if (height) mergedStyle.height = height;

  return (
    <div 
      className={`skeleton skeleton-${type} ${className}`} 
      style={mergedStyle}
      aria-hidden="true"
    />
  );
};
