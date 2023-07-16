import { Box, Stack, Text } from '@mantine/core';
import { useActiveDocumentValue, useDocumentContext } from '../../scripts/document-context';

export function DocumentTitle() {
  const [context] = useDocumentContext();
  const activeDocument = useActiveDocumentValue();
  const name = context?.parentFile?.split('/').at(-1);

  return (
    <Box sx={{ minHeight: '36px' }} display='flex'>
      <Stack spacing='5px' m='auto' sx={{ textAlign: 'center', overflowWrap: 'anywhere', userSelect: 'none' }}>   
        <Text size='sm' fw='600'>{name}</Text>
        {
          activeDocument &&
          <Text size='xs'color='dimmed'>{activeDocument.name}</Text>
        }
      </Stack>
    </Box>
  );
}