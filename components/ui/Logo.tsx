import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="paint0_linear_19_17" x1="15.5" y1="0" x2="15.5" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ED0C14"/>
          <stop offset="1" stopColor="#BABABA"/>
        </linearGradient>
        <clipPath id="clip0_19_17">
          <rect width="31" height="31" fill="white"/>
        </clipPath>
      </defs>
      <g clipPath="url(#clip0_19_17)">
        <path d="M0 23.25C0 27.5302 3.46982 31 7.75 31H0V23.25ZM31 7.75C31 3.46982 27.5302 0 23.25 0V15.5H31V31H23.25V15.5H15.5V23.25C15.5 27.5302 18.9698 31 23.25 31H7.75V15.5H0V0H31V7.75ZM7.75 15.5H15.5V7.75C15.5 3.46982 12.0302 0 7.75 0V15.5Z" fill="url(#paint0_linear_19_17)"/>
      </g>
    </svg>
  );
};
