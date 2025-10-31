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
          <>
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-3">AI Magazine Cover Generator</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Instantly create a stunning, Vogue-style magazine cover with AI.</p>
            </div>
            <CoverForm
              preset={selectedPreset}
              onSubmit={handleFormSubmit}
              initialData={lastFormData}
              initialImage={lastImage}
              initialStylize={lastStylize}
            />
          </>
        );
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <Spinner />
            <h2 className="text-2xl font-semibold mt-4">Generating Your Cover...</h2>
            <p className="text-muted-foreground mt-2">The AI is working its magic. This may take a moment.</p>
          </div>
        );
      case 'show_result':
        if (generatedImage) {
          return <ResultViewer image={generatedImage} onStartOver={handleStartOver} onEdit={handleEditDetails} />;
        }
        return null;
      case 'error':
        return (
            <div className="flex flex-col items-center justify-center text-center h-full min-h-[400px] bg-card p-8 rounded-lg border border-destructive/50 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-destructive mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-semibold text-destructive mb-2">Generation Failed</h2>
                <p className="text-muted-foreground max-w-md">{errorMessage}</p>
                <button
                    onClick={handleTryAgain}
                    className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    Try Again
                </button>
            </div>
        );
      default:
        return <div>Something went wrong.</div>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background antialiased">
        {step !== 'hero' && <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-secondary/50 to-transparent -z-10" />}
        <main className={step === 'hero' ? '' : "container mx-auto px-4 py-8 md:py-16"}>
            {renderContent()}
        </main>
    </div>
  );
};

export default App;