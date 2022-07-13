import { useTranslation } from 'react-i18next';

export interface ErrorHintPorps {
  text: string;
  on: unknown | undefined;
}

/**
 * A simple error hint used on input forms.
 * Place underneath any input to display a nice error, in
 * case needed.
 */
export default function ErrorHint({ text, on }: ErrorHintPorps) {
  const { t } = useTranslation();
  if (on != null) {
    return <span className="text-red-500">{t(text)}</span>;
  }
  return null;
}
