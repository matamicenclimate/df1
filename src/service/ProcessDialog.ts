import unit from '@/lib/unit';
import EventEmitter from 'events';
import React from 'react';
import { Service } from 'typedi';

export type Content = string | JSX.Element | null;

@Service()
export default class ProcessDialog {
  setOpen: React.Dispatch<boolean> = unit;
  setMessage: React.Dispatch<Content> = unit;
  setTitle: React.Dispatch<Content> = unit;
  setSubtitle: React.Dispatch<Content> = unit;
  setRed: React.Dispatch<boolean> = unit;
  setInteraction: React.Dispatch<boolean> = unit;

  private readonly event = new EventEmitter();

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
  set message(value: Content) {
    this.setMessage(value);
  }

  set subtitle(value: Content) {
    this.setSubtitle(value);
  }

  /**
   * The title of the dialog.
   */
  set title(value: Content) {
    this.setTitle(value);
  }

  async interaction() {
    this.setInteraction(true);
    return await new Promise((r) => this.event.once('interact', r));
  }

  interact() {
    this.event.emit('interact');
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
