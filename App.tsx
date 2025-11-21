import React, { useState, useCallback } from 'react';
import { Preset } from './types';
import { PRESETS } from './constants';
import CoverForm from './components/CoverForm';
import ResultViewer from './components/ResultViewer';
import { generateCover } from './services/geminiService';
import { Spinner } from './components/ui/Spinner';
import Hero from './components/Hero';

type AppStep = 'hero' | 'fill_form' | 'generating' | 'show_result' | 'error';

const voguePreset = PRESETS.find(p => p.id === 'vogue');
if (!voguePreset) {
    throw new Error("Vogue preset not found. Please ensure it exists in constants.ts");
}


const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('hero');
  const [selectedPreset] = useState<Preset>(voguePreset);
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
        preset: selectedPreset,
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
              preset={selectedPreset}
              onSubmit={handleFormSubmit}
              initialData={lastFormData}
              initialImage={lastImage}
              initialStylize={lastStylize}
              onCancel={() => setStep('hero')}
            />
        );
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] animate-in fade-in zoom-in duration-500">
            <div className="bg-card p-12 rounded-2xl shadow-2xl border border-border/50 flex flex-col items-center text-center max-w-md">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                 <Spinner className="relative z-10 w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mt-8 tracking-tight">Crafting Your Cover</h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                Our AI Art Director is analyzing your photo, adjusting the lighting, and applying the {selectedPreset.name} style.
              </p>
            </div>
          </div>
        );
      case 'show_result':
        if (generatedImage) {
          return (
             <ResultViewer image={generatedImage} onStartOver={handleStartOver} onEdit={handleEditDetails} />
          );
        }
        return null;
      case 'error':
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="bg-card p-8 rounded-xl border border-destructive/20 shadow-2xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Generation Failed</h2>
                    <p className="text-sm text-muted-foreground mb-8">{errorMessage}</p>
                    <button
                        onClick={handleTryAgain}
                        className="w-full inline-flex items-center justify-center rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
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
            (step === 'fill_form' || step === 'show_result') ? 'flex-1 h-screen flex flex-col overflow-hidden relative' : 
            "flex-1 flex flex-col relative"
        }>
            {renderContent()}
        </main>
    </div>
  );
};

export default App;