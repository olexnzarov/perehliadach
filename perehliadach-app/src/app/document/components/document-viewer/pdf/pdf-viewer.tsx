import { Box, Container } from '@mantine/core';
import { ViewerProperties } from '../viewer-properties';
import { PdfDocument } from './pdf-document';
import { useMemo } from 'react';

export function PdfViewer({ file, scale }: ViewerProperties) {
  const pdfFile = useMemo(
    () => ({ data: file!.buffer }), 
    [file]
  );

  return (
    <Box>
      <PdfDocument
        file={pdfFile} 
        scale={scale} 
      />
    </Box>
  );
}
