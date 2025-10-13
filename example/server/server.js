import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import { verifyAttestationAndExtractPublicKey } from "./helpers/assertion-verifier.js";
import { verifyAssertion } from "./helpers/attest-verifier.js";
import { setChallenge, getChallenge, clearChallenge } from "./helpers/challenge-manager.js";
import { storeKey, getKey } from "./helpers/keystore.js";

const app = express();

app.use(bodyParser.json());

// === 1️⃣ Generate a new challenge for a device ===
app.get("/api/challenge", async (_, res) => {
  const challenge = crypto.randomBytes(32);

  const challengeBase64 = challenge.toString("base64");

  const sessionId = crypto.randomBytes(8).toString("hex");

  setChallenge(sessionId, challengeBase64);

  return res.json({
    session_id: sessionId,
    challenge: challengeBase64,
  });
});

// === 2️⃣ Verify attestation ===
app.post("/api/verify-attestation", async (req, res) => {
  try {
    const { key_id, attestation, session_id } = req.body;

    if (!key_id || !attestation || !session_id)
      return res.status(400).json({ error: "Missing fields" });

    const challengeBase64 = getChallenge(session_id);
    if (!challengeBase64)
      return res.status(400).json({ error: "Challenge expired or invalid" });

    const publicKeyPem = await verifyAttestationAndExtractPublicKey(
      attestation,
      challengeBase64,
      key_id
    );

    storeKey(key_id, publicKeyPem);
    clearChallenge(session_id);

    return res.json({ status: "ok", key_id });
  } catch (err) {
    console.error("Attestation verification failed:", err);
    return res.status(400).json({ error: err.message });
  }
});

// === 3️⃣ Verify assertion for secure API requests ===
app.post("/api/verify-assertion", async (req, res) => {
  try {
    const { key_id, assertion, session_id } = req.body;
    if (!key_id || !assertion || !session_id)
      return res.status(400).json({ error: "Missing fields" });

    const challengeBase64 = getChallenge(session_id);
    if (!challengeBase64)
      return res.status(400).json({ error: "Challenge expired or invalid" });

    const publicKeyPem = getKey(key_id);
    if (!publicKeyPem)
      return res.status(404).json({ error: "Unknown key_id — attest first" });

    const isValid = verifyAssertion(publicKeyPem, assertion, challengeBase64);
    clearChallenge(session_id); // ensure single-use challenge

    if (!isValid) return res.status(400).json({ error: "Invalid assertion" });

    // ✅ Here you can process a secure action (e.g., update user data)
    return res.json({ status: "verified" });
  } catch (err) {
    console.error("Assertion verification failed:", err);
    return res.status(400).json({ error: err.message });
  }
});