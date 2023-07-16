import { supportedFormats } from './document-format'

export const isSupportedDocumentFormat = (file: string) => getDocumentFormat(file) != null;

export const getDocumentFormat = (file: string) => {
  const extension = file.split('.').at(-1);

  if (extension == null) {
    return null;
  }

  return supportedFormats.find(f => f.extensions.includes(extension)) ?? null;
};

export const getDocumentMimeType = (file: string) => {
  return getDocumentFormat(file)?.mimeType ?? 'text/plain';
};
