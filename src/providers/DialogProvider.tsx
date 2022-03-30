import { Dialog } from '@/componentes/Dialog/Dialog';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import ProcessDialog from '@/service/ProcessDialog';
import { ReactNode, useState } from 'react';
import Container from 'typedi';

const service = Container.get(ProcessDialog);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('...');
  const [title, setTitle] = useState('Processing...');
  service.setOpen = setOpen;
  service.setMessage = setMessage;
  service.setTitle = setTitle;
  let dialog: JSX.Element | null = null;
  if (open) {
    dialog = (
      <Dialog isOpen={open} setIsOpen={setOpen} title={title}>
        {message}
        <div className="flex justify-center mt-3">
          <Spinner size="lg" />
        </div>
      </Dialog>
    );
  }
  return (
    <>
      {dialog}
      {children}
    </>
  );
}
