import { PersistentJsonStorage } from '../app-core/persistent-json-storage';
import { ApplicationSettingsProperties } from './properties';

export type ApplicationSetttingsOverrides = Partial<ApplicationSettingsProperties>;

export default new PersistentJsonStorage<ApplicationSetttingsOverrides>(
  'settings',
  () => ({})
);
