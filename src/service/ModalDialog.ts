import { Dispatch, SetStateAction } from 'react';
import Container, { Service } from 'typedi';
import { ModalDialogState } from '@/providers/ModalDialogProvider';
import unit from '@/lib/unit';

export type Update = Dispatch<SetStateAction<ModalDialogState>>;

/**
 * This service acts as a gateway to the provider component.
 */
@Service()
export default class ModalDialog {
  static get() {
    return Container.get(ModalDialog);
  }
  update: Update = unit;
}
