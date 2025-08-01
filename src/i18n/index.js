import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from '../locales/en.json';
import tr from '../locales/tr.json';
import AsyncStorage from '@react-native-async-storage/async-storage';




const LANGUAGE_KEY = 'appLanguage';

const detectAndInit = async () => {
  let lng = 'tr';
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (stored) lng = stored;
  } catch { }
  await i18n.changeLanguage(lng);
};


export const setStoredLanguage = async (lng) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lng);
    await i18n.changeLanguage(lng);
  } catch { }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  lng: 'tr', // fallback başlangıç
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});


export default i18n;