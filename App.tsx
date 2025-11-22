
import React, { useState, useCallback } from 'react';
import { DesignTemplate } from './types';
import { TEMPLATES } from './constants';
import CoverForm from './components/CoverForm';
import ResultViewer from './components/ResultViewer';
import { generateCover } from './services/geminiService';
import { GeneratingState } from './components/GeneratingState';
import { ErrorState } from './components/ErrorState';
import Hero from './components/Hero';

type AppStep = 'hero' | 'fill_form' | 'generating' | 'show_result' | 'error';

const initialTemplate = TEMPLATES[0]; // Defaults to Vogue

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('hero');
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate>(initialTemplate);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // State to preserve form data for the editing flow
  const [lastFormData, setLastFormData] = useState<Record<string, string> | null>(null);
  const [lastImage, setLastImage] = useState<string | null>(null);
  const [lastStylize, setLastStylize] = useState<boolean>(true);


  const handleFormSubmit = async (formData: Record<string, string>, image: string, stylize: boolean) => {
    setStep('generating');
    setErrorMessage('');
    
    // Save the form state before submitting
    setLastFormData(formData);
    setLastImage(image);
    setLastStylize(stylize);

    try {
      const result = await generateCover({
        template: selectedTemplate,
        formData,
        image,
        stylize,
      });
      setGeneratedImage(result);
      setStep('show_result');
    } catch (error) {
      console.error('Error generating cover:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setErrorMessage(`Failed to generate cover. ${message}. Please try again.`);
      setStep('error');
    }
  };

  const handleStartOver = useCallback(() => {
    setGeneratedImage(null);
    setErrorMessage('');
    // Clear last submission data for a fresh start
    setLastFormData(null);
    setLastImage(null);
    setLastStylize(true);
    setStep('fill_form');
  }, []);
  
  const handleEditDetails = useCallback(() => {
    setStep('fill_form');
  }, []);

  const handleTryAgain = useCallback(() => {
    if (lastFormData && lastImage !== null) {
        handleFormSubmit(lastFormData, lastImage, lastStylize);
    } else {
        setStep('fill_form');
    }
  }, [lastFormData, lastImage, lastStylize]);

  const handleBackToEditor = useCallback(() => {
      setStep('fill_form');
  }, []);

  const handleGetStarted = useCallback(() => {
    setStep('fill_form');
  }, []);

  const renderContent = () => {
    switch (step) {
      case 'hero':
        return <Hero onGetStarted={handleGetStarted} />;
      case 'fill_form':
        return (
            <CoverForm
              template={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              onSubmit={handleFormSubmit}
              initialData={lastFormData}
              initialImage={lastImage}
              initialStylize={lastStylize}
              onCancel={() => setStep('hero')}
            />
        );
      case 'generating':
        return <GeneratingState originalImage={lastImage} />;
      case 'show_result':
        if (generatedImage) {
          return (
             <ResultViewer image={generatedImage} onStartOver={handleStartOver} onEdit={handleEditDetails} />
          );
        }
        return null;
      case 'error':
        return (
            <ErrorState 
                errorMessage={errorMessage} 
                originalImage={lastImage} 
                onTryAgain={handleTryAgain} 
                onBack={handleBackToEditor}
            />
        );
      default:
        return <div>Something went wrong.</div>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground antialiased font-sans flex flex-col overflow-hidden">
        {step === 'hero' && (
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />
          </div>
        )}
        <main className={
            step === 'hero' ? 'flex-1 relative' : 
            "flex-1 h-screen flex flex-col overflow-hidden relative"
        }>
            {renderContent()}
        </main>
    </div>
  );
};

export default App;
