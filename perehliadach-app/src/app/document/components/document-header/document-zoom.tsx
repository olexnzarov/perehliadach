import { ActionIcon, Group, NativeSelect, Tooltip } from '@mantine/core';
import { IconZoomIn, IconZoomOut } from '@tabler/icons-react';
import { useActiveDocumentValue } from '../../scripts/document-context';
import { useHotkeys, useWindowEvent } from '@mantine/hooks';
import { useApplicationSettings } from '@/scripts/user-settings';
import { useEffect, useRef } from 'react';

export interface DocumentZoomProperties {
  options: { label: string; value: string; }[];
  currentZoom: string;
  onZoomChange: (value: string) => void;
  onZoomIncrease: () => void;
  onZoomDecrease: () => void;
}

export function DocumentZoom(props: DocumentZoomProperties) {
  const [appSettings] = useApplicationSettings();
  const activeDocument = useActiveDocumentValue();
  const hasChangedRef = useRef(false);

  const onZoomIncrease = () => {
    props.onZoomIncrease();
    hasChangedRef.current = true;
  };

  const onZoomDecrease = () => {
    props.onZoomDecrease();
    hasChangedRef.current = true;
  };

  const onZoomChange = (value: string) => {
    props.onZoomChange(value);
    hasChangedRef.current = true;
  };

  useHotkeys([
    ['mod+Minus', () => appSettings.enableZoomHotkeys && onZoomDecrease()],
    ['mod+Equal', () => appSettings.enableZoomHotkeys && onZoomIncrease()],
  ]);

  useWindowEvent(
    'wheel',
    (e) => {
      if (!appSettings.enableZoomOnScroll || !e.ctrlKey) {
        return;
      }

      (e.deltaY < 0 ? onZoomIncrease : onZoomDecrease)();
    }
  );

  useEffect(
    () => {
      // If user didn't change the document zoom manually, but changed the default zoom value
      if (hasChangedRef.current || appSettings.defaultZoomValue === props.currentZoom) {
        return;
      }

      props.onZoomChange(appSettings.defaultZoomValue);
    },
    [appSettings.defaultZoomValue]
  );
  
  return (
    <Group my='auto' spacing='xs'>
      {
        activeDocument && 
        <>
          <NativeSelect 
            data={props.options} 
            onChange={e => onZoomChange(e.target.value)} 
            value={props.currentZoom}
            size='sm' 
            color='dark' 
            radius='xl'
          />
          <Tooltip label='Zoom In' position='bottom'>
            <ActionIcon color='dark' size='lg' onClick={onZoomIncrease}>
              <IconZoomIn size='1rem' />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Zoom Out' position='bottom' onClick={onZoomDecrease}>
              <ActionIcon color='dark' size='lg'>
                <IconZoomOut size='1rem' />
              </ActionIcon>
          </Tooltip>
        </>
      }
    </Group>
  );
}