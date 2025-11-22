
import React, { useState, useCallback, useEffect } from 'react';
import { DesignTemplate, TemplateInput } from '../types';
import { TEMPLATES } from '../constants';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Button } from './ui/Button';
import ImageUpload from './ImageUpload';
import { Switch } from './ui/Switch';
import { CanvasTopBar } from './CanvasTopBar';

interface CoverFormProps {
  template: DesignTemplate;
  onTemplateChange: (template: DesignTemplate) => void;
  onSubmit: (formData: Record<string, string>, image: string, stylize: boolean) => void;
  onCancel: () => void;
  initialData?: Record<string, string> | null;
  initialImage?: string | null;
  initialStylize?: boolean | null;
}

const CoverForm: React.FC<CoverFormProps> = ({ 
  template, 
  onTemplateChange, 
  onSubmit, 
  onCancel, 
  initialData, 
  initialImage, 
  initialStylize 
}) => {
  
  // Helper to generate initial form state from template inputs
  const getInitialState = (tmpl: DesignTemplate) => {
    return tmpl.inputs.reduce((acc, field) => {
      acc[field.id] = field.defaultValue || (field.options ? field.options[0] : '');
      return acc;
    }, {} as Record<string, string>);
  };

  const [formData, setFormData] = useState<Record<string, string>>(initialData || getInitialState(template));
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [stylize, setStylize] = useState(initialStylize ?? true);
  const [error, setError] = useState('');

  // Reset form when template changes (unless using initialData)
  useEffect(() => {
    if (!initialData) {
        setFormData(getInitialState(template));
    }
  }, [template.id, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const newTemplate = TEMPLATES.find(t => t.id === selectedId);
    if (newTemplate) {
        onTemplateChange(newTemplate);
    }
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

  // Helper to render dynamic fields
  const renderField = (field: TemplateInput) => {
    if (field.type === 'color') {
        return (
            <div className="flex items-center gap-2">
                <Input
                    id={field.id}
                    name={field.id}
                    type="color"
                    value={formData[field.id] || '#000000'}
                    onChange={handleInputChange}
                    className="h-9 w-14 p-1 cursor-pointer"
                />
                <span className="text-xs text-muted-foreground font-mono">{formData[field.id]}</span>
            </div>
        );
    }

    if (field.type === 'select' && field.options) {
        return (
            <div className="relative">
                <select
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || field.options[0]}
                    onChange={handleInputChange}
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                >
                    {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
        );
    }
    
    if (field.type === 'textarea') {
        return (
            <textarea
                id={field.id}
                name={field.id}
                value={formData[field.id] || ''}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
        );
    }

    return (
        <Input
            id={field.id}
            name={field.id}
            type={field.type === 'number' ? 'number' : 'text'}
            value={formData[field.id] || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            className="h-9 text-sm bg-background border-input/60 focus:border-primary/60 transition-all"
        />
    );
  };

  // Calculate dynamic styles for the canvas based on aspect ratio
  const getCanvasStyle = () => {
    // Parse string like "3/4" or "16/9"
    const [w, h] = template.aspectRatio.split('/').map(Number);
    const ratio = w / h;
    
    // Base style
    const style: React.CSSProperties = {
        aspectRatio: template.aspectRatio,
    };
    return style;
  };
  
  // Determine max width class based on ratio
  const getMaxWidthClass = () => {
    const [w, h] = template.aspectRatio.split('/').map(Number);
    if (w > h) return 'max-w-[90%] lg:max-w-[600px]'; // Wide
    if (w === h) return 'max-w-[400px] lg:max-w-[450px]'; // Square
    return 'max-w-[320px] sm:max-w-[400px] lg:max-w-[50vh]'; // Tall
  };

  return (
    <div className="flex h-full w-full flex-col lg:flex-row overflow-hidden bg-background">
      
      {/* Left Panel: Sidebar Configuration */}
      <div className="w-full lg:w-[360px] xl:w-[400px] flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-card z-20 shadow-sm lg:shadow-none flex-shrink-0 h-auto lg:h-full">
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-border flex flex-col gap-3 bg-card">
           <div className="flex items-center justify-between">
                <button onClick={onCancel} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Home
                </button>
           </div>
           
           <div className="space-y-1">
               <Label htmlFor="template-select" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Template Type</Label>
               <div className="relative">
                   <select 
                        id="template-select"
                        value={template.id}
                        onChange={handleTemplateSelect}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                   >
                        <optgroup label="Magazines">
                            {TEMPLATES.filter(t => t.category === 'magazine').map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </optgroup>
                        <optgroup label="Social Media">
                            {TEMPLATES.filter(t => t.category === 'social').map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </optgroup>
                   </select>
                   <div className="absolute right-3 top-3 pointer-events-none opacity-50">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                   </div>
               </div>
               <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
           {/* Section 1: Dynamic Inputs */}
           <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Content Details</h3>
              <div className="space-y-4">
                {template.inputs.map((field) => (
                    <div key={field.id} className="space-y-1.5">
                        <Label htmlFor={field.id} className="text-xs font-medium text-foreground/80">
                            {field.label}
                        </Label>
                        {renderField(field)}
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
                    <p className="text-xs text-muted-foreground">Enhance lighting & assets</p>
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
                Generate Design
            </Button>
        </div>
      </div>

      {/* Right Panel: Canvas Area */}
      <div className="flex-1 relative h-[500px] lg:h-full bg-secondary/5 overflow-hidden flex flex-col items-center justify-center p-4 lg:p-10">
         <CanvasTopBar />

         {/* Background Grid */}
         <div className="absolute inset-0 pointer-events-none" style={{ 
             backgroundImage: 'radial-gradient(circle at 1px 1px, var(--tw-colors-border) 1px, transparent 0)', 
             backgroundSize: '40px 40px',
             opacity: 0.4
         }}></div>

         {/* Canvas Wrapper - Dynamic Sizing */}
         <div 
            className={`relative z-10 w-full transition-all duration-500 ease-out ${getMaxWidthClass()}`}
            style={getCanvasStyle()}
         >
            <div className="w-full h-full bg-card rounded-sm shadow-2xl border border-border/40 overflow-hidden relative ring-1 ring-black/5">
                <ImageUpload onImageUpload={handleImageUpload} initialPreview={image} />
            </div>
            
            {/* Floating Label */}
            <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">
                    Live Canvas ({template.category} - {template.aspectRatio})
                </span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default CoverForm;
