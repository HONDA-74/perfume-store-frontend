import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ar, en } from './resources';

export const LANGUAGE_STORAGE_KEY = 'kenz-language';
export type AppLanguage = 'en' | 'ar';

function getInitialLanguage(): AppLanguage {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved === 'en' || saved === 'ar') return saved;
  return navigator.language.toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

function applyDocumentLanguage(language: string) {
  const normalized: AppLanguage = language.startsWith('ar') ? 'ar' : 'en';
  document.documentElement.lang = normalized;
  document.documentElement.dir = normalized === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
}

const initialLanguage = getInitialLanguage();
applyDocumentLanguage(initialLanguage);

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: initialLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'ar'],
  interpolation: { escapeValue: false },
  initImmediate: false,
  returnNull: false,
});

i18n.on('languageChanged', applyDocumentLanguage);

export default i18n;
