import React from 'react';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';
import { ThemeToggle } from './ThemeToggle';

interface HeroProps {
  onGetStarted: () => void;
}

// Replaced local assets with Pinterest-style external images
const images = [
  'https://picsum.photos/seed/picsum1/400/560',
  'https://picsum.photos/seed/picsum2/400/560',
  'https://picsum.photos/seed/picsum3/400/560',
  'https://picsum.photos/seed/picsum4/400/560',
  'https://picsum.photos/seed/picsum5/400/560',
  'https://picsum.photos/seed/picsum6/400/560',
  'https://picsum.photos/seed/picsum7/400/560',
];

const Marquee: React.FC<{ images: string[]; reverse?: boolean }> = ({ images, reverse = false }) => {
    const repeatedImages = [...images, ...images]; // Duplicate for seamless looping
    return (
        <div className={`flex ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} whitespace-nowrap`}>
            {repeatedImages.map((src, index) => (
                <div key={index} className="flex-shrink-0 w-60 md:w-72 p-3">
                    <img 
                        className="w-full h-80 md:h-96 object-cover rounded-lg shadow-xl bg-secondary" 
                        src={src} 
                        alt={`Magazine cover example ${index + 1}`} 
                    />
                </div>
            ))}
        </div>
    );
};


const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="w-full min-h-screen bg-background overflow-x-hidden flex flex-col font-sans">
      <header className="w-full px-4 sm:px-6 lg:px-8 py-6 z-20 shrink-0">
        <div className="mx-auto flex justify-between items-center max-w-7xl">
          <Logo className="h-8 w-8" />
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex flex-col items-center justify-start pt-[81px] text-center px-4 z-10">
        <h1 className="max-w-4xl text-foreground text-5xl sm:text-6xl lg:text-7xl font-serif tracking-tighter mb-5">
          The Cover Star is You.
        </h1>
        <p className="max-w-2xl text-muted-foreground text-lg sm:text-xl leading-relaxed mb-10">
          Upload your photo, fill in what you like, and let our AI turn you into a fashion icon. Free, fast, and stunningly realistic.
        </p>
        <Button
          onClick={onGetStarted}
          className="h-12 px-7 rounded-[30px] text-l font-normal"
        >
          Try it now
        </Button>
      </main>

      <div className="w-full py-12 z-0 shrink-0">
         <div className="relative w-full overflow-hidden">
            <Marquee images={images} />
         </div>
      </div>
      
      <footer className="w-full text-center py-6 z-10 shrink-0 mt-auto">
        <p className="text-muted-foreground/80 text-sm">
          Made by <a href="https://x.com/Dahsmartgirl" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:no-underline">Ileri</a>🖤
        </p>
      </footer>
    </div>
  );
};

export default Hero;