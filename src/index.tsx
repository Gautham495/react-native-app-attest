import AppAttest from './NativeAppAttest';

/**
 * Check if AppAttest is supported in the current device
 */
export async function isSupported(): Promise<boolean> {
  return AppAttest.isSupported();
}

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
  challengeBase64: string
): Promise<string> {
  return await AppAttest.attestAppKey(keyID, challengeBase64);
}

/**
 * Generate an assertion for API request validation.
 */
export async function generateAppAssertion(
  keyID: string,
  challengeBase64: string
): Promise<string> {
  return await AppAttest.generateAppAssertion(keyID, challengeBase64);
}

export default {
  generateAppAttestKey,
  attestAppKey,
  generateAppAssertion,
};
