import React from 'react';
import type { RepairQuote, RepairRequest } from '../types';
import { CheckCircleIcon, HashtagIcon, Cog8ToothIcon, UserCircleIcon } from './IconComponents';
import { useAppContext } from '../context/AppContext';

interface Props {
  quote: RepairQuote;
  request: RepairRequest;
  orderNumber: string;
}

const Step4Quote: React.FC<Props> = ({ quote, request, orderNumber }) => {
  const { t, dir } = useAppContext();

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">{t('step4.successTitle')}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{t('step4.successSubtitle')}</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 text-sm font-semibold px-3 py-1.5 rounded-full">
          <HashtagIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          {t('step4.orderNumber')} {orderNumber}
        </div>
      </div>
      
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 space-y-6 bg-white dark:bg-slate-800">
        
        {/* User and Device Info */}
        <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
              <UserCircleIcon className="w-6 h-6 text-purple-600" />
              {t('step4.summaryTitle')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-900 dark:text-gray-200">
              <div><strong className="font-semibold text-gray-600 dark:text-gray-400">{t('step4.name')}</strong> {request.name}</div>
              <div><strong className="font-semibold text-gray-600 dark:text-gray-400">{t('step4.phone')}</strong> {request.phone}</div>
              <div><strong className="font-semibold text-gray-600 dark:text-gray-400">{t('step4.device')}</strong> {request.manufacturer} {request.model}</div>
              <div><strong className="font-semibold text-gray-600 dark:text-gray-400">{t('step4.issue')}</strong> {request.issue}</div>
               {request.serviceType === 'pickup' && (
                <div className="sm:col-span-2"><strong className="font-semibold text-gray-600 dark:text-gray-400">{t('step4.address')}</strong> {request.streetAddress}</div>
              )}
            </div>
        </div>

        {/* Technical Diagnostics */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
              <Cog8ToothIcon className="w-6 h-6 text-blue-600" />
              {t('step4.diagnosisTitle')}
          </h3>
          <div className="space-y-4 text-sm">
              <div>
                  <h4 className="font-bold text-gray-700 dark:text-gray-300">{t('step4.estimatedTime')}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{quote.estimatedTime}</p>
              </div>
              <div>
                  <h4 className="font-bold text-gray-700 dark:text-gray-300">{t('step4.potentialParts')}</h4>
                  {quote.requiredParts && quote.requiredParts.length > 0 ? (
                    <ul className="list-disc list-inside mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                        {quote.requiredParts.map((part, index) => (
                            <li key={index}>{part}</li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{t('step4.noParts')}</p>
                  )}
              </div>
              <div>
                  <h4 className="font-bold text-gray-700 dark:text-gray-300">{t('step4.notes')}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">{quote.notes}</p>
              </div>
          </div>
        </div>
      </div>

      <div className={`mt-6 bg-yellow-50 dark:bg-yellow-900/40 p-4 rounded-lg ${dir === 'rtl' ? 'border-r-4 border-yellow-400' : 'border-l-4 border-yellow-400'}`}>
          <div className="flex">
              <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
              </div>
              <div className={dir === 'rtl' ? 'ms-3' : 'ml-3'}>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">
                      <strong className="font-bold">{t('step4.importantNote')}</strong> {t('step4.noteText')}
                      <span className="block mt-1">{t('step4.followUp')}</span>
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Step4Quote;