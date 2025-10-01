import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

type Language = 'ar' | 'en';
type Theme = 'light' | 'dark';

interface AppContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    t: (key: string) => any;
    dir: 'rtl' | 'ltr';
}

const translations = {
    en: {
        header: {
            title: "Raneen Telecom Center for Mobile Maintenance",
            subtitle: "Instant diagnosis for mobile issues and repair requests in Riyadh",
        },
        manufacturers: {
            "Apple": "Apple",
            "Samsung": "Samsung",
            "Google": "Google",
            "Huawei": "Huawei",
            "Xiaomi": "Xiaomi",
            "OnePlus": "OnePlus",
            "Oppo": "Oppo",
            "Honor": "Honor",
            "Vivo": "Vivo",
            "Realme": "Realme",
            "Other": "Other",
        },
        stepper: {
            step1: "Device Info",
            step2: "Issue Description",
            step3: "Contact Info",
        },
        step1: {
            title: "Device Information",
            subtitle: "Please select the manufacturer and model of your phone.",
            manufacturer: "Manufacturer",
            manufacturerPlaceholder: "-- Select Manufacturer --",
            model: "Model",
            modelPlaceholder: "-- Select Model --",
            modelPlaceholderDisabled: "-- Select Manufacturer First --",
            otherModel: "Device Model",
            otherModelPlaceholder: "e.g., Sony Xperia 1 VI",
        },
        step2: {
            title: "Issue Description",
            subtitle: "The more details, the more accurate the diagnosis.",
            mainIssue: "Main Issue",
            mainIssuePlaceholder: "-- Select the main issue --",
            softwareIssue: "Specify Software Problem",
            softwareIssuePlaceholder: "-- Select the sub-issue --",
            description: "Additional description of the problem",
            descriptionOptional: "(Optional)",
            descriptionRequired: "(Required)",
            descriptionPlaceholder: "Please describe the issue in more detail to help us with an accurate diagnosis.",
            commonIssues: [
                'Screen is broken or not working',
                'Battery issue (not charging or drains quickly)',
                'Device is completely dead',
                'Charging port damage',
                'Camera issue (front or back)',
                'Liquid damage',
                'Sound issue (earpiece or microphone)',
                'Button issue (power or volume)',
                'Network or Wi-Fi problems',
                'Software issue',
                'Other (please specify in description)',
            ],
            softwareIssues: [
                'Device is freezing or very slow',
                'Device restarts randomly',
                'Specific apps crash or close unexpectedly',
                'Problems with updates or the OS',
                'Device is stuck on the manufacturer logo',
                'Other (please specify in description)',
            ],
            issuePlaceholders: {
                'Screen is broken or not working': 'e.g., There are colored lines on the screen, half of the screen is black, or the touch is not responsive.',
                'Battery issue (not charging or drains quickly)': 'e.g., The device only charges in a certain position, or the battery percentage drops by 20% suddenly.',
                'Device is completely dead': 'e.g., The device does not respond at all when pressing the power button, even when connected to the charger.',
                'Charging port damage': 'e.g., The charger needs to be wiggled to start charging, or the port looks corroded.',
                'Camera issue (front or back)': 'e.g., The picture is blurry, or the camera app closes suddenly.',
                'Liquid damage': 'e.g., The device fell into water. Please mention the type of liquid (water, juice...).',
                'Sound issue (earpiece or microphone)': 'e.g., I can\'t hear the other person in calls, or the other person can\'t hear me.',
                'Button issue (power or volume)': 'e.g., The volume up button is not working, or the power button is stiff and hard to press.',
                'Network or Wi-Fi problems': 'e.g., The Wi-Fi signal is very weak, or the device does not connect to mobile data.',
                'Software issue': 'Please select the sub-issue from the list below and provide an additional description if necessary.',
                'Other (please specify in description)': 'Please provide a detailed description of the problem you are facing here.',
            }
        },
        step3: {
            title: "Contact & Service Info",
            subtitle: "We'll use this information to contact you and coordinate the device pickup.",
            serviceMethod: "Choose Service Method",
            storeVisit: "Visit the Store",
            storeVisitDesc: "I will bring my device to the maintenance center myself.",
            pickup: "Pickup & Delivery",
            pickupDesc: "Pick up the device from your location and return it after repair.",
            storeInfo: "Our Location Information",
            storeName: "Store Name:",
            storeAddress: "Address:",
            storeAddressValue: "Ar Rawdah Communications Complex, Riyadh",
            viewOnMap: "(View on Map)",
            fullName: "Full Name",
            mobileNumber: "Mobile Number",
            addressInRiyadh: "Address in Riyadh",
            addressPlaceholder: "Neighborhood, street name, building number, or map location link",
            addressNote: "This field is only required for the pickup and delivery service.",
            nameRequired: "Full name is required.",
            nameInvalid: "Name must contain only letters and spaces.",
            phoneRequired: "Mobile number is required.",
            phoneInvalid: "Please enter a valid Saudi mobile number (e.g., 0512345678).",
            submit: "Submit Request",
        },
        step4: {
            successTitle: "Your request has been received successfully!",
            successSubtitle: "This is the preliminary technical diagnosis for your device's issue.",
            orderNumber: "Order Number:",
            summaryTitle: "Request Summary",
            name: "Name:",
            phone: "Phone:",
            device: "Device:",
            issue: "Issue:",
            address: "Address:",
            diagnosisTitle: "Preliminary Technical Diagnosis",
            estimatedTime: "Estimated Repair Time:",
            potentialParts: "Potential Parts Required:",
            noParts: "No specific parts identified based on the current description.",
            notes: "Technical Notes & Diagnosis:",
            importantNote: "Important Note:",
            noteText: "This report is a preliminary diagnosis based on your description. The final diagnosis and repair cost will be confirmed after inspecting the device at our center.",
            followUp: "We will contact you shortly to confirm your request. Please keep the order number for follow-up.",
            newRequest: "Start New Request",
        },
        loading: {
            title: "Just a moment...",
            messages: [
                "Analyzing the issue...",
                "Checking fault database...",
                "Identifying potential parts...",
                "Estimating labor time...",
                "Preparing technical report...",
            ],
        },
        error: {
            title: "Error!",
            quoteError: "An error occurred while generating the technical report. Please try again.",
            quoteDisplayError: "An error occurred while displaying the diagnosis. Please start over.",
            unknownStep: "Unknown Step",
        },
        buttons: {
            next: "Next",
            back: "Back",
        },
        footer: {
            disclaimer: "This is a preliminary diagnosis and may differ after the actual inspection. Final prices are determined at the center.",
            copyright: "© {year} Raneen Telecom Center for Mobile Maintenance.",
        }
    },
    ar: {
        header: {
            title: "مركز رنين للإتصالات لصيانة الجوال",
            subtitle: "تشخيص فوري لمشاكل الجوالات وطلب الإصلاح في مدينة الرياض",
        },
        manufacturers: {
            "Apple": "Apple",
            "Samsung": "سامسونج",
            "Google": "جوجل",
            "Huawei": "هواوي",
            "Xiaomi": "شاومي",
            "OnePlus": "ون بلس",
            "Oppo": "أوبو",
            "Honor": "هونر",
            "Vivo": "فيفو",
            "Realme": "ريلمي",
            "Other": "أخرى",
        },
        stepper: {
            step1: "معلومات الجهاز",
            step2: "وصف المشكلة",
            step3: "بيانات التواصل",
        },
        step1: {
            title: "معلومات الجهاز",
            subtitle: "يرجى اختيار الشركة المصنعة والموديل لهاتفك.",
            manufacturer: "الشركة المصنعة",
            manufacturerPlaceholder: "-- اختر الشركة المصنعة --",
            model: "الموديل",
            modelPlaceholder: "-- اختر الموديل --",
            modelPlaceholderDisabled: "-- اختر الشركة المصنعة أولاً --",
            otherModel: "موديل الجهاز",
            otherModelPlaceholder: "مثال: Sony Xperia 1 VI",
        },
        step2: {
            title: "وصف المشكلة",
            subtitle: "كلما كانت التفاصيل أكثر، كان التشخيص أدق.",
            mainIssue: "المشكلة الرئيسية",
            mainIssuePlaceholder: "-- اختر المشكلة الرئيسية --",
            softwareIssue: "حدد مشكلة السوفتوير",
            softwareIssuePlaceholder: "-- اختر المشكلة الفرعية --",
            description: "وصف إضافي للمشكلة",
            descriptionOptional: "(اختياري)",
            descriptionRequired: "(مطلوب)",
            descriptionPlaceholder: "يرجى وصف المشكلة بتفصيل أكثر لمساعدتنا على التشخيص الدقيق.",
            commonIssues: [
                'الشاشة مكسورة أو لا تعمل',
                'مشكلة في البطارية (لا تشحن أو تفرغ بسرعة)',
                'الجهاز لا يعمل إطلاقاً',
                'تلف منفذ الشحن',
                'مشكلة في الكاميرا (أمامية أو خلفية)',
                'تلف بسبب سائل',
                'مشكلة في الصوت (سماعة أو مايكروفون)',
                'مشكلة في الأزرار (زر التشغيل أو الصوت)',
                'مشاكل في الشبكة أو الواي فاي',
                'مشكلة في السوفتوير (النظام)',
                'أخرى (يرجى التوضيح في الوصف)',
            ],
            softwareIssues: [
                'الجهاز يعلق أو بطيء جداً',
                'الجهاز يعيد التشغيل بشكل عشوائي',
                'تطبيقات معينة لا تعمل أو تغلق فجأة',
                'مشاكل في التحديثات أو النظام',
                'الجهاز عالق على شعار الشركة المصنعة',
                'أخرى (يرجى التوضيح في الوصف)',
            ],
            issuePlaceholders: {
                'الشاشة مكسورة أو لا تعمل': 'مثال: توجد خطوط ملونة على الشاشة، أو نصف الشاشة أسود، أو اللمس لا يعمل.',
                'مشكلة في البطارية (لا تشحن أو تفرغ بسرعة)': 'مثال: الجهاز لا يشحن إلا في وضع معين، أو نسبة البطارية تنخفض 20% فجأة.',
                'الجهاز لا يعمل إطلاقاً': 'مثال: الجهاز لا يستجيب عند الضغط على زر التشغيل نهائياً، حتى عند توصيله بالشاحن.',
                'تلف منفذ الشحن': 'مثال: يجب تحريك الشاحن لكي يبدأ الشحن، أو المنفذ يبدو متآكلاً.',
                'مشكلة في الكاميرا (أمامية أو خلفية)': 'مثال: الصورة ضبابية، أو تطبيق الكاميرا يغلق فجأة.',
                'تلف بسبب سائل': 'مثال: سقط الجهاز في الماء، يرجى ذكر نوع السائل (ماء، عصير...).',
                'مشكلة في الصوت (سماعة أو مايكروفون)': 'مثال: لا أسمع الطرف الآخر في المكالمات، أو الطرف الآخر لا يسمعني.',
                'مشكلة في الأزرار (زر التشغيل أو الصوت)': 'مثال: زر رفع الصوت لا يعمل، أو زر التشغيل صلب وصعب الضغط عليه.',
                'مشاكل في الشبكة أو الواي فاي': 'مثال: إشارة الواي فاي ضعيفة جداً، أو الجهاز لا يتصل ببيانات الجوال.',
                'مشكلة في السوفتوير (النظام)': 'يرجى تحديد المشكلة الفرعية من القائمة أدناه وتقديم وصف إضافي إذا لزم الأمر.',
                'أخرى (يرجى التوضيح في الوصف)': 'يرجى تقديم وصف تفصيلي للمشكلة التي تواجهها هنا.',
            }
        },
        step3: {
            title: "بيانات التواصل والخدمة",
            subtitle: "سنستخدم هذه البيانات للتواصل معك وتنسيق عملية استلام الجهاز.",
            serviceMethod: "اختر طريقة الخدمة",
            storeVisit: "زيارة المحل",
            storeVisitDesc: "سأقوم بإحضار جهازي إلى مركز الصيانة بنفسي.",
            pickup: "استلام وتوصيل",
            pickupDesc: "استلام الجهاز من موقعك وإعادته بعد الإصلاح.",
            storeInfo: "معلومات موقعنا",
            storeName: "اسم المحل:",
            storeAddress: "العنوان:",
            storeAddressValue: "مجمع اتصالات الروضة، الرياض",
            viewOnMap: "(عرض على الخريطة)",
            fullName: "الاسم الكامل",
            mobileNumber: "رقم الجوال",
            addressInRiyadh: "العنوان في مدينة الرياض",
            addressPlaceholder: "الحي، اسم الشارع، رقم المبنى، أو رابط الموقع على الخريطة",
            addressNote: "هذا الحقل مطلوب فقط لخدمة الاستلام والتوصيل.",
            nameRequired: "الاسم الكامل مطلوب.",
            nameInvalid: "الاسم يجب أن يحتوي على حروف ومسافات فقط.",
            phoneRequired: "رقم الجوال مطلوب.",
            phoneInvalid: "الرجاء إدخال رقم جوال سعودي صالح (مثال: 0512345678).",
            submit: "إرسال الطلب",
        },
        step4: {
            successTitle: "تم استلام طلبك بنجاح!",
            successSubtitle: "هذا هو التشخيص الفني المبدئي لمشكلة جهازك.",
            orderNumber: "رقم الطلب:",
            summaryTitle: "ملخص الطلب",
            name: "الاسم:",
            phone: "الجوال:",
            device: "الجهاز:",
            issue: "المشكلة:",
            address: "العنوان:",
            diagnosisTitle: "التشخيص الفني المبدئي",
            estimatedTime: "الوقت التقديري للإصلاح:",
            potentialParts: "قطع الغيار المحتملة:",
            noParts: "لا توجد قطع غيار محددة بناءً على الوصف الحالي.",
            notes: "ملاحظات فنية وتشخيص:",
            importantNote: "ملاحظة هامة:",
            noteText: "هذا التقرير هو تشخيص مبدئي بناءً على وصفك. سيتم تأكيد التشخيص النهائي وتكلفة الإصلاح بعد فحص الجهاز في مركزنا.",
            followUp: "سنتواصل معك قريباً لتأكيد طلبك. يرجى الاحتفاظ بـ رقم الطلب لاستخدامه عند المتابعة.",
            newRequest: "بدء طلب جديد",
        },
        loading: {
            title: "لحظات من فضلك...",
            messages: [
                "جاري تحليل المشكلة...",
                "فحص قاعدة بيانات الأعطال...",
                "تحديد قطع الغيار المحتملة...",
                "تقدير وقت العمل...",
                "إعداد التقرير الفني...",
            ],
        },
        error: {
            title: "خطأ!",
            quoteError: "حدث خطأ أثناء إنشاء التقرير الفني. يرجى المحاولة مرة أخرى.",
            quoteDisplayError: "حدث خطأ أثناء عرض التشخيص. يرجى البدء من جديد.",
            unknownStep: "خطوة غير معروفة",
        },
        buttons: {
            next: "التالي",
            back: "السابق",
        },
        footer: {
            disclaimer: "هذا التشخيص مبدئي وقد يختلف بعد الفحص الفعلي. الأسعار النهائية تحدد في المركز.",
            copyright: "© {year} مركز رنين للإتصالات لصيانة الجوال.",
        }
    }
};

const get = (obj: any, path: string) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('ar');
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = window.localStorage.getItem('theme') as Theme;
            if (storedTheme) return storedTheme;
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);
    
    const t = (key: string) => {
        return get(translations[language], key) || key;
    };
    
    const dir = useMemo(() => (language === 'ar' ? 'rtl' : 'ltr'), [language]);

    return (
        <AppContext.Provider value={{ language, setLanguage, theme, setTheme, t, dir }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};