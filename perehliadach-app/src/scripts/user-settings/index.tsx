import { useRecoilState } from 'recoil';
import { ApplicationSettingsProperties, getDefaultProperties, mergeProperties } from './properties';
import { getRecoil, setRecoil } from 'recoil-nexus';
import globalState from '../global-state/settings-overrides';

export const useApplicationSettingsOverrides = () => useRecoilState(globalState);

export const useApplicationSettings = () => {
  const [overrides, setOverrides] = useApplicationSettingsOverrides();

  return [
    mergeProperties(getDefaultProperties(), overrides!), 
    setOverrides
  ] as [ApplicationSettingsProperties, typeof setOverrides];
};

export const getApplicationSettings = () => {
  const overrides = getRecoil(globalState) ?? {};
  return mergeProperties(getDefaultProperties(), overrides);
};

export const resetApplicationSettings = () => setRecoil(globalState, {});
