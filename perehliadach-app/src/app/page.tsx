'use client';

import { NativeApplication } from '@/scripts/app-core/native-application';
import { useFileDrop } from '@/scripts/hooks/use-file-drop';
import { getSupportedContainerExtensions, isSupportedContainerExtension, normalizePath } from '@/scripts/utils';
import { Box, Text, Group, Stack, useMantineTheme } from '@mantine/core';
import { IconFileImport, IconFileUpload, IconFileX } from '@tabler/icons-react';
import { useState } from 'react';
import { FullPageLoader } from './full-page-loader';
import { setDocumentContext } from './document/scripts/document-context';
import signatureValidation from '@/scripts/signature-validation';
import { useRouter } from 'next/navigation';
import { createLogger } from '@/scripts/app-core/logger';
import { notifications } from '@mantine/notifications';

enum FileDropState {
  Idle,
  Hover,
  Invalid
}

const stateIconMap = {
  [FileDropState.Idle]: IconFileImport,
  [FileDropState.Hover]: IconFileUpload,
  [FileDropState.Invalid]: (props: any) => {
    const theme = useMantineTheme();
    return <IconFileX {...props} color={theme.colors.red[5]}/>
  },
};

const logger = createLogger('root-page');

export default function RootPage() {
  const theme = useMantineTheme();
  const router = useRouter();
  const [hovered, setHovered] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidInput = (paths: string[]) => {
    return paths.length === 1 && isSupportedContainerExtension(paths[0]);
  };

  const openDocument = async (file: string) => {
    setLoading(true);

    const parentFile = normalizePath(file);

    try {
      const data = await signatureValidation.runValidation(parentFile);
  
      setDocumentContext({ parentFile, validation: data, activeDocument: 0 });
  
      router.push('/document');
    } catch(e: any) {
      logger.error('Failed to open the document');
      logger.error(e);

      notifications.show({
        color: 'red',
        title: 'Unable to open the document',
        message: e.message ?? e.toString(),
        withCloseButton: true,
        autoClose: false,
      });

      setLoading(false);
    }
  };

  const onSelectFile = async () => {
    const dialog = await NativeApplication.getDialog();

    const file = await dialog.open({
      multiple: false,
      filters: [
        {
          name: 'Signed Document',
          extensions: getSupportedContainerExtensions(),
        },
      ],
    });

    if (file == null || Array.isArray(file)) {
      return;
    }

    await openDocument(file);
  };

  useFileDrop({ 
    onDrop: (files: string[]) => {
      setHovered(null);
      openDocument(files[0]);
    }, 
    onHover: (files: string[]) => {
      setHovered(files);
    }, 
    onCancel: () => {
      setHovered(null);
    },
  });

  if (loading) {
    return <FullPageLoader />;
  }

  const currentState = hovered == null ? FileDropState.Idle : (isValidInput(hovered) ? FileDropState.Hover : FileDropState.Invalid)
  const StateIcon = stateIconMap[currentState];

  return (
    <Box 
      w='100%' 
      h='100%' 
      display='flex' 
      sx={{ userSelect: 'none', cursor: 'pointer' }}
      onClick={onSelectFile}
    >
      <Group 
        position='center' 
        m='auto'
        p='xl'
      >
        <StateIcon size='3.2rem' stroke={1} />
        <Stack spacing='xs'>
          <Text 
            fw='600' 
            inline
            color={currentState === FileDropState.Invalid ? theme.colors.red[5] : undefined}
          >
            Drop a file here or click to select one
          </Text>
          <Text 
            size='xs' 
            inline 
            color={currentState === FileDropState.Invalid ? theme.colors.red[5] : 'dimmed'}
          >
            Supported file extensions are asice, asics, sce, and scs
          </Text>
        </Stack>
      </Group>
    </Box>
  );
}
