import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import { verifyAttestationAndExtractPublicKey } from './helpers/attest-verifier.ts';
import {
  setChallenge,
  getChallenge,
  clearChallenge,
} from './helpers/challenge-manager.ts';
import { storeKey } from './helpers/keystore.ts';

const app = express();

app.use(bodyParser.json());

// === 1️⃣ Generate a new challenge for a device ===
app.get('/challenge', async (_, res) => {
  const challenge = crypto.randomBytes(32);

  const challengeBase64 = challenge.toString('base64');

  const sessionId = crypto.randomBytes(8).toString('hex');

  setChallenge(sessionId, challengeBase64);

  return res.json({
    session_id: sessionId,
    challenge: challengeBase64,
  });
});

// === 2️⃣ Verify attestation ===
app.post('/verify-attestation', async (req, res) => {
  try {
    const { key_id, attestation, session_id } = req.body;

    if (!key_id || !attestation || !session_id)
      return res.status(400).json({ error: 'Missing fields' });

    const challengeBase64 = getChallenge(session_id);
    if (!challengeBase64)
      return res.status(400).json({ error: 'Challenge expired or invalid' });

    const publicKeyPem = await verifyAttestationAndExtractPublicKey(
      attestation,
      challengeBase64,
      key_id
    );

    storeKey(key_id, publicKeyPem);
    clearChallenge(session_id);

    return res.json({ status: 'ok', key_id });
  } catch (err) {
    console.error('Attestation verification failed:', err);
    return res.status(400).json({ error: err.message });
  }
});
