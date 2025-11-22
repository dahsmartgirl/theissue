
import React from 'react';
import { Button } from './ui/Button';
import { CanvasTopBar } from './CanvasTopBar';

interface ErrorStateProps {
  errorMessage: string;
  originalImage: string | null;
  onTryAgain: () => void;
  onBack: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage, originalImage, onTryAgain, onBack }) => {
  return (
    <div className="flex h-full w-full flex-col lg:flex-row overflow-hidden bg-background">
      
      {/* Left Panel: Error Details */}
      <div className="w-full lg:w-[360px] xl:w-[400px] flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-card z-20 shadow-sm lg:shadow-none flex-shrink-0 h-auto lg:h-full">
        
        <div className="p-5 border-b border-border bg-destructive/5">
           <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-destructive"></div>
                <div className="text-xs font-mono text-destructive font-medium px-2 py-0.5 rounded-md bg-destructive/10">Error</div>
           </div>
           <h1 className="text-xl font-semibold tracking-tight text-destructive">Production Halted</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
           <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 mb-6">
               <h3 className="text-sm font-medium text-foreground mb-2">What went wrong?</h3>
               <p className="text-sm text-muted-foreground leading-relaxed">
                   {errorMessage}
               </p>
           </div>

           <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Suggestions</p>
           <ul className="space-y-2 text-sm text-muted-foreground">
               <li className="flex items-start gap-2">
                   <span className="block w-1 h-1 mt-2 rounded-full bg-foreground/40"></span>
                   Check if your image format is supported (JPG, PNG).
               </li>
               <li className="flex items-start gap-2">
                   <span className="block w-1 h-1 mt-2 rounded-full bg-foreground/40"></span>
                   The AI service might be experiencing high traffic.
               </li>
               <li className="flex items-start gap-2">
                   <span className="block w-1 h-1 mt-2 rounded-full bg-foreground/40"></span>
                   Try simplifying your text inputs.
               </li>
           </ul>
        </div>
        
        <div className="p-5 border-t border-border bg-card mt-auto space-y-3">
             <Button onClick={onTryAgain} className="w-full shadow-md" size="lg">
                Try Again
             </Button>
             <Button onClick={onBack} variant="ghost" className="w-full">
                Return to Editor
             </Button>
        </div>
      </div>

      {/* Right Panel: Static Context */}
      <div className="flex-1 relative h-[500px] lg:h-full bg-secondary/5 overflow-hidden flex flex-col items-center justify-center p-4 lg:p-10">
         <CanvasTopBar />

         <div className="absolute inset-0 pointer-events-none" style={{ 
             backgroundImage: 'radial-gradient(circle at 1px 1px, var(--tw-colors-border) 1px, transparent 0)', 
             backgroundSize: '40px 40px',
             opacity: 0.4
         }}></div>

         <div className="relative z-10 w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[50vh] aspect-[3/4]">
            <div className="w-full h-full bg-card rounded-sm shadow-none border border-border/40 overflow-hidden relative ring-1 ring-black/5 opacity-50 grayscale">
                {originalImage ? (
                    <img 
                        src={originalImage} 
                        alt="Original Upload" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-xs">Image Unavailable</span>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-destructive/10 mix-blend-overlay" />
            </div>
            
            <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className="text-xs text-destructive font-medium uppercase tracking-widest opacity-80">Generation Failed</span>
            </div>
         </div>
      </div>
    </div>
  );
};
