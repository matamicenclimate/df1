import { Dialog } from '@/componentes/Dialog/Dialog';
import { Button } from '@/componentes/Elements/Button/Button';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import ProcessDialog, { Content } from '@/service/ProcessDialog';

import { ReactNode, useState } from 'react';
import Container from 'typedi';

const service = Container.get(ProcessDialog);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<Content>('...');
  const [title, setTitle] = useState<Content>('Processing...');
  const [red, setRed] = useState(false);
  const [subtitle, setSubtitle] = useState<Content>('');
  const [userInteraction, setUserInteraction] = useState<boolean>(false);
  service.setOpen = setOpen;
  service.setMessage = setMessage;
  service.setTitle = setTitle;
  service.setRed = setRed;
  service.setSubtitle = setSubtitle;
  service.setInteraction = setUserInteraction;

  function onClose() {
    setOpen(false);
    setUserInteraction(false);
    service.interact();
  }

  return (
    <>
      <Dialog subtitle={subtitle} isOpen={open} title={title}>
        <div className={red ? 'red' : undefined}>{message}</div>
        {userInteraction ? (
          <div className="text-right">
            <Button className="my-4" onClick={onClose}>
              {' '}
              Close{' '}
            </Button>
          </div>
        ) : (
          <div className="flex justify-center mt-3">
            <Spinner size="lg" />
          </div>
        )}
      </Dialog>
      {children}
    </>
  );
}
