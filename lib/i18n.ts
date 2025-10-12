// Simple client-side i18n utility
import enMessages from '@/messages/en.json';
import zhMessages from '@/messages/zh.json';
import ruMessages from '@/messages/ru.json';
import ptMessages from '@/messages/pt.json';

type Messages = typeof enMessages;
type MessageKey = keyof Messages;
type NestedKeys<T> = T extends object ? keyof T : never;

const messages: Record<string, Messages> = {
  en: enMessages,
  zh: zhMessages,
  ru: ruMessages,
  pt: ptMessages,
};

export function detectLocale(): string {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0];
  const supportedLocales = ['en', 'zh', 'ru', 'pt'];
  
  return supportedLocales.includes(browserLang) ? browserLang : 'en';
}

export function getMessages(locale: string = 'en'): Messages {
  return messages[locale] || messages.en;
}

export function translate(
  locale: string,
  section: MessageKey,
  key: string
): string {
  const msgs = getMessages(locale);
  const sectionMsgs = msgs[section] as any;
  return sectionMsgs?.[key] || key;
}

