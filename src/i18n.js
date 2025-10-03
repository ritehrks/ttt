import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "welcome": "Welcome",
        // ...other translations
      }
    },
    hi: {
      translation: {
        "welcome": "स्वागत है",
        // ...other translations
      }
    },
    gu: {
      translation: {
        "welcome": "સ્વાગત છે",
        // ...other translations
      }
    }
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
