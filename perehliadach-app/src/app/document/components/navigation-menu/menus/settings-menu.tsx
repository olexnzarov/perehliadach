import { IconBolt, IconBug, IconPigMoney, IconSettings, IconSettingsCog, IconTool, IconTrash } from '@tabler/icons-react';
import { BaseNavigationMenu } from '../base-navigation-menu';
import { SwitchProps, NativeSelect, Stack, Switch, Kbd, Button, Group } from '@mantine/core';
import { zoomOptions } from '@/app/document/scripts/zoom';
import { useApplicationSettings } from '@/scripts/user-settings';
import { ApplicationSettingsProperties } from '@/scripts/user-settings/properties';
import { AccordionMenu } from '../accordion-menu';

// TODO:
// Auto open document
// Auto full screen on open

const BooleanSwitch = ({ property, ...props }: { property: keyof ApplicationSettingsProperties } & SwitchProps) => {
  const [settings, setSettings] = useApplicationSettings();

  return (
    <Switch 
      {...props}
      checked={!!settings[property]}
      onChange={e => setSettings(s => ({ ...s, [property]: e.target.checked }))}
    />
  );
}

export function SettingsMenu({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useApplicationSettings();

  return (
    <BaseNavigationMenu icon={IconSettings} title='Settings' onClose={onClose}>
      <AccordionMenu defaultValue={['general', 'actions']}>
        <AccordionMenu.Item value='general' title='General' icon={IconTool}>
          <Stack spacing='xs' sx={{ userSelect: 'none' }}>
            <BooleanSwitch 
              property='showSignaturesAfterDocumentLoad'
              label='Show signatures after the document loads'
            />
            <BooleanSwitch 
              property='showSignaturesOnlyWhenAttentionNeeded'
              label='Only when the document has unverified signatures'
              description='The application will only show signatures when your attention could be needed.'
              ml='md'
              disabled={!settings.showSignaturesAfterDocumentLoad}
            />
            <BooleanSwitch 
              property='improvePrintDialogLatency'
              label='Improve print dialog latency'
              description='The application will automatically preload and prepare documents for print when you open them.'
            />
            <BooleanSwitch 
              property='enableZoomOnScroll'
              label={<>Zoom on scroll when <Kbd size='xs'>Ctrl</Kbd> pressed</>}
            />
            <BooleanSwitch 
              property='enableZoomHotkeys'
              label={<>Enable zoom hotkeys <Kbd size='xs'>Ctrl +/-</Kbd></>}
            />
            <NativeSelect 
              label='Default document zoom'
              data={zoomOptions} 
              value={settings.defaultZoomValue}
              onChange={e => setSettings(s => ({ ...s, defaultZoomValue: e.currentTarget.value }))}
            />
          </Stack>
        </AccordionMenu.Item>
        <AccordionMenu.Item value='actions' title='Actions' icon={IconBolt}>
          <Stack spacing='xs'>
            <Group spacing='xs' grow>
              <Button leftIcon={<IconTrash size='1rem' />} size='xs'>Clean temporary directory</Button>
              <Button leftIcon={<IconSettingsCog size='1rem' />} size='xs'>Reset settings to default</Button>
            </Group>
            <Group spacing='xs' grow>
              <Button leftIcon={<IconBug size='1rem' />} size='xs'>Report a problem</Button>
              <Button leftIcon={<IconPigMoney size='1rem' />} variant='outline' size='xs'>Contribute</Button>
            </Group>
          </Stack>
        </AccordionMenu.Item>
      </AccordionMenu>
    </BaseNavigationMenu>
  );
}