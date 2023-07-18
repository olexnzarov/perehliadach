import { Button, Group } from '@mantine/core';
import { useActiveDocumentValue } from '../../scripts/document-context';
import { useDocumentPrint } from '@/scripts/hooks/use-document-print';
import { saveDocument } from '@/scripts/utils';

export function DocumentActions() {
  const activeDocument = useActiveDocumentValue();
  const { print } = useDocumentPrint(activeDocument);

  const onPrint = () => print();
  const onSave = () => activeDocument && saveDocument(activeDocument);

  return (
    <Group spacing='xs' position='right' ml='auto'>
      {
        activeDocument &&
        <>
          <Button radius='xl' variant='subtle' onClick={onPrint}>Print</Button>
          <Button radius='xl' onClick={onSave}>Save</Button>
        </>
      }
    </Group>
  );
}