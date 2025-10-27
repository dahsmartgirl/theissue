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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image.');
      return;
    }
    setError('');
    onSubmit(formData, image, stylize);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">1. Fill in the Text</h3>
              {preset.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="font-semibold">{field.label}</Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}
            </div>
            <div className="space-y-8">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">2. Upload Your Photo</h3>
                    <ImageUpload onImageUpload={setImage} initialPreview={image} />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">3. AI Stylization</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="stylize" className="flex flex-col space-y-1">
                      <span className="font-semibold">AI Enhance Background</span>
                      <span className="text-sm text-muted-foreground">Let AI beautify the background to fit the vibe.</span>
                    </Label>
                    <Switch id="stylize" checked={stylize} onCheckedChange={setStylize} />
                  </div>
                </div>
            </div>

            <div className="md:col-span-2 pt-4">
                {error && <p className="text-destructive text-sm mb-4 text-center">{error}</p>}
                <Button type="submit" size="lg" className="w-full text-base font-semibold">
                    Generate Cover
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverForm;