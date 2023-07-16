import { ScrollArea } from '@mantine/core';
import { ViewerProperties } from './viewer-properties';
import { getDocumentFormat } from './utils';

export function BaseDocumentViewer(props: ViewerProperties) {
  const format = getDocumentFormat(props.file.name);
  
  // TODO: fallback on editor picker
  const ViewerComponent = format?.viewerComponent ?? (() => <div></div>);

  return (
    <ScrollArea w='100%' h='calc(100% - 65px)' px='md'>
      {<ViewerComponent {...props} />}
    </ScrollArea>
  );
}