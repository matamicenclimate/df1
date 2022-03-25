import { toBytes } from './index';

declare global {
  interface Number {
    /**
     * Encodes this number (Either a signed integer or a signed float) into an array of bytes.
     * @param length The length of the target encode, in bytes.
     * @param order Endianess, optional (Defaults to big).
     */
    toBytes(length: number, order?: 'little' | 'big'): Uint8Array;
  }
  interface String {
    /**
     * Encodes this string into an array of bytes.
     * @param length Optionally, specify the target array length, which by default is the target's length.
     */
    toBytes(length?: number): Uint8Array;
  }
}

Number.prototype.toBytes = function (length: number, order: 'little' | 'big' = 'big') {
  return toBytes(this as number, length, order);
};

String.prototype.toBytes = function (length?: number) {
  return toBytes(this as string, length);
};

export {};
