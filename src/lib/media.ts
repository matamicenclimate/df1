/*
  Media related utility functions.
*/

/**
 * Infers if the URL is video-like media content
 * or not.
 * @remarks The check is loose and can't be prevented from
 * bad checking against an ill-formed URL.
 */
export function isVideo(imageUrl: string) {
  if (imageUrl.endsWith('.mp4')) {
    const spitString = imageUrl.split('/');
    spitString[2] = 'ipfs.io';

    return spitString.join('/');
  }
  return imageUrl;
}
