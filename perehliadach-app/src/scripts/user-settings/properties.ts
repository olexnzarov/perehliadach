import { ApplicationSetttingsOverrides } from './storage';

export interface ApplicationSettingsProperties {
  showSignaturesAfterDocumentLoad: boolean;
  showSignaturesOnlyWhenAttentionNeeded: boolean;
  improvePrintDialogLatency: boolean;
  defaultZoomValue: string;
  enableZoomOnScroll: boolean;
  enableZoomHotkeys: boolean;
}

export const getDefaultProperties = (): ApplicationSettingsProperties => {
  return {
    showSignaturesAfterDocumentLoad: true,
    showSignaturesOnlyWhenAttentionNeeded: false,
    improvePrintDialogLatency: false,
    defaultZoomValue: '1.25',
    enableZoomOnScroll: true,
    enableZoomHotkeys: true,
  }
};

export const mergeProperties = (
  source: ApplicationSettingsProperties, 
  overrides: ApplicationSetttingsOverrides
): ApplicationSettingsProperties => Object.assign(source, overrides);
