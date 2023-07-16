import { Alert, Text, Box, Divider, Group, Anchor, Loader } from '@mantine/core';
import { IconFileOff } from '@tabler/icons-react';
import { useState } from 'react';
import { Document, DocumentProps, pdfjs } from 'react-pdf';
import { PdfDocumentPage } from './pdf-document-page';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export interface PdfDocumentProperties {
  file: DocumentProps['file'];
  scale: number;
}

function FailedDocument() {
  return (
    <Box mx='auto' my='xl' sx={{ maxWidth: '500px' }}>
      <Alert 
        title={<Group spacing='xs'><IconFileOff size='1rem' /><Text size='sm'>Unable to display the document</Text></Group>}
        color='dark' 
        variant='outline'
      >
        The document cannot be displayed due to an unexpected error. It might be corrupt and have problems with its integrity. <br />
        <Divider my='xs' variant='dashed'/>
        You can try <Anchor href='#'>saving</Anchor> the document and opening it in another PDF viewer.
      </Alert>
    </Box>
  );
}

function LoadingDocument() {
  return (
    <Box w='100%' display='flex' m='auto' p='xl' sx={{ justifyContent: 'center' }}>
      <Loader color='gray' m='xl' size='xl' />
    </Box>
  );
}

export function PdfDocument(props: PdfDocumentProperties) {
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy | null>(null);

  const onLoadError = (error: any) => { 
    setPdf(null);
    console.error('Failed to load the document', error);
  };

  const onLoadSuccess = (document: pdfjs.PDFDocumentProxy) => setPdf(document);

  const pages: JSX.Element[] = [];

  if (pdf) {
    for (let i = 0; i < pdf.numPages; i++) {
      pages.push(<PdfDocumentPage key={i} pageIndex={i} scale={props.scale} />);
    }
  }

  return (
    <Document 
      file={props.file}
      error={FailedDocument}
      noData={FailedDocument}
      loading={LoadingDocument}
      onLoadError={onLoadError}
      onLoadSuccess={onLoadSuccess}
    >
      {pages}
    </Document>
  );
}