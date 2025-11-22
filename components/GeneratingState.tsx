
import React, { useEffect, useState } from 'react';
import { Spinner } from './ui/Spinner';
import { CanvasTopBar } from './CanvasTopBar';

interface GeneratingStateProps {
  originalImage: string | null;
}

const STEPS = [
  { label: "Uploading assets", duration: 1500 },
  { label: "Analyzing composition", duration: 2500 },
  { label: "Enhancing studio lighting", duration: 3000 },
  { label: "Applying editorial color grade", duration: 2500 },
  { label: "Typesetting cover lines", duration: 3000 },
  { label: "Finalizing issue export", duration: 2000 }
];

export const GeneratingState: React.FC<GeneratingStateProps> = ({ originalImage }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Fix: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout which may not be available in browser environments
    let timeout: ReturnType<typeof setTimeout>;
    
    const advanceStep = (index: number) => {
      if (index < STEPS.length - 1) {
        timeout = setTimeout(() => {
          setCurrentStepIndex(index + 1);
          advanceStep(index + 1);
        }, STEPS[index].duration);
      }
    };

    advanceStep(0);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex h-full w-full flex-col lg:flex-row overflow-hidden bg-background">
      
      {/* Left Panel: Status Log */}
      <div className="w-full lg:w-[360px] xl:w-[400px] flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-card z-20 shadow-sm lg:shadow-none flex-shrink-0 h-auto lg:h-full">
        
        <div className="p-5 border-b border-border bg-card">
           <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <div className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-secondary">Processing</div>
           </div>
           <h1 className="text-xl font-semibold tracking-tight text-foreground">Production in Progress</h1>
           <p className="text-sm text-muted-foreground mt-1">Our AI Art Director is crafting your cover.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           <div className="space-y-1">
              {STEPS.map((step, index) => {
                const isComplete = index < currentStepIndex;
                const isActive = index === currentStepIndex;
                
                return (
                  <div key={index} className={`flex items-center gap-3 p-2 transition-colors duration-300 ${isActive ? 'text-foreground' : isComplete ? 'text-muted-foreground/60' : 'text-muted-foreground/30'}`}>
                    <div className="flex-shrink-0 w-5 flex justify-center">
                        {isComplete ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : isActive ? (
                            <Spinner className="w-4 h-4 text-primary" />
                        ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        )}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'animate-pulse' : ''}`}>
                        {step.label}
                        {isActive && "..."}
                    </span>
                  </div>
                );
              })}
           </div>
        </div>
        
        <div className="p-5 border-t border-border bg-card mt-auto">
            <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                <div 
                    className="bg-primary h-full transition-all duration-1000 ease-linear" 
                    style={{ width: `${Math.min(((currentStepIndex + 1) / STEPS.length) * 100, 100)}%` }} 
                />
            </div>
            <p className="text-[10px] text-muted-foreground text-right mt-2 font-mono">Est. time remaining: {15 - Math.floor((currentStepIndex / STEPS.length) * 15)}s</p>
        </div>
      </div>

      {/* Right Panel: Scanning Visualization */}
      <div className="flex-1 relative h-[500px] lg:h-full bg-secondary/5 overflow-hidden flex flex-col items-center justify-center p-4 lg:p-10">
         <CanvasTopBar />
         
         <div className="absolute inset-0 pointer-events-none" style={{ 
             backgroundImage: 'radial-gradient(circle at 1px 1px, var(--tw-colors-border) 1px, transparent 0)', 
             backgroundSize: '40px 40px',
             opacity: 0.4
         }}></div>

         <div className="relative z-10 w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[50vh] aspect-[3/4]">
            <div className="w-full h-full bg-card rounded-sm shadow-xl border border-border/40 overflow-hidden relative ring-1 ring-black/5 grayscale opacity-90">
                {originalImage ? (
                    <img 
                        src={originalImage} 
                        alt="Original Upload" 
                        className="w-full h-full object-cover filter contrast-[0.9]"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-xs uppercase tracking-widest">No Source Image</span>
                    </div>
                )}
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-scan pointer-events-none border-b border-primary/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)]" />
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                     <div className="absolute top-0 left-1/3 w-px h-full bg-white"></div>
                     <div className="absolute top-0 right-1/3 w-px h-full bg-white"></div>
                     <div className="absolute left-0 top-1/3 w-full h-px bg-white"></div>
                     <div className="absolute left-0 bottom-1/3 w-full h-px bg-white"></div>
                </div>
            </div>
            
            <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className="text-xs text-primary font-medium uppercase tracking-widest opacity-80 animate-pulse">Analysis Active</span>
            </div>
         </div>
      </div>
    </div>
  );
};
