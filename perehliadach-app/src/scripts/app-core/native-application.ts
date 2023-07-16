import { normalizePath } from '../utils';

// TODO: limit allowlist

export class NativeApplication {
  private static getApi() {
    return import('@tauri-apps/api');
  }

  public static async getFileSystem() {
    const { fs } = await this.getApi();
    return fs;
  }

  public static async getDialog() {
    const { dialog } = await this.getApi();
    return dialog;
  }

  public static async getPath() {
    const { path } = await this.getApi();
    return path;
  }

  public static async getEventSystem() {
    const { event } = await this.getApi();
    return event;
  }

  public static async getOperatingSystem() {
    const { os } = await this.getApi();
    return os;
  }

  public static async getWindow() {
    const { window } = await this.getApi();
    return window;
  }

  public static async getAppWindow() {
    const window = await this.getWindow();
    return window.appWindow;
  }

  public static async getShell() {
    const { shell } = await this.getApi();
    return shell;
  }

  public static async getTemporaryDirectory() {
    const os = await NativeApplication.getOperatingSystem();
    const tempDirectory = normalizePath(await os.tempdir());
    return `${tempDirectory}perehliadach`;
  }
}