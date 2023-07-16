'use client';

import './styles/globals.css';
import './styles/pdfjs.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { Inter } from 'next/font/google';
import { MantineProvider } from '@mantine/core';
import { RecoilRoot } from 'recoil';
import { Notifications } from '@mantine/notifications';
import { EnsureDependencies } from './ensure-dependencies';
import RecoilNexus from 'recoil-nexus';

export const metadata = {
  title: 'Perehliadach',
  description: 'View and verify digitally signed documents',
};

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <MantineProvider 
        withGlobalStyles 
        withNormalizeCSS
        theme={{
          fontFamily: inter.style.fontFamily,
          components: {
            Button: {
              defaultProps: { color: 'dark' }
            }
          }
        }}
      >
        <Notifications />
        <html lang='en'>
          <body>
            <EnsureDependencies>
              {children}
            </EnsureDependencies>
          </body>
        </html>
      </MantineProvider>
    </RecoilRoot>
  )
}
