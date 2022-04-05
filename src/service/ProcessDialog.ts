import unit from '@/lib/unit';
import React from 'react';
import { Service } from 'typedi';

@Service()
export default class ProcessDialog {
  setOpen: React.Dispatch<boolean> = unit;
  setMessage: React.Dispatch<string> = unit;
  setTitle: React.Dispatch<string> = unit;
  setSubtitle: React.Dispatch<string> = unit;
  setRed: React.Dispatch<boolean> = unit;

  /**
   * Shows the dialog.
   */
  start() {
    this.setOpen(true);
  }

  /**
   * Hides the dialog.
   */
  stop() {
    this.setOpen(false);
  }

  set highlight(value: boolean) {
    this.setRed(value);
  }

  /**
   * Setting this property will cause an update to the underlying dialog
   * container.
   */
  set message(value: string) {
    this.setMessage(value);
  }

  set subtitle(value: string) {
    this.setSubtitle(value);
  }

  /**
   * The title of the dialog.
   */
  set title(value: string) {
    this.setTitle(value);
  }

  /**
   * Creates an asynchronous block that stops the dialog once ended.
   */
  async process(proc: (this: ProcessDialog) => Promise<void> | void) {
    this.start();
    try {
      return await proc.call(this);
    } finally {
      this.stop();
    }
  }
}
