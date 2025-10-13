import axios from 'axios';
import fs from 'fs';
import forge from 'node-forge';
import crypto from 'crypto';

const APPLE_ROOT_URL =
  'https://www.apple.com/certificateauthority/Apple_App_Attestation_Root_CA.pem';
const CERT_PATH = './certs/Apple_App_Attestation_Root_CA.pem';

async function verifyAttestationAndExtractPublicKey(
  attestationB64: string,
  challengeB64: string,
  keyID: string
) {
  // Load Apple root cert (download once)
  if (!fs.existsSync(CERT_PATH)) {
    const { data } = await axios.get(APPLE_ROOT_URL);
    fs.mkdirSync('./certs', { recursive: true });
    fs.writeFileSync(CERT_PATH, data);
  }
  const appleRootPem = fs.readFileSync(CERT_PATH, 'utf8');
  const appleRoot = forge.pki.certificateFromPem(appleRootPem);

  const attestationBytes = Buffer.from(attestationB64, 'base64');
  const asn1 = forge.asn1.fromDer(forge.util.createBuffer(attestationBytes));
  const cert = forge.pki.certificateFromAsn1(asn1);

  // Basic issuer validation
  if (
    cert.issuer.getField('CN').value !== appleRoot.subject.getField('CN').value
  ) {
    throw new Error('Certificate not issued by Apple App Attest Root CA');
  }

  // Nonce check
  const challenge = Buffer.from(challengeB64, 'base64');
  const expectedNonce = crypto
    .createHash('sha256')
    .update(Buffer.concat([challenge, Buffer.from(keyID)]))
    .digest();

  const nonceExt = cert.extensions.find((ext) => ext.id.includes('2.5.29.14'));
  if (!nonceExt) throw new Error('Nonce extension missing');

  const actualNonce = Buffer.from(nonceExt.value, 'binary');
  if (!actualNonce.equals(expectedNonce))
    throw new Error('Nonce mismatch — attestation invalid');

  // Extract PEM public key
  const publicKeyPem = forge.pki.publicKeyToPem(cert.publicKey);
  return publicKeyPem;
}

export { verifyAttestationAndExtractPublicKey };
