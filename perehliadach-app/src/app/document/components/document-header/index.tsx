import { Box, Divider, Grid, Text } from '@mantine/core';
import { DocumentZoom, DocumentZoomProperties } from './document-zoom';
import { DocumentActions } from './document-actions';
import { DocumentTitle } from './document-title';

export interface DocumentHeaderProperties {
  zoomProperties: DocumentZoomProperties;
}

export function DocumentHeader(props: DocumentHeaderProperties) {
  return (
    <Box>
      <Grid px='md' py='xs' justify='center' align='center'>
        <Grid.Col span={4}><DocumentZoom {...props.zoomProperties} /></Grid.Col>
        <Grid.Col span={4}><DocumentTitle /></Grid.Col>
        <Grid.Col span={4}><DocumentActions /></Grid.Col>
      </Grid>
      <Divider />
    </Box>
  );
}