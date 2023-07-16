import { useApplicationSettingsOverrides } from '@/scripts/user-settings';
import { ReactNode } from 'react';
import { FullPageLoader } from './full-page-loader';

export interface EnsureDependenciesProperties {
  children: ReactNode;
}

/** Makes sure everything required is loaded before rendering children. */
export function EnsureDependencies({ children }: EnsureDependenciesProperties) {
  const [overrides] = useApplicationSettingsOverrides();

  if (overrides == null) {
    return <FullPageLoader />;
  }

  return children;
}
