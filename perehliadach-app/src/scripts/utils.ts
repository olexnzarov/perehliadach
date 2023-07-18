import path from 'path';
import { NativeApplication } from './app-core/native-application';
import { RawReportArtifact, SourceFile } from './signature-validation/eu-dss/output-reader';

export const normalizePath = (path: string) => path.replace(/\\/g, '/');

export const arrayify = <T = any>(value: T | T[]): T[] => {
  if (value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const supportedExtensions = ['asice', 'asics', 'sce', 'scs'];

export const getSupportedContainerExtensions = () => supportedExtensions;

export const isSupportedContainerExtension = (file: string) => {
  const extension = file.split('.').at(-1);
  return supportedExtensions.find(e => e === extension);
};

const getFilePath = (file: SourceFile | RawReportArtifact) => {
  return path.parse('content' in file ? file.file : file.name); 
};

const saveFile = async (path: string, file: SourceFile | RawReportArtifact) => {
  const fs = await NativeApplication.getFileSystem();

  if ('content' in file) {
    await fs.writeTextFile(path, file.content);
    return;
  }

  await fs.writeBinaryFile(path, file.buffer);
};

export const saveDocument = async (file: SourceFile | RawReportArtifact) => {
  const dialog = await NativeApplication.getDialog();
  const { name: fileName, base: fileBase, ext: fileExtension } = getFilePath(file);

  let savePath = await dialog.save({ 
    title: `Save ${fileBase}`, 
    defaultPath: fileName,
    filters: [{ name: 'File Format', extensions: [fileExtension.substring(1)] }],
  });

  if (savePath == null) {
    return;
  }

  if (!savePath.endsWith(fileExtension)) {
    savePath = `${savePath}${fileExtension}`;
  }

  await saveFile(savePath, file);
};
