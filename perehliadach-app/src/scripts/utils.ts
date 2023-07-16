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
