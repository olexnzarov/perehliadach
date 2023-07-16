import { Button, Group } from '@mantine/core';
import { useActiveDocumentValue } from '../../scripts/document-context';
import { useDocumentPrint } from '@/scripts/hooks/use-document-print';

export function DocumentActions() {
  const activeDocument = useActiveDocumentValue();
  const { print } = useDocumentPrint(activeDocument);

  return (
    <Group spacing='xs' position='right' ml='auto'>
      {
        activeDocument &&
        <>
          <Button radius='xl' variant='subtle' onClick={() => print()}>Print</Button>
          <Button radius='xl'>Save</Button>
        </>
      }
    </Group>
  );
}