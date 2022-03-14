import { none, option, some } from '@octantis/option';
import { useEffect, useState } from 'react';
import { EventEmitter } from 'events';

const ev = new EventEmitter();

function maybeGet<T>(key: string): option<T> {
  const init = localStorage.getItem(key);
  if (init != null) {
    return some(JSON.parse(init));
  }
  return none();
}

/**
 * Local storage bound value.
 */
export default function usePersistent<T>(key: string, init: T) {
  const [value, update] = useState<T>(maybeGet<T>(key).getOrElse(init));
  useEffect(() => {
    ev.on(key, update);
    return () => {
      ev.off(key, update);
    };
  }, []);
  function setValue(t: T) {
    window.localStorage.setItem(key, JSON.stringify(t));
    ev.emit(key, some(t));
  }
  return [value, setValue] as const;
}
