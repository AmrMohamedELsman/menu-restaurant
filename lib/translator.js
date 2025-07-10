// استخدام MyMemory Translation API المجاني - لا يحتاج API Key
const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

export const translateText = async (text, targetLanguage = 'en', sourceLanguage = 'ar') => {
  if (!text) return text;
  
  try {
    const response = await fetch(
      `${MYMEMORY_API_URL}?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`
    );
    
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // إرجاع النص الأصلي في حالة الخطأ
  }
};

// ترجمة عدة نصوص في مرة واحدة
export const translateMultipleTexts = async (texts, targetLanguage = 'en', sourceLanguage = 'ar') => {
  if (!texts.length) return texts;
  
  try {
    const translatedTexts = await Promise.all(
      texts.map(text => translateText(text, targetLanguage, sourceLanguage))
    );
    return translatedTexts;
  } catch (error) {
    console.error('Translation error:', error);
    return texts;
  }
};