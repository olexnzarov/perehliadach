import { Box } from '@mantine/core';
import { ViewerProperties } from '../viewer-properties';
import { useMemo } from 'react';
import { getDocumentMimeType } from '../utils';

export function ImageViewer(props: ViewerProperties) {
  const imageUrl = useMemo(
    () => URL.createObjectURL(
      new File(
        [Buffer.from(props.file.buffer)], 
        props.file.name, 
        { type: getDocumentMimeType(props.file.name) }
      )
    ), 
    [props.file]
  );

  return (
    <Box w='100%' h='100%' display='flex' p='lg'>
      <img
        src={imageUrl}
        alt={props.file.name}
        width={`${props.scale * 100 / 2}%`}
        style={{  margin: 'auto' }}
      />
    </Box>
  )
}