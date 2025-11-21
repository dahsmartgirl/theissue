import React, { useState, useCallback, useRef } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface ImageUploadProps {
  onImageUpload: (base64Image: string) => void;
  initialPreview?: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, initialPreview }) => {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  }, []);

  const processFile = (file?: File) => {
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please select a PNG, JPG or WebP image.');
      return;
    }
    
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onImageUpload(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div 
        className={`w-full h-full relative group transition-all duration-300 ease-in-out
        ${!preview ? 'cursor-pointer bg-secondary/20 hover:bg-secondary/30' : ''}
        ${isDragging ? 'bg-primary/10 ring-2 ring-primary/20' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!preview ? triggerFileInput : undefined}
    >
        {preview ? (
            <>
                <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-cover absolute inset-0" 
                />
                
                {/* Text Overlay Hints (Ghosted) */}
                 <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[8%] left-0 right-0 flex justify-center opacity-30 border-y border-white/20 py-4 bg-black/10">
                       <span className="text-white/80 text-xs uppercase tracking-[0.3em] font-serif font-bold">Masthead Zone</span>
                    </div>
                    
                     <div className="absolute bottom-[10%] left-[8%] w-[40%] flex flex-col gap-2 opacity-30">
                       <div className="h-2 w-full bg-white/40 rounded-sm" />
                       <div className="h-2 w-2/3 bg-white/40 rounded-sm" />
                       <div className="h-2 w-3/4 bg-white/40 rounded-sm" />
                       <span className="text-white/80 text-[10px] uppercase tracking-widest mt-1">Headline Zone</span>
                    </div>
                 </div>

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <Button 
                        variant="secondary" 
                        size="sm"
                        className="h-9"
                        onClick={clearImage}
                    >
                        Change Photo
                    </Button>
                </div>
            </>
        ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 shadow-sm border border-border ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Upload Cover Photo</h3>
                <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed mb-6">
                    Drag and drop a high-quality portrait, or click to browse.
                </p>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm" className="h-8 text-xs" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>
                       Select File
                   </Button>
                   {error && <p className="text-xs text-destructive font-medium animate-pulse">{error}</p>}
                </div>
            </div>
        )}
        
        <Input 
            ref={inputRef}
            id="image-upload" 
            type="file" 
            accept="image/png, image/jpeg, image/webp" 
            onChange={handleFileChange}
            className="hidden"
        />
    </div>
  );
};

export default ImageUpload;