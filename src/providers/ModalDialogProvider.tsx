import { Dialog } from '@/componentes/Dialog/Dialog';
import ModalDialog from '@/service/ModalDialog';
import { ReactNode, useEffect, useState } from 'react';

export interface ModalDialogState {
  open: boolean;
}

export interface ModalDialogProps {
  children: ReactNode;
}

const service = ModalDialog.get();

/**
 * A simple provider.
 */
export default function ModalDialogProvider({ children }: ModalDialogProps) {
  const [state, update] = useState<ModalDialogState>({
    open: false,
  });
  useEffect(() => {
    service.update = update;
  }, [state]);
  return (
    <>
      <Dialog isOpen={state.open} title={'aasssadf'}>
        Hello World!
      </Dialog>
      {children}
    </>
  );
}
