import { useEffect } from 'react';
import { createLogger } from '../app-core/logger';
import { SourceFile } from '../signature-validation/eu-dss/output-reader';
import { useApplicationSettings } from '../user-settings';
import { getDocumentMimeType } from '@/app/document/components/document-viewer/utils';

const logger = createLogger('document-print');

export const useDocumentPrint = (sourceFile: SourceFile | null) => {
  const [appSettings] = useApplicationSettings();

  const frameKey = `blob-${sourceFile?.name}`;

  const getFrameWindow = () => {
    if (sourceFile == null) { 
      return null;
    }

    const frame = frames[frameKey as any];
    return (frame ?? null) as Window | null;
  }

  const onCleanUp = () => {
    const frameWindow = getFrameWindow();

    if (frameWindow?.frameElement == null) { 
      return;
    }

    document.body.removeChild(frameWindow.frameElement);
    logger.info(`Removed '${frameKey}' iframe on clean up`);
  }

  const initializeFrame = () => {
    const inMemoryFile = new File(
      [Buffer.from(sourceFile!.buffer)], 
      sourceFile!.name, 
      { type: getDocumentMimeType(sourceFile!.name) }
    );

    const iframe = document.createElement('iframe');
    iframe.name = frameKey;
    iframe.src = URL.createObjectURL(inMemoryFile);
    iframe.hidden = true;

    document.body.appendChild(iframe);
    logger.info(`Creating '${frameKey}' iframe to print '${sourceFile!.name}'`, iframe);

    return new Promise<HTMLIFrameElement>(
      (resolve, reject ) =>  {
        iframe.onload = () => resolve(iframe)
        iframe.onabort = () => reject(new Error('Loading aborted'))
        iframe.oncancel = () => reject(new Error('Loading canceled'))
      }
    );
  }

  const print = async () => {
    logger.info(`Trying to print the document '${sourceFile!.name}'...`);

    let contentWindow = getFrameWindow();

    if (contentWindow == null) {
      const frame = await initializeFrame();
      contentWindow = frame.contentWindow;
    } else {
      logger.info(`Using the existing iframe '${frameKey}' to print '${sourceFile!.name}'`);
    }

    if (contentWindow == null) {
      logger.error(`Could not initialize the iframe to print '${sourceFile!.name}', contentWindow is null`);
      return;
    }

    contentWindow.focus();
    contentWindow.print();
  }

  useEffect(
    () => {
      if (appSettings.improvePrintDialogLatency && getFrameWindow() == null) {
        initializeFrame();
      }

      return onCleanUp;
    },
    [sourceFile, appSettings.improvePrintDialogLatency]
  );

  return {
    print,
  };
}