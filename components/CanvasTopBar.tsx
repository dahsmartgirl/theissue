
import React from 'react';
import { Button } from './ui/Button';

interface CanvasTopBarProps {
  onDownload?: () => void;
  showDownload?: boolean;
}

export const CanvasTopBar: React.FC<CanvasTopBarProps> = ({ onDownload, showDownload = false }) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 p-6 flex items-center justify-end gap-3 pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto">
        {showDownload && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 bg-background/60 backdrop-blur-md border-border/50 hover:bg-background/90 shadow-sm transition-all duration-200" 
            onClick={onDownload}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Download
          </Button>
        )}
        
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full bg-background/60 backdrop-blur-md border border-border/50 hover:bg-background/90 shadow-sm transition-all duration-200"
        >
           <span className="sr-only">Profile</span>
           <div className="h-full w-full rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
           </div>
        </Button>
      </div>
    </div>
  );
};
