// Simple client-side i18n utility
import { useEffect } from 'react';
import enMessages from '@/messages/en.json';
import zhMessages from '@/messages/zh.json';
import ruMessages from '@/messages/ru.json';

type Messages = typeof enMessages;
type MessageKey = keyof Messages;
type NestedKeys<T> = T extends object ? keyof T : never;

const messages: Record<string, Messages> = {
  en: enMessages,
  zh: zhMessages,
  ru: ruMessages,
};

export function detectLocale(): string {
  if (typeof window === 'undefined') return 'en';

  // Check if user has manually selected a language preference
  const storedLanguage = localStorage.getItem('preferred-language');
  if (storedLanguage && ['en', 'zh', 'ru'].includes(storedLanguage)) {
    return storedLanguage;
  }

  // Fallback to browser language detection
  const browserLang = navigator.language.split('-')[0];
  const supportedLocales = ['en', 'zh', 'ru'];

  return supportedLocales.includes(browserLang) ? browserLang : 'en';
}

export function getMessages(locale: string = 'en'): Messages {
  return messages[locale] || messages.en;
}

// Event system for language changes
export function triggerLanguageChange(locale: string) {
  localStorage.setItem('preferred-language', locale);
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { locale } }));
}

// Hook for components to listen to language changes
export function useLanguageChange(callback: (locale: string) => void) {
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      callback(event.detail.locale);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, [callback]);
}

export function translate(
  locale: string,
  section: MessageKey,
  key: string
): string {
  const msgs = getMessages(locale);
  const sectionMsgs = msgs[section] as Record<string, string>;
  return sectionMsgs?.[key] || key;
}

