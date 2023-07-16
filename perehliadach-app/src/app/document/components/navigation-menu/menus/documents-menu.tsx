import { Badge, Box, Button, Group, Stack, Text } from '@mantine/core';
import { BaseNavigationMenu } from '../base-navigation-menu';
import { setActiveDocument, useActiveDocumentIndexValue, useDocumentContext, useFileListValue } from '@/app/document/scripts/document-context';

import { IconFiles, IconFolder, IconShieldCheck } from '@tabler/icons-react';
import { RawReportArtifact, SourceFile } from '@/scripts/signature-validation/eu-dss/output-reader';
import { AccordionMenu } from '../accordion-menu';

interface FileRowProperties {
  index: number;
  file: SourceFile | RawReportArtifact;
}

function FileRow(props: FileRowProperties) {
  const activeDocumentIndex = useActiveDocumentIndexValue();
  const isArtifact = 'content' in props.file;
  const isActive = !isArtifact && props.index === activeDocumentIndex;

  const onView = () => {
    setActiveDocument(props.index);
  };

  return (
    <Group spacing='xs'>
      <Box sx={{ maxWidth: '300px' }}>  
        <Text 
          truncate='start'
          size='sm' 
          fw={isActive ? '600' : 'normal'}
        >
          {props.file.name}
        </Text>
      </Box>
      {isActive && <Badge size='xs' color='dark' variant='outline' sx={{ userSelect: 'none' }}>Active</Badge>}
      <Group ml='auto' spacing='xs'>
        <Button size='xs' compact variant='subtle'>Save</Button>
        {!isArtifact && <Button size='xs' compact onClick={onView} disabled={isActive}>View</Button>}
      </Group>
    </Group>
  );
}

export function DocumentsMenu({ onClose }: { onClose: () => void }) {
  const files = useFileListValue();
  const [context] = useDocumentContext();

  return (
    <BaseNavigationMenu icon={IconFiles} title='Documents' onClose={onClose}>
      
      <AccordionMenu defaultValue={['signed-documents']}>
        <AccordionMenu.Item value='signed-documents' title='Signed documents' icon={IconFolder}>
          {
            files.length == 0
              ? <Text color='dimmed' size='sm' ta='left'>There are no signed documents.</Text>
              :
                <Stack spacing='xs'>
                  {files.map((f, i) => <FileRow key={`sf${i}`} index={i} file={f} />)}
                </Stack>
          }
        </AccordionMenu.Item>
        <AccordionMenu.Item value='raw-reports' title='Verification reports' icon={IconShieldCheck}>
          <Stack spacing='xs'>
            {context?.validation.raw.map((f, i) => <FileRow key={`rf${i}`} index={i} file={f} />)}
          </Stack>
        </AccordionMenu.Item>
      </AccordionMenu>
    </BaseNavigationMenu>
  );
}