import { Paper, Text, ScrollArea, Box, Group, CloseButton } from '@mantine/core';
import { Icon } from '@tabler/icons-react';
import { ReactNode } from 'react';

export interface NavigationMenuProperties {
  icon: Icon;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function BaseNavigationMenu(props: NavigationMenuProperties) {
  return (
    <Paper 
      sx={{ width: '490px', minHeight: '0', maxHeight: '80vh', overflow: 'hidden', display: 'flex' }} 
      withBorder
    >
      <ScrollArea type='auto' w='100%' py='xs'>
        <Group px='xs' spacing='xs' mb='sm'>
          <props.icon size='1rem' />
          <Text fw='600' sx={{ userSelect: 'none' }} mr='auto'>{props.title}</Text>
          <CloseButton onClick={props.onClose} />
        </Group>
        <Box px='md'>
          {props.children}
        </Box>
      </ScrollArea>
    </Paper>
  );
}
