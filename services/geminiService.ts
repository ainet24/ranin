import { GoogleGenAI, Type } from "@google/genai";
import type { RepairRequest, RepairQuote } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    estimatedTime: {
      type: Type.STRING,
      description: "Estimated time to complete the repair, e.g., '2-3 hours', '1 business day'."
    },
    requiredParts: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "A list of parts likely needed for the repair."
    },
    notes: {
      type: Type.STRING,
      description: "Additional notes, potential causes, and diagnostics about the repair."
    }
  },
  required: ["estimatedTime", "requiredParts", "notes"]
};


export const generateRepairQuote = async (request: RepairRequest, language: 'ar' | 'en'): Promise<RepairQuote> => {
  const prompt_ar = `
    أنت خبير فني متخصص في صيانة الهواتف المحمولة وتعمل في مركز خدمة في مدينة الرياض، المملكة العربية السعودية.
    مهمتك هي تحليل المشكلة وتقديم تشخيص فني مبدئي بناءً على التفاصيل التالية.

    **تعليمات هامة للتشخيص:**
    1.  **كن دقيقاً:** قدم تحليلاً فنياً للمشكلة بناءً على وصف العميل.
    2.  **حدد الأسباب المحتملة:** اذكر الأسباب المحتملة للعطل.
    3.  **لا تذكر أي أسعار:** لا تقم بتضمين أي تكاليف أو أسعار أو عملات في ردك على الإطلاق. ركز فقط على الجانب الفني.
    4.  **التركيز على الحل:** قدم ملاحظات واضحة حول خطوات الإصلاح المحتملة وقطع الغيار المطلوبة.

    **تفاصيل الطلب:**
    - الشركة المصنعة: ${request.manufacturer}
    - الموديل: ${request.model}
    - المشكلة الرئيسية: ${request.issue}
    ${request.softwareIssue ? `- تفصيل مشكلة السوفتوير: ${request.softwareIssue}` : ''}
    - وصف إضافي من العميل: ${request.issueDescription || 'لا يوجد'}
    - موقع العميل: الرياض، ${request.streetAddress || 'غير محدد (سيحضر العميل للمحل)'}
    - نوع الخدمة المطلوبة: ${request.serviceType === 'pickup' ? 'استلام وتوصيل من موقع العميل' : 'العميل سيحضر الجهاز للمحل'}

    قم بإرجاع النتيجة بصيغة JSON فقط، متوافقة مع المخطط (schema) المحدد.
  `;

  const prompt_en = `
    You are an expert mobile phone repair technician working at a service center in Riyadh, Saudi Arabia.
    Your task is to analyze the problem and provide a preliminary technical diagnosis based on the following details.

    **Important Diagnostic Instructions:**
    1.  **Be Precise:** Provide a technical analysis of the problem based on the customer's description.
    2.  **Identify Potential Causes:** Mention the likely causes of the issue.
    3.  **Do Not Mention Prices:** Do not include any costs, prices, or currencies in your response whatsoever. Focus only on the technical aspect.
    4.  **Focus on the Solution:** Provide clear notes about potential repair steps and the required parts.

    **Request Details:**
    - Manufacturer: ${request.manufacturer}
    - Model: ${request.model}
    - Main Issue: ${request.issue}
    ${request.softwareIssue ? `- Software Issue Detail: ${request.softwareIssue}` : ''}
    - Additional Description from Customer: ${request.issueDescription || 'None'}
    - Customer Location: Riyadh, ${request.streetAddress || 'Not specified (Customer will visit the store)'}
    - Requested Service Type: ${request.serviceType === 'pickup' ? 'Pickup and delivery from customer location' : 'Customer will bring the device to the store'}

    Return the result in JSON format only, complying with the specified schema.
  `;

  const prompt = language === 'ar' ? prompt_ar : prompt_en;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const quoteData = JSON.parse(jsonText) as RepairQuote;

    return quoteData;

  } catch (error) {
    console.error("Error generating quote from Gemini:", error);
    throw new Error("Failed to parse repair diagnostics from AI response.");
  }
};