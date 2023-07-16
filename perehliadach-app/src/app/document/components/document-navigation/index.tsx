import { Box, Space, Stack } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { NavigationButton } from './navigation-button';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setDocumentContext, useDocumentContext } from '../../scripts/document-context';
import { SignedDocumentContext } from '../../../../scripts/global-state/signed-document-context';
import { useApplicationSettings } from '@/scripts/user-settings';
import { navigationOptions } from './navigation-options';

const SIGNATURE_MENU_INDEX = navigationOptions.findIndex(v => v.label === 'Signatures');

type ActiveMenu = { key: number; component: ({ onClose }: { onClose: () => void }) => ReactNode; }

const hasInvalidSignatures = (context: SignedDocumentContext | null) => {
  if (context?.validation && 'report' in context?.validation) {
    const invalidSignature = context.validation.report.signatures.find(s => !s.verified);
    return invalidSignature != null;
  }

  return false;
};

export function DocumentNavigation() {
  const router = useRouter();
  const [appSettings] = useApplicationSettings();
  const [context] = useDocumentContext();
  const [menu, setMenu] = useState<ActiveMenu | null>(null);
  const shownDefaultMenuRef = useRef(false);

  useEffect(
    () => {
      if (context?.validation == null || shownDefaultMenuRef.current) {
        return;
      }

      shownDefaultMenuRef.current = true;

      if (appSettings.showSignaturesAfterDocumentLoad) {
        if (
          appSettings.showSignaturesOnlyWhenAttentionNeeded &&
          context.validation.report.signatures.length !== 0 &&
          context.validation.report.signatures.find(s => !s.verified) == null
        ) {
          // we need user's attention only when there are no signatures
          // or when there are unverified signatures
          return;
        } 

        setMenu(({ key: SIGNATURE_MENU_INDEX, component: navigationOptions[SIGNATURE_MENU_INDEX].menu! }));
      }
    },
    [context?.validation]
  );

  return (
    <Box p='xs' sx={{ left: 0, display: 'flex', position: 'absolute', alignItems: 'flex-start', zIndex: 10 }}>
      <Stack spacing='xs' mr='xs'>
        {
          navigationOptions.map(
            (v, i) => 
              <NavigationButton 
                key={v.label} 
                label={v.label} 
                icon={v.icon} 
                active={i === menu?.key}
                indicator={v.label === 'Signatures' && hasInvalidSignatures(context) ? 'red' : undefined}
                onClick={() => {
                  if (v.menu) {
                    if (menu?.key === i) { 
                      setMenu(null); 
                      return;
                    } 

                    setMenu({ key: i, component: v.menu }); 
                  }
                }} 
              />
          )
        }
        <Space h='lg' />
        <NavigationButton 
          label='Close'
          icon={IconX} 
          onClick={() => {
            setDocumentContext(null);
            router.push('/');
          }}
        />
      </Stack>
      {menu && <menu.component onClose={() => setMenu(null)} />}
    </Box>
  );
}
