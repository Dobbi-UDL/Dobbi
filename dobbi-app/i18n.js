import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Create new i18n instance
const i18n = new I18n();

// Import translations
const en = require('./locales/en.json');
const es = require('./locales/es.json');

// Configure i18n
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
i18n.locale = Localization.locale;
i18n.translations = { en, es };

export default i18n;