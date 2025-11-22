
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { editImage } from '../services/geminiService';
import { Spinner } from './ui/Spinner';
import { CanvasTopBar } from './CanvasTopBar';

interface ResultViewerProps {
  image: string;
  onStartOver: () => void;
  onEdit: () => void;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ image, onStartOver, onEdit }) => {
  const [currentImage, setCurrentImage] = useState(image);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = 'generated-design.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim()) return;

    setIsEditing(true);
    setError(null);
    try {
      const newImage = await editImage(currentImage, editPrompt);
      setCurrentImage(newImage);
      setEditPrompt('');
    } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred during editing.';
        setError(message);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col lg:flex-row overflow-hidden bg-background">
      
      {/* Left Panel: Sidebar Configuration */}
      <div className="w-full lg:w-[360px] xl:w-[400px] flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-card z-20 shadow-sm lg:shadow-none flex-shrink-0 h-auto lg:h-full">
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-border flex flex-col gap-1 bg-card">
           <div className="flex items-center justify-between mb-2">
                <button onClick={onEdit} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Back to Editor
                </button>
                <div className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-green-500/10 text-green-600">Generated</div>
           </div>
           <h1 className="text-xl font-semibold tracking-tight text-foreground">Your Design</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
           {/* Section: Download */}
           <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your unique design has been generated. You can download it immediately or use AI to make further refinements.
              </p>
              <Button onClick={handleDownload} size="lg" className="w-full font-medium shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download Image
              </Button>
           </div>

           <div className="h-px w-full bg-border" />

           {/* Section: AI Edit */}
           <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Magic Edit</h3>
              <form onSubmit={handleEditSubmit} className="space-y-3">
                 <div className="space-y-1.5">
                    <Label htmlFor="edit-prompt" className="text-xs font-medium text-foreground/80">
                        Refine with AI
                    </Label>
                    <div className="relative">
                        <Input
                            id="edit-prompt"
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder='e.g., "Make it black and white", "Add lens flare"'
                            disabled={isEditing}
                            className="h-10 text-sm bg-background border-input/60 focus:border-primary/60 transition-all pr-10"
                        />
                    </div>
                 </div>
                 <Button 
                    type="submit" 
                    variant="secondary"
                    disabled={isEditing || !editPrompt.trim()}
                    className="w-full"
                 >
                    {isEditing ? 'Processing...' : 'Apply Changes'}
                 </Button>
              </form>
              {error && (
                <div className="p-2.5 bg-red-500/10 text-red-600 text-xs font-medium rounded-md">
                    {error}
                </div>
              )}
           </div>
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-5 border-t border-border bg-card mt-auto">
            <Button 
                onClick={onStartOver} 
                variant="ghost" 
                size="sm" 
                className="w-full text-muted-foreground hover:text-foreground"
            >
                Start New Design
            </Button>
        </div>
      </div>

      {/* Right Panel: Canvas Area */}
      <div className="flex-1 relative h-[500px] lg:h-full bg-secondary/5 overflow-hidden flex flex-col items-center justify-center p-4 lg:p-10">
         <CanvasTopBar showDownload={true} onDownload={handleDownload} />

         {/* Background Grid */}
         <div className="absolute inset-0 pointer-events-none" style={{ 
             backgroundImage: 'radial-gradient(circle at 1px 1px, var(--tw-colors-border) 1px, transparent 0)', 
             backgroundSize: '40px 40px',
             opacity: 0.4
         }}></div>

         {/* Canvas Wrapper */}
         <div className="relative z-10 w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[50vh] h-auto transition-all duration-500 ease-out group">
             {/* We rely on the image natural aspect ratio here or the container constraints */}
            <div className="w-full h-auto bg-card rounded-sm shadow-2xl border border-border/40 overflow-hidden relative ring-1 ring-black/5">
                <img 
                    src={currentImage} 
                    alt="Generated Cover" 
                    className="w-full h-auto object-contain max-h-[70vh]"
                />
                
                {/* Loading Overlay */}
                {isEditing && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                    <Spinner className="w-8 h-8 text-primary mb-3" />
                    <p className="text-sm font-medium text-foreground animate-pulse">Refining your design...</p>
                  </div>
                )}
            </div>
            
            {/* Floating Label */}
            <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">Final Output</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default ResultViewer;
