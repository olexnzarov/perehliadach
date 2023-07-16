import { IconFiles, IconSettings, IconWriting } from '@tabler/icons-react';
import { SignaturesMenu } from '../navigation-menu/menus/signatures-menu';
import { DocumentsMenu } from '../navigation-menu/menus/documents-menu';
import { SettingsMenu } from '../navigation-menu/menus/settings-menu';

export const navigationOptions = [
  {
    label: 'Signatures',
    icon: IconWriting,
    menu: SignaturesMenu
  },
  {
    label: 'Documents',
    icon: IconFiles,
    menu: DocumentsMenu
  },
  {
    label: 'Settings',
    icon: IconSettings,
    menu: SettingsMenu
  },
];
