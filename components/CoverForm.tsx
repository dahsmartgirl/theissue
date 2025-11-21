import React, { useState, useCallback } from 'react';
import { Preset } from '../types';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Button } from './ui/Button';
import ImageUpload from './ImageUpload';
import { Switch } from './ui/Switch';

interface CoverFormProps {
  preset: Preset;
  onSubmit: (formData: Record<string, string>, image: string, stylize: boolean) => void;
  onCancel: () => void;
  initialData?: Record<string, string> | null;
  initialImage?: string | null;
  initialStylize?: boolean | null;
}

const CoverForm: React.FC<CoverFormProps> = ({ preset, onSubmit, onCancel, initialData, initialImage, initialStylize }) => {
  const initialFormData = preset.fields.reduce((acc, field) => {
    acc[field.id] = '';
    return acc;
  }, {} as Record<string, string>);

  const [formData, setFormData] = useState(initialData || initialFormData);
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [stylize, setStylize] = useState(initialStylize ?? true);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = useCallback((base64Image: string) => {
    setImage(base64Image);
    if (error) {
        setError('');
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image to continue.');
      return;
    }
    setError('');
    onSubmit(formData, image, stylize);
  };

  return (
    <div className="flex h-full w-full flex-col lg:flex-row overflow-hidden bg-background">
      
      {/* Left Panel: Sidebar Configuration */}
      <div className="w-full lg:w-[360px] xl:w-[400px] flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-card z-20 shadow-sm lg:shadow-none flex-shrink-0 h-auto lg:h-full">
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-border flex flex-col gap-1 bg-card">
           <div className="flex items-center justify-between mb-2">
                <button onClick={onCancel} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Back
                </button>
                <div className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-secondary">{preset.name} Mode</div>
           </div>
           <h1 className="text-xl font-semibold tracking-tight text-foreground">Cover Configuration</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
           {/* Section 1: Text Content */}
           <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Text Details</h3>
              <div className="space-y-4">
                {preset.fields.map((field) => (
                    <div key={field.id} className="space-y-1.5">
                    <Label htmlFor={field.id} className="text-xs font-medium text-foreground/80">
                        {field.label}
                    </Label>
                    <Input
                        id={field.id}
                        name={field.id}
                        value={formData[field.id] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="h-9 text-sm bg-background border-input/60 focus:border-primary/60 transition-all"
                    />
                    </div>
                ))}
              </div>
           </div>

           {/* Section 2: AI Settings */}
           <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AI Settings</h3>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/10">
                 <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-foreground">Auto-Stylize</Label>
                    <p className="text-xs text-muted-foreground">Enhance lighting & background</p>
                 </div>
                 <Switch checked={stylize} onCheckedChange={setStylize} />
              </div>
           </div>
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-5 border-t border-border bg-card mt-auto">
            {error && (
                <div className="mb-4 p-2.5 bg-red-500/10 text-red-600 text-xs font-medium rounded-md flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    {error}
                </div>
            )}
            <Button 
                onClick={handleSubmit} 
                size="lg" 
                className="w-full font-medium shadow-md transition-all active:scale-[0.98]"
            >
                Generate Issue
            </Button>
        </div>
      </div>

      {/* Right Panel: Canvas Area */}
      <div className="flex-1 relative h-[500px] lg:h-full bg-secondary/5 overflow-hidden flex flex-col items-center justify-center p-4 lg:p-10">
         {/* Background Grid */}
         <div className="absolute inset-0 pointer-events-none" style={{ 
             backgroundImage: 'radial-gradient(circle at 1px 1px, var(--tw-colors-border) 1px, transparent 0)', 
             backgroundSize: '40px 40px',
             opacity: 0.4
         }}></div>

         {/* Canvas Wrapper */}
         <div className="relative z-10 w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[50vh] aspect-[3/4] transition-all duration-500 ease-out">
            <div className="w-full h-full bg-card rounded-sm shadow-2xl border border-border/40 overflow-hidden relative ring-1 ring-black/5">
                <ImageUpload onImageUpload={handleImageUpload} initialPreview={image} />
            </div>
            
            {/* Floating Label */}
            <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">Live Canvas</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default CoverForm;