import type { TurboModule } from 'react-native';

import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  isSupported(): Promise<boolean>;
  generateAppAttestKey(): Promise<string>;
  attestAppKey(keyID: string, challenge: string): Promise<string>;
  generateAppAssertion(keyID: string, challenge: string): Promise<string>;
}

const AppAttest = TurboModuleRegistry.getEnforcing<Spec>('AppAttest');

export default AppAttest;
