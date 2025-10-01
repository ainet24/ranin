import React from 'react';
import type { RepairRequest } from '../types';
import { MobileIcon, ArrowLeftIcon } from './IconComponents';
import { DEVICE_DATA } from '../data/deviceData';
import { useAppContext } from '../context/AppContext';

interface Props {
  data: Partial<RepairRequest>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNext: () => void;
}

const manufacturers = Object.keys(DEVICE_DATA);

const Step1Device: React.FC<Props> = ({ data, onChange, onNext }) => {
  const { t } = useAppContext();
  const manufacturerTranslations: { [key: string]: string } = t('manufacturers');
  const canProceed = data.manufacturer && data.model && data.model.trim() !== '';
  const isOtherSelected = data.manufacturer === 'Other';

  const handleManufacturerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
    const resetEvent = {
      target: {
        name: 'model',
        value: '',
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(resetEvent);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-2">
        <MobileIcon className="w-6 h-6 text-blue-600" />
        {t('step1.title')}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('step1.subtitle')}</p>
      <div className="space-y-4">
        <div>
          <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('step1.manufacturer')}</label>
          <select
            name="manufacturer"
            id="manufacturer"
            value={data.manufacturer || ''}
            onChange={handleManufacturerChange}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>{t('step1.manufacturerPlaceholder')}</option>
            {manufacturers.map(m => (
                <option key={m} value={m}>{manufacturerTranslations[m] || m}</option>
            ))}
          </select>
        </div>
        
        {isOtherSelected ? (
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('step1.otherModel')}</label>
            <input
              type="text"
              name="model"
              id="model"
              value={data.model || ''}
              onChange={onChange}
              placeholder={t('step1.otherModelPlaceholder')}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('step1.model')}</label>
            <select
              name="model"
              id="model"
              value={data.model || ''}
              onChange={onChange}
              disabled={!data.manufacturer}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
            >
              <option value="" disabled>
                {data.manufacturer ? t('step1.modelPlaceholder') : t('step1.modelPlaceholderDisabled')}
              </option>
              {data.manufacturer && DEVICE_DATA[data.manufacturer]?.map(m => (
                  <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="mt-8 flex justify-end">
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

export default Step1Device;