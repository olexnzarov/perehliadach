import { Text, Accordion, AccordionProps, Group } from '@mantine/core';
import { Icon } from '@tabler/icons-react';
import { ReactNode } from 'react';

export function AccordionMenu(props: AccordionProps<true>) {
  return (
    <Accordion 
      variant='separated' 
      multiple
      {...props} 
    />
  );
}

export interface AccordionMenuItemProperties {
  title: string;
  value: string;
  icon: Icon;
  children: ReactNode;
}

function AccordionMenuItem(props: AccordionMenuItemProperties) {
  return (
    <Accordion.Item value={props.value}>
      <Accordion.Control sx={{ userSelect: 'none' }}>
        <Group spacing='xs'>
          <props.icon size='1rem' />
          <Text size='sm' fw='600'>{props.title}</Text>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {props.children}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

AccordionMenu.Item = AccordionMenuItem;
