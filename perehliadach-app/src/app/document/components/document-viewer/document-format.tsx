
import { ReactNode } from 'react';
import { ViewerProperties } from './viewer-properties';
import { PdfViewer } from './pdf/pdf-viewer';
import { TextViewer } from './text/text-viewer';
import { ImageViewer } from './image/image-viewer';

export interface DocumentFormat {
  extensions: string[];
  mimeType: string;
  viewerComponent: (props: ViewerProperties) => ReactNode;
}

export const supportedFormats: DocumentFormat[] = [
  {
    extensions: ['pdf'],
    mimeType: 'application/pdf',
    viewerComponent: PdfViewer,
  },
  {
    extensions: ['txt', 'log', 'json', 'xml', 'yaml', 'yml', 'js', 'ts', 'rs', 'py', 'cpp', 'h', 'go', 'java', 'kt'],
    mimeType: 'text/plain',
    viewerComponent: TextViewer,
  },
  {
    extensions: ['png'],
    mimeType: 'image/png',
    viewerComponent: ImageViewer,
  },
  {
    extensions: ['jpg', 'jpeg'],
    mimeType: 'image/jpeg',
    viewerComponent: ImageViewer,
  }
];
