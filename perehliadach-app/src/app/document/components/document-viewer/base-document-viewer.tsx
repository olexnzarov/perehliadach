import { ScrollArea } from '@mantine/core';
import { ViewerProperties } from './viewer-properties';
import { getDocumentFormat } from './utils';
import { UnknownFormatViewer } from './unknown-format-viewer';

export function BaseDocumentViewer(props: ViewerProperties) {
  const format = getDocumentFormat(props.file.name);
  
  const ViewerComponent = format?.viewerComponent ?? UnknownFormatViewer;

  return (
    <ScrollArea w='100%' h='calc(100% - 65px)' px='md'>
      <ViewerComponent {...props} />
    </ScrollArea>
  );
}