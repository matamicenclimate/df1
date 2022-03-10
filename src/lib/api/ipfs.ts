export interface IPFSResponse {
  ipnft: string;
  url: string;
  arc69: Arc69;
  image_url: string;
}
export interface Arc69 {
  standard: string;
  description: string;
  external_url: string;
  mime_type: string;
  properties: Properties;
}
export interface Properties {
  file: File;
  artist: string;
}
export interface File {
  name: string;
  type: string;
  size: number;
}
