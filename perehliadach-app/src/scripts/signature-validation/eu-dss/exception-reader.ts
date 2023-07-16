import { createLogger } from '@/scripts/app-core/logger';
import { NativeApplication } from '@/scripts/app-core/native-application';

export interface DssCliInnerException {
  error: true;
  cause: string;
  data: string;
  message: string;
}

export class DssCliException extends Error {
  constructor(public readonly inner: Partial<DssCliInnerException>) {
    super(inner.message);
  }
}

export class ExceptionReader {
  private readonly logger = createLogger('eu-dss.exception-reader');

  constructor(private readonly directory: string) {}

  /**
   * Tries to read the exception from the command-line utility.
   * If it can't be found, falls back to pre-defined exceptions.
   */
  public async readException(): Promise<DssCliException> {
    const fs = await NativeApplication.getFileSystem();
    const exceptionFile = `${this.directory}/source/exception.json`;

    this.logger.info('Trying to read the exception...', { file: exceptionFile });

    try {
      if (await fs.exists(exceptionFile)) {
        const contents = await fs.readTextFile(exceptionFile);
        const inner = JSON.parse(contents) as DssCliInnerException;

        this.logger.info('Found the command-line exception', inner);

        return new DssCliException(inner);
      }

      this.logger.warn('Could not find the exception file', { file: exceptionFile });

      return new DssCliException({
        error: true,
        cause: 'INTERNAL',
        data: `File "${exceptionFile}" is missing`,
        message: 'No information on what caused this issue'
      });
    } catch(e: any) {
      this.logger.error('Could not read the exception file:', e.message ?? e.toString(), { file: exceptionFile });
      this.logger.error(e);

      return new DssCliException({
        error: true,
        cause: 'INTERNAL',
        data: 'Could not read the exception file',
        message: e.message ?? e.toString()
      });
    }
  }
}

