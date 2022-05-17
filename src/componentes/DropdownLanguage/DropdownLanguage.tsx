import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@/context/LanguageContext';

export const DropdownLanguage = () => {
  const { t, i18n } = useTranslation();
  const { languageSelected, setLanguageSelected } = useLanguageContext();

  const languageOptions = [
    { name: `🇺🇸 ${t('components.Navbar.i18n.english')}`, key: 'en' },
    { name: `🇪🇸 ${t('components.Navbar.i18n.spanish')}`, key: 'es' },
  ];

  const [language, setLanguage] = useState<string | undefined>(languageSelected);

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
    if (setLanguageSelected != undefined) {
      return setLanguageSelected(lang);
    }
  };

  useEffect(() => {
    if (language != undefined) {
      i18n.changeLanguage(language);
      return localStorage.setItem('language', language);
    }
  }, [languageSelected, setLanguageSelected]);

  return (
    <select onChange={handleChangeLanguage} value={language}>
      <option value="en">{languageOptions[0].name}</option>
      <option value="es">{languageOptions[1].name}</option>
    </select>
  );
};
