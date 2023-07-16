import { Box, Container, Paper } from '@mantine/core';
import { ViewerProperties } from '../viewer-properties';
import { useMemo } from 'react';
import { Prism, } from '@mantine/prism';

export function TextViewer({ file, scale }: ViewerProperties) {
  const textContent = useMemo(
    () => Buffer.from(file.buffer).toString('utf8'), 
    [file]
  );

  return (
    <Box>
      <Container p='md' sx={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
        <Paper withBorder p='xs'>
          <Prism language={file.name.split('.').at(-1)! as any}>
            {textContent}
          </Prism>
        </Paper>
      </Container>
    </Box>
  )
}