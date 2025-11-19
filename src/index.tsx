import AppAttest from './NativeAppAttest';

/**
 * Generate an App Attest key (if not already created).
 */
export async function generateAppAttestKey(): Promise<string> {
  return await AppAttest.generateAppAttestKey();
}

/**
 * Attest the key using a challenge provided by your backend.
 */
export async function attestAppKey(
  keyID: string,
  challenge: string
): Promise<string> {
  return await AppAttest.attestAppKey(keyID, challenge);
}

/**
 * Generate an assertion for API request validation.
 */
export async function generateAppAssertion(
  keyID: string,
  string: string
): Promise<string> {
  return await AppAttest.generateAppAssertion(keyID, string);
}

export default {
  generateAppAttestKey,
  attestAppKey,
  generateAppAssertion,
};
