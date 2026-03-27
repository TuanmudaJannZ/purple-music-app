import { useSettingsStore } from '../store/musicStore';
import { translations, TranslationKey } from '../store/translations';

export function useTranslation() {
  const language = useSettingsStore((s) => s.language);
  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };
  return { t, language };
}
