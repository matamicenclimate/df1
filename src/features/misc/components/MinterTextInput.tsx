/*
  This namespace contains small components specific to the <Minter /> view component.
*/

import ErrorHint from '@/componentes/Form/ErrorHint';
import { NFTMetadataBackend } from '@/lib/type';
import { UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type MappedKeys = 'title' | 'author' | 'properties.price';

export interface TextInputProps {
  register: UseFormRegister<NFTMetadataBackend>;
  error: unknown | undefined;
  id: MappedKeys;
}

const PLACEHOLDER_TRANSLATIONS = {
  title: 'Minter.nftTitle',
  author: 'Minter.nftCreator',
  'properties.price': 'Minter.nftPrice',
} as Record<MappedKeys, string>;

/**
 * A simple text input component used in minter form.
 */
export default function MinterTextInput({ register, id, error }: TextInputProps) {
  const { t } = useTranslation();
  return (
    <div className="py-6">
      <input
        className="w-full border border-climate-border rounded-xl p-3 shadow"
        id={id}
        type="text"
        placeholder={t(PLACEHOLDER_TRANSLATIONS[id])}
        {...register(id, { required: true })}
      />
      <ErrorHint on={error} text="Minter.fieldRequired" />
    </div>
  );
}
