import { IconBolt, IconBug, IconPigMoney, IconSettings, IconSettingsCog, IconTool, IconTrash } from '@tabler/icons-react';
import { BaseNavigationMenu } from '../base-navigation-menu';
import { SwitchProps, NativeSelect, Stack, Switch, Kbd, Button, Group } from '@mantine/core';
import { zoomOptions } from '@/app/document/scripts/zoom';
import { resetApplicationSettings, useApplicationSettings } from '@/scripts/user-settings';
import { ApplicationSettingsProperties } from '@/scripts/user-settings/properties';
import { AccordionMenu } from '../accordion-menu';
import { NativeApplication } from '@/scripts/app-core/native-application';

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

  const onReportProblem = async () => {
    const shell = await NativeApplication.getShell();
    await shell.open('https://github.com/alexnzarov/perehliadach/issues');
  };

  const onResetSettings = () => resetApplicationSettings();

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
              property='openFullscreenAfterDocumentLoad'
              label='Open in fullscreen after the documents loads'
            />
            <BooleanSwitch
              property='autoOpenSignedDocument'
              label='Automatically open a signed document on load'
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
              <Button 
                size='xs' 
                leftIcon={<IconBug size='1rem' />} 
                onClick={onReportProblem}
              >
                Report a problem
              </Button>
              <Button 
                size='xs' 
                leftIcon={<IconSettingsCog size='1rem' />} 
                onClick={onResetSettings}
              >
                Reset settings to default
              </Button>
            </Group>
          </Stack>
        </AccordionMenu.Item>
      </AccordionMenu>
    </BaseNavigationMenu>
  );
}