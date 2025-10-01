import React, { useState } from 'react';
import type { Step, RepairRequest, RepairQuote } from './types';
import { generateRepairQuote } from './services/geminiService';
import { useAppContext } from './context/AppContext';

import Stepper from './components/Stepper';
import Step1Device from './components/Step1Device';
import Step2Issue from './components/Step2Issue';
import Step3Contact from './components/Step3Contact';
import Step4Quote from './components/Step4Quote';
import LoadingSpinner from './components/LoadingSpinner';
import { SunIcon, MoonIcon } from './components/IconComponents';

const App: React.FC = () => {
  const { t, language, setLanguage, theme, setTheme, dir } = useAppContext();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [repairRequest, setRepairRequest] = useState<Partial<RepairRequest>>({
    serviceType: 'store_visit', // Default value
  });
  const [repairQuote, setRepairQuote] = useState<RepairQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRepairRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const quote = await generateRepairQuote(repairRequest as RepairRequest, language);
      const newOrderNumber = `RYD-${String(Date.now()).slice(-6)}`;
      setOrderNumber(newOrderNumber);
      setRepairQuote(quote);
      setCurrentStep(4);
    } catch (err) {
      setError(t('error.quoteError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartOver = () => {
    setCurrentStep(1);
    setRepairRequest({ serviceType: 'store_visit' });
    setRepairQuote(null);
    setError(null);
    setOrderNumber(null);
  };

  const renderStep = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    switch (currentStep) {
      case 1:
        return <Step1Device data={repairRequest} onChange={handleChange} onNext={handleNext} />;
      case 2:
        return <Step2Issue data={repairRequest} onChange={handleChange} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3Contact data={repairRequest} onChange={handleChange} onSubmit={handleSubmit} onBack={handleBack} />;
      case 4:
        if (repairQuote && orderNumber) {
          return <Step4Quote quote={repairQuote} request={repairRequest as RepairRequest} orderNumber={orderNumber} />;
        }
        return <div>{t('error.quoteDisplayError')}</div>;
      default:
        return <div>{t('error.unknownStep')}</div>;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 font-sans" dir={dir}>
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex justify-end gap-2 mb-4">
            <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-full bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
             <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="p-2 w-12 text-sm font-semibold rounded-full bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
                aria-label="Switch language"
            >
                {language === 'ar' ? 'EN' : 'AR'}
            </button>
        </div>
      
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('header.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('header.subtitle')}</p>
        </header>

        <main className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 sm:p-8">
          {currentStep < 4 && (
            <div className="mb-8">
              <Stepper currentStep={currentStep} />
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">{t('error.title')}</strong>
              <span className={`block sm:inline ${dir === 'rtl' ? 'ms-2' : 'ml-2'}`}>{error}</span>
            </div>
          )}
          
          {renderStep()}

          {currentStep === 4 && (
            <div className="mt-8 text-center">
                <button
                    onClick={handleStartOver}
                    className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {t('step4.newRequest')}
                </button>
            </div>
          )}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
            <p>
                {t('footer.disclaimer')}
            </p>
            <p className="mt-1">
                {t('footer.copyright').replace('{year}', new Date().getFullYear())}
            </p>
        </footer>
      </div>
    </div>
  );
};

export default App;