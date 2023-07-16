import { NativeApplication } from '@/scripts/app-core/native-application';
import { createLogger } from './logger';

const generateRandomDirectory = async () => {
  const tempDirectory = await NativeApplication.getTemporaryDirectory();
  return `${tempDirectory}/${crypto.randomUUID().replace(/-/g, '')}`;
};

const logger = createLogger('temporary-directory');

/** Creates a temporary directory to use and then cleans it up. */
export const usingTemporaryDirectory = async <T>(callback: (directory: string) => Promise<T>) => {
  const fs = await NativeApplication.getFileSystem();
  const directory = await generateRandomDirectory();

  await fs.createDir(directory, { recursive: true });

  logger.info(`Created '${directory}'`)
  
  const onCleanUp = async () => {
    await fs.removeDir(directory, { recursive: true });
    logger.info(`Cleaned up '${directory}'`);
  };

  return await callback(directory).finally(onCleanUp);
}