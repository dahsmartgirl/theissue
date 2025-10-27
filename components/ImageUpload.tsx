import React, { useState, useCallback } from 'react';
import { Label } from './ui/Label';
import { Input } from './ui/Input';

interface ImageUploadProps {
  onImageUpload: (base64Image: string) => void;
  initialPreview?: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, initialPreview }) => {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [error, setError] = useState<string>('');

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Please select a PNG or JPG image.');
      setPreview(null);
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
  }, [onImageUpload]);

  return (
    <div className="w-full space-y-2">
        <div className="w-full h-64 border border-border rounded-lg flex items-center justify-center bg-secondary/30 hover:border-primary/50 transition-colors">
        {preview ? (
            <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain rounded-md p-2" />
        ) : (
            <div className="text-center text-muted-foreground p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm">Click to upload or drag & drop</p>
                <p className="text-xs">PNG or JPG</p>
            </div>
        )}
        </div>
        <Input 
            id="image-upload" 
            type="file" 
            accept="image/png, image/jpeg" 
            onChange={handleFileChange}
            className="text-sm"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default ImageUpload;