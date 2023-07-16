import { Box, Loader } from '@mantine/core';

export function FullPageLoader() {
  return (
    <Box w='100%' h='100%' display='flex'>
      <Loader size='xl' m='auto' color='dark' />
    </Box>
  );
}
