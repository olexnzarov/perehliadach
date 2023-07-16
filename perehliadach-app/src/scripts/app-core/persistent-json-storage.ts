import { createLogger } from './logger';
import { NativeApplication } from './native-application';

export type GetterOrValue<T> = (() => T) | T;

export class PersistentJsonStorage<T extends Object> {
  private readonly logger = createLogger(`storage.${this.name}`);

  constructor(
    private readonly name: string,
    private readonly defaultValue: GetterOrValue<T>
  ) {}

  private getDefaultValue() {
    return typeof(this.defaultValue) === 'function' 
      ? this.defaultValue() 
      : this.defaultValue;
  }

  public async writeToFile(value: T) {
    const fs = await NativeApplication.getFileSystem();

    await fs.createDir('storage', { dir: fs.BaseDirectory.AppData, recursive: true });

    await fs.writeTextFile(
      `storage/${this.name}.json`, 
      JSON.stringify(value), 
      { dir: fs.BaseDirectory.AppData }
    );
  }

  public async readFromFile(): Promise<T> {
    const fs = await NativeApplication.getFileSystem();

    try {
      const contents = await fs.readTextFile(
        `storage/${this.name}.json`,
        { dir: fs.BaseDirectory.AppData }
      );

      return JSON.parse(contents) as T;
    } catch(e: any) {
      this.logger.warn('Failed to read from the storage', e);
      return this.getDefaultValue();
    }
  }
}