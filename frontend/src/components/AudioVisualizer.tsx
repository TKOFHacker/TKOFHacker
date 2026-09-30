import React from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isActive,
  color = 'bg-emerald-400',
  size = 'md'
}) => {
  const heightClasses = {
    sm: ['h-3', 'h-5', 'h-7', 'h-4', 'h-6'],
    md: ['h-4', 'h-8', 'h-11', 'h-6', 'h-9', 'h-5'],
    lg: ['h-6', 'h-12', 'h-16', 'h-10', 'h-14', 'h-8']
  }[size];

  return (
    <div className="flex items-center gap-1.5 h-12 justify-center">
      {heightClasses.map((h, i) => (
        <span
          key={i}
          className={`w-1.5 rounded-full transition-all duration-300 ${color} ${
            isActive ? `animate-wave ${h}` : 'h-2 opacity-40'
          }`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};
