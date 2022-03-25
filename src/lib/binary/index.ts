/**
 * Represents the endianess of the payload.
 * @see https://www.freecodecamp.org/news/what-is-endianness-big-endian-vs-little-endian/
 */
export type Order = 'little' | 'big';

/**
 * Encodes this number (Either a signed integer or a signed float) into an array of bytes.
 * @param target The target value.
 * @param length The length of the target encode, in bytes.
 * @param order Endianess, optional (Defaults to big).
 */
export function toBytes(target: number, length: number, order?: Order): Uint8Array;

/**
 * Encodes an ASCII (1 byte per char) string into an array of bytes.
 * @param target The target value.
 * @param length Optionally, specify the target array length, which by default is the target's length.
 */
export function toBytes(target: string, length?: number): Uint8Array;
export function toBytes(target: number | string, length?: number, order: 'little' | 'big' = 'big') {
  if (typeof target === 'number') {
    if (length == null) throw new Error('If target is number, ');
    const buffer = new ArrayBuffer(length);
    const array = new Uint8Array(buffer);
    const view = new DataView(buffer);
    if (Number.isInteger(target)) {
      view.setInt32(0, target, order === 'big');
    } else {
      view.setFloat32(0, target, order === 'big');
    }
    if (order === 'big') {
      return array.reverse();
    }
    return array;
  } else if (typeof target === 'string') {
    const buffer = new ArrayBuffer(length ?? target.length);
    const array = new Uint8Array(buffer);
    for (let i = 0; i < buffer.byteLength; i++) {
      array[i] = target.charCodeAt(i);
    }
    return array;
  } else {
    throw new Error('Unexpected target object type!');
  }
}
