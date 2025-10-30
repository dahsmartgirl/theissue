import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        viewBox="0 0 100 100" 
        className={className} 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <rect width="100" height="100" rx="12" fill="hsl(240 10% 3.9%)" />
        <rect x="25" y="25" width="50" height="50" rx="6" fill="hsl(0 0% 100%)" />
        <rect x="35" y="35" width="30" height="30" rx="2" fill="hsl(240 10% 3.9%)" />
    </svg>
);
