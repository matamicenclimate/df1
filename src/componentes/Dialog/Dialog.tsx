import { useState } from 'react';
import { Dialog as HUIDialog } from '@headlessui/react';
import { Button } from '../Elements/Button/Button';
import { useTranslation } from 'react-i18next';

type DialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  subtitle?: string;
  claim?: string;
  onAccept?: () => void;
  acceptLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  children?: React.ReactNode;
};

export const Dialog = ({
  isOpen,
  setIsOpen,
  title,
  subtitle,
  claim,
  onAccept,
  acceptLabel,
  onCancel,
  cancelLabel,
  children,
}: DialogProps) => {
  const { t } = useTranslation();
  return (
    <HUIDialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed z-10 inset-0 overflow-y-auto h-screen flex items-center"
    >
      {/* Use the overlay to style a dim backdrop for your dialog */}
      <HUIDialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="relative bg-white rounded max-w-sm w-full mx-auto p-4">
        <HUIDialog.Title className="text-xl">{title}</HUIDialog.Title>
        {subtitle ? <HUIDialog.Description>{subtitle}</HUIDialog.Description> : null}

        {claim ? <p>{claim} </p> : null}
        {children}
        <div className="space-x-2 flex justify-end">
          <Button onClick={() => (onCancel ? onCancel() : setIsOpen(false))}>
            {cancelLabel ? cancelLabel : t('dialogs.base.cancel')}
          </Button>
          {onAccept && (
            <Button onClick={() => (onAccept ? onAccept() : setIsOpen(false))}>
              {acceptLabel ? acceptLabel : t('dialogs.base.accept')}
            </Button>
          )}
        </div>
      </div>
    </HUIDialog>
  );
};
