import { useState } from 'react';
import { PdfViewer } from './pdf/pdf-viewer';
import { TextViewer } from './text/text-viewer';
import { ViewerProperties } from './viewer-properties';
import { Box, Paper, Select, Text } from '@mantine/core';

const viewers = [
  {
    name: 'Text Viewer',
    component: TextViewer,
  },
  {
    name: 'PDF Viewer',
    component: PdfViewer,
  },
];

export function UnknownFormatViewer(props: ViewerProperties) {
  const [selectedViewer, setSelectedViewer] = useState<string | null>(null);

  const ViewerComponent = selectedViewer != null ? viewers[parseInt(selectedViewer, 10)].component : null;

  return (
    <Box w='100%' h='100%'>
      <Paper 
        p='md' 
        mx='auto' 
        mt='md'
        withBorder
        w='400px'
      >
        {
          selectedViewer === null &&
          <Box mb='xs'>
            <Text size='sm'>
              File <span style={{ fontWeight: '600' }}>{props.file.name}</span> has an unknown format.
            </Text>
            <Text size='sm'>
              Choose a viewer to use for this document.
            </Text>
          </Box>
        }
        <Select
          data={viewers.map((v, i) => ({ label: v.name, value: i.toString() }))}
          value={selectedViewer}
          onChange={(value) => setSelectedViewer(value)}
          placeholder='Select a viewer...'
          clearable
        />
      </Paper>
      {
        ViewerComponent &&
        <ViewerComponent {...props} />
      }
    </Box>
  );
}