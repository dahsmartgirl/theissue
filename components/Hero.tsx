import React from 'react';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[70vh] py-12">
      <Logo className="h-20 w-20 md:h-24 md:w-24 mb-6 text-foreground" />
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
        theissue
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
        Create stunning, AI-powered magazine covers in seconds. Your story, your cover.
      </p>
      <Button onClick={onGetStarted} size="lg" className="text-lg font-semibold px-10 h-14">
        Create Your Cover
      </Button>
    </div>
  );
};

export default Hero;
