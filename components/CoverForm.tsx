import React, { useState, useCallback } from 'react';
import { Preset } from '../types';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import ImageUpload from './ImageUpload';
import { Switch } from './ui/Switch';

interface CoverFormProps {
  preset: Preset;
  onSubmit: (formData: Record<string, string>, image: string, stylize: boolean) => void;
  initialData?: Record<string, string> | null;
  initialImage?: string | null;
  initialStylize?: boolean | null;
}

const CoverForm: React.FC<CoverFormProps> = ({ preset, onSubmit, initialData, initialImage, initialStylize }) => {
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
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold tracking-tight">Your Photo</h3>
              <ImageUpload onImageUpload={handleImageUpload} initialPreview={image} />
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold tracking-tight">Cover Details</h3>
              {preset.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
               <div className="flex items-center space-x-2 pt-4">
                <Switch id="stylize-mode" checked={stylize} onCheckedChange={setStylize} />
                <Label htmlFor="stylize-mode" className="cursor-pointer">
                  <span className="font-semibold">Enable AI Stylizing</span>
                  <p className="text-xs text-muted-foreground">Replaces background and enhances lighting for a pro look.</p>
                </Label>
              </div>
            </div>
            
            <div className="md:col-span-2 text-center mt-4">
                <Button type="submit" size="lg" className="w-full md:w-auto">
                    Generate My Cover
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverForm;
