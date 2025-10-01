import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './IconComponents';
import { useAppContext } from '../context/AppContext';

const LoadingSpinner: React.FC = () => {
    const { t } = useAppContext();
    const loadingMessages: string[] = t('loading.messages');
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [loadingMessages.length]);

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
            <div className="relative flex items-center justify-center w-20 h-20">
                <div className="absolute w-full h-full rounded-full border-4 border-t-blue-500 border-gray-200 dark:border-gray-700 animate-spin"></div>
                <SparklesIcon className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-200">{t('loading.title')}</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 transition-opacity duration-500">{loadingMessages[messageIndex]}</p>
        </div>
    );
};

export default LoadingSpinner;