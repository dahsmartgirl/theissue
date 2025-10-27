import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { editImage } from '../services/geminiService';
import { Spinner } from './ui/Spinner';

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
    link.download = 'magazine-cover.png';
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
      setEditPrompt(''); // Clear prompt on success
    } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred during editing.';
        setError(message);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Your Cover is Ready!</CardTitle>
          <CardDescription>Download your cover, or use AI to edit it further.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 border rounded-lg overflow-hidden relative">
            <img src={currentImage} alt="Generated magazine cover" className="w-full h-auto" />
            {isEditing && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                <Spinner />
                <p className="text-foreground mt-2">Applying edits...</p>
              </div>
            )}
          </div>

          <div className="mb-6 text-left">
            <form onSubmit={handleEditSubmit} className="space-y-3">
               <Label htmlFor="edit-prompt" className="text-lg font-semibold">Edit Your Image</Label>
               <div className="flex gap-2">
                 <Input
                    id="edit-prompt"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder='e.g., "Add a retro filter"'
                    disabled={isEditing}
                    className="flex-grow"
                 />
                 <Button type="submit" disabled={isEditing || !editPrompt.trim()}>
                    Apply
                 </Button>
               </div>
            </form>
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleDownload} size="lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </Button>
            <Button onClick={onEdit} variant="outline" size="lg">
              Edit Details
            </Button>
            <Button onClick={onStartOver} variant="secondary" size="lg">
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultViewer;