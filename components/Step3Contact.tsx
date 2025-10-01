import React, { useState } from 'react';
import type { RepairRequest } from '../types';
import { UserCircleIcon, ArrowLeftIcon, ArrowRightIcon, BuildingStorefrontIcon, TruckIcon, PaperAirplaneIcon, MapPinIcon, ArrowTopRightOnSquareIcon } from './IconComponents';
import { useAppContext } from '../context/AppContext';

interface Props {
  data: Partial<RepairRequest>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s]+$/;
const SAUDI_PHONE_REGEX = /^05\d{8}$/;


const Step3Contact: React.FC<Props> = ({ data, onChange, onSubmit, onBack }) => {
  const { t, dir } = useAppContext();
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean }>({});

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const isPickup = data.serviceType === 'pickup';
  const isStoreVisit = data.serviceType === 'store_visit';

  const nameError = touched.name && (!data.name || !NAME_REGEX.test(data.name));
  const phoneError = touched.phone && (!data.phone || !SAUDI_PHONE_REGEX.test(data.phone));

  const getNameErrorMessage = () => {
    if (!data.name) return t('step3.nameRequired');
    if (!NAME_REGEX.test(data.name)) return t('step3.nameInvalid');
    return '';
  };

  const getPhoneErrorMessage = () => {
    if (!data.phone) return t('step3.phoneRequired');
    if (!SAUDI_PHONE_REGEX.test(data.phone)) return t('step3.phoneInvalid');
    return '';
  };

  const isFormValid =
    data.name && NAME_REGEX.test(data.name) &&
    data.phone && SAUDI_PHONE_REGEX.test(data.phone) &&
    (!isPickup || (isPickup && data.streetAddress));


  return (
    <div className="animate-fade-in">
       <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-2">
          <UserCircleIcon className="w-6 h-6 text-purple-600" />
          {t('step3.title')}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('step3.subtitle')}</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('step3.serviceMethod')}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <label htmlFor="service_type_store" className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${isStoreVisit ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-500 ring-2 ring-blue-500' : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
              <div className="flex items-center gap-3">
                <BuildingStorefrontIcon className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{t('step3.storeVisit')}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t('step3.storeVisitDesc')}</p>
              <input type="radio" id="service_type_store" name="serviceType" value="store_visit" checked={isStoreVisit} onChange={onChange} className="absolute h-0 w-0 appearance-none" />
            </label>

            <label htmlFor="service_type_pickup" className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${isPickup ? 'bg-teal-50 dark:bg-teal-900/50 border-teal-500 ring-2 ring-teal-500' : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
              <div className="flex items-center gap-3">
                <TruckIcon className="w-6 h-6 text-teal-600" />
                <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{t('step3.pickup')}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t('step3.pickupDesc')}</p>
               <input type="radio" id="service_type_pickup" name="serviceType" value="pickup" checked={isPickup} onChange={onChange} className="absolute h-0 w-0 appearance-none" />
            </label>
          </div>
        </div>

        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isStoreVisit ? 'max-h-[500px] pt-0' : 'max-h-0 pt-0'}`}>
            <div className="bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 space-y-4">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <BuildingStorefrontIcon className="w-5 h-5 text-blue-600" />
                  {t('step3.storeInfo')}
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{t('step3.storeName')}</span> {t('header.title')}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                      <span className="font-semibold">{t('step3.storeAddress')}</span> {t('step3.storeAddressValue')}
                      <a 
                          href="https://www.google.com/maps/search/?api=1&query=مجمع+اتصالات+الروضة+الرياض" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline text-xs ${dir === 'rtl' ? 'ms-2' : 'ml-2'}`}
                      >
                          {t('step3.viewOnMap')}
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                      </a>
                  </div>
              </div>
              <div className="overflow-hidden rounded-md border border-gray-300 dark:border-gray-600 aspect-w-16 aspect-h-9">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.518621471714!2d46.77258387590689!3d24.743400749454173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2efd9782821b01%3A0xb3e742e88a38a716!2z2YXYs9iq2LfYudipINmE2YTYs9mB2KfYsdiqINin2YTZgdmD2YTYp9mGINin2YTZhdmG2K_ZgA!5e0!3m2!1sen!2ssa!4v1720875887208!5m2!1sen!2ssa"
                      className="w-full h-full"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="موقع المحل على الخريطة"
                  ></iframe>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('step3.fullName')}</label>
            <input type="text" name="name" id="name" value={data.name || ''} onChange={onChange} onBlur={handleBlur} autoComplete="name" className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
            {nameError && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{getNameErrorMessage()}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('step3.mobileNumber')}</label>
            <input type="tel" name="phone" id="phone" value={data.phone || ''} onChange={onChange} onBlur={handleBlur} autoComplete="tel" className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
            {phoneError && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{getPhoneErrorMessage()}</p>}
          </div>
        </div>
        
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isPickup ? 'max-h-96' : 'max-h-0'}`}>
          <div className={`${isPickup ? 'mt-0' : '-mt-6'}`}>
            <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('step3.addressInRiyadh')}</label>
            <textarea name="streetAddress" id="streetAddress" rows={3} value={data.streetAddress || ''} onChange={onChange} disabled={!isPickup} autoComplete="street-address" placeholder={t('step3.addressPlaceholder')} className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('step3.addressNote')}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="inline-flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-500 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <ArrowRightIcon className="w-5 h-5" />
          {t('buttons.back')}
        </button>
        <button onClick={onSubmit} disabled={!isFormValid} className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {t('step3.submit')}
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Step3Contact;