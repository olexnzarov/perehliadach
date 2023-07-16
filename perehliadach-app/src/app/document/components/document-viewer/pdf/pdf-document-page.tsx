import { Box, Loader, Stack, Text, useMantineTheme } from '@mantine/core';
import { IconFileUnknown, IconFileX } from '@tabler/icons-react';
import { Page } from 'react-pdf';

export interface PdfDocumentPageProperties {
  pageIndex: number;
  scale?: number;
}

function NoPageSpecified({ pageIndex }: Pick<PdfDocumentPageProperties, 'pageIndex'>) {
  const theme = useMantineTheme();

  return (
    <Box w='100%' display='flex' sx={{ flex: 1 }} p='lg'>
      <Stack>
        <Box m='auto'>
          <IconFileUnknown size='3rem' color={theme.colors.gray[5]} />
        </Box>
        <Text size='sm' color='dimmed'>Missing page #{pageIndex + 1}</Text>
      </Stack>
    </Box>
  );
}

function FailedPage({ pageIndex }: Pick<PdfDocumentPageProperties, 'pageIndex'>) {
  const theme = useMantineTheme();

  return (
    <Box w='100%' display='flex' sx={{ flex: 1 }} p='lg'>
      <Stack>
        <Box m='auto'>
          <IconFileX size='3rem' color={theme.colors.red[5]} />
        </Box>
        <Text size='sm' color='red' fw='600'>Unable to load page #{pageIndex + 1}</Text>
      </Stack>
    </Box>
  );
}

function LoadingPage() {
  return (
    <Box w='100%' display='flex' sx={{ flex: 1 }} p='xl'>
      <Loader color='gray' size='xl' />
    </Box>
  );
}

export function PdfDocumentPage(props: PdfDocumentPageProperties) {
  return (
    <Page 
      error={() => <FailedPage pageIndex={props.pageIndex} />}
      noData={() => <NoPageSpecified pageIndex={props.pageIndex} />}
      loading={LoadingPage}
      pageIndex={props.pageIndex}
      scale={props.scale}
    />
  );
}