import React from 'react';
import type { RepairRequest } from '../types';
import { WrenchScrewdriverIcon, ArrowLeftIcon, ArrowRightIcon } from './IconComponents';
import { useAppContext } from '../context/AppContext';

interface Props {
  data: Partial<RepairRequest>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2Issue: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  const { t } = useAppContext();
  const commonIssues: string[] = t('step2.commonIssues');
  const softwareIssues: string[] = t('step2.softwareIssues');
  const issuePlaceholders: { [key: string]: string } = t('step2.issuePlaceholders');
  
  const isSoftwareIssueSelected = data.issue === commonIssues[9]; // 'مشكلة في السوفتوير (النظام)' / 'Software issue'
  const isOtherMainIssueSelected = data.issue === commonIssues[10]; // 'أخرى (يرجى التوضيح في الوصف)' / 'Other...'
  const isOtherSoftwareIssueSelected = data.softwareIssue === softwareIssues[5]; // 'أخرى (يرجى التوضيح في الوصف)' / 'Other...'

  const canProceed = (() => {
    if (!data.issue) return false;
    if (isOtherMainIssueSelected) {
      return !!data.issueDescription?.trim();
    }
    if (isSoftwareIssueSelected) {
      if (!data.softwareIssue) return false;
      if (isOtherSoftwareIssueSelected) {
        return !!data.issueDescription?.trim();
      }
      return true;
    }
    return true;
  })();

  const handleIssueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e); 
    if (e.target.value !== commonIssues[9]) {
      const resetEvent = {
        target: { name: 'softwareIssue', value: '' },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(resetEvent);
    }
  };

  const isDescriptionRequired = isOtherMainIssueSelected || isOtherSoftwareIssueSelected;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-2">
        <WrenchScrewdriverIcon className="w-6 h-6 text-green-600" />
        {t('step2.title')}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('step2.subtitle')}</p>
      <div className="space-y-4">
        <div>
          <label htmlFor="issue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('step2.mainIssue')}</label>
          <select
            name="issue"
            id="issue"
            value={data.issue || ''}
            onChange={handleIssueChange}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>{t('step2.mainIssuePlaceholder')}</option>
            {commonIssues.map(issue => (
                <option key={issue} value={issue}>{issue}</option>
            ))}
          </select>
        </div>
        
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSoftwareIssueSelected ? 'max-h-96' : 'max-h-0'}`}>
          <div className={`${isSoftwareIssueSelected ? 'mt-4' : ''}`}>
            <label htmlFor="softwareIssue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('step2.softwareIssue')}
            </label>
            <select
              name="softwareIssue"
              id="softwareIssue"
              value={data.softwareIssue || ''}
              onChange={onChange}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="" disabled>{t('step2.softwareIssuePlaceholder')}</option>
              {softwareIssues.map(issue => (
                  <option key={issue} value={issue}>{issue}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('step2.description')}{' '}
            {isDescriptionRequired ? 
                <span className="text-red-500 font-bold">{t('step2.descriptionRequired')}</span> : 
                <span className="dark:text-gray-400">{t('step2.descriptionOptional')}</span>
            }
          </label>
          <textarea
            name="issueDescription"
            id="issueDescription"
            rows={4}
            value={data.issueDescription || ''}
            onChange={onChange}
            placeholder={issuePlaceholders[data.issue || ''] || t('step2.descriptionPlaceholder')}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-500 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowRightIcon className="w-5 h-5" />
          {t('buttons.back')}
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="inline-flex items-center gap-2 px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {t('buttons.next')}
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Step2Issue;