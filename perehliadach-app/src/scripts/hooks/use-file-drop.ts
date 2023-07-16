import { useEffect } from 'react';
import { NativeApplication } from '../app-core/native-application';
import { createLogger } from '../app-core/logger';

export interface FileDropProperties {
  onDrop: (files: string[]) => void;
  onCancel: () => void;
  onHover: (files: string[]) => void;
}

const logger = createLogger('file-drop');

export const useFileDrop = (props: FileDropProperties) => {
  const createSubscriptions = async () => {
    const es = await NativeApplication.getEventSystem();

    let unsubscribeOnDrop: Awaited<ReturnType<typeof es.listen>>;
    let unsubscribeOnCancel: Awaited<ReturnType<typeof es.listen>>;
    let unsubscribeOnHover: Awaited<ReturnType<typeof es.listen>>;
    
    const unsubscribe = () => {
      unsubscribeOnDrop?.();
      unsubscribeOnCancel?.();
      unsubscribeOnHover?.();

      logger.info('File drop listeners were cleaned up');
    };

    logger.info('Initializing file drop listeners...');

    try {
      unsubscribeOnDrop = await es.listen<string[]>(
        es.TauriEvent.WINDOW_FILE_DROP, 
        (e) => { 
          logger.info('Files were dropped onto the application', e.payload);
          props.onDrop(e.payload);
        }
      );
  
      unsubscribeOnCancel = await es.listen<unknown>(
        es.TauriEvent.WINDOW_FILE_DROP_CANCELLED, 
        (e) => {
          props.onCancel();
        }
      );
  
      unsubscribeOnHover = await es.listen<string[]>(
        es.TauriEvent.WINDOW_FILE_DROP_HOVER, 
        (e) => {
          logger.info('Files were hovered over the application', e.payload);
          props.onHover(e.payload);
        }
      );

      logger.info('File drop listeners were initialized');
    } catch(e) {
      unsubscribe();

      logger.error('Failed to initialize file drop listeners');
      logger.error(e);

      throw e;
    }

    return unsubscribe;
  };

  useEffect(
    () => {
      const unsubscribe = createSubscriptions();
      return () => { 
        unsubscribe.then(fn => fn());
      }
    },
    []
  );
};
