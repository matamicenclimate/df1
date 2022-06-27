import { Dialog as HUIDialog } from '@headlessui/react';
import { Button } from '../Elements/Button/Button';
import { useTranslation } from 'react-i18next';
import unit from '@/lib/unit';
import { Content } from '@/service/ProcessDialog';

type DialogProps = {
  isOpen: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title: Content;
  subtitle?: Content;
  claim?: string;
  onAccept?: () => void;
  acceptLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  children?: React.ReactNode;
  closeButton?: boolean;
};

export const Dialog = ({
  isOpen,
  setIsOpen = unit,
  title,
  subtitle,
  claim,
  onAccept,
  acceptLabel,
  onCancel,
  // cancelLabel,
  closeButton,
  children,
}: DialogProps) => {
  const { t } = useTranslation();
  return (
    <HUIDialog
      open={isOpen}
      onClose={unit}
      className="fixed z-10 inset-0 overflow-y-auto h-screen flex items-center"
    >
      {/* Use the overlay to style a dim backdrop for your dialog */}
      <HUIDialog.Overlay className="fixed inset-0 bg-black opacity-30 backdrop-blur" />
      <div
        style={{ position: 'absolute', width: '100vw', height: '100vh' }}
        onClick={() => setIsOpen(false)}
      >
        {' '}
      </div>
      {/* <HUIDialog.Overlay className="fixed inset-0 backdrop-opacity-20" /> */}
      <div className="min-w-[560px] relative bg-white rounded-2xl max-w-sm w-full mx-auto p-7">
        <HUIDialog.Title className="text-3xl climate-black-title">{title}</HUIDialog.Title>
        {subtitle ? (
          <HUIDialog.Description className="pt-4">{subtitle}</HUIDialog.Description>
        ) : null}

        {claim ? (
          <p className="font-sanspro text-base text-climate-gray-light font-normal py-7">
            {claim}{' '}
          </p>
        ) : null}
        {children}
        <div className="space-x-2 flex justify-end absolute top-3 right-3 ">
          {closeButton && (
            <button
              className="p-1 text-climate-gray-light"
              onClick={() => (onCancel ? onCancel() : setIsOpen(false))}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
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
