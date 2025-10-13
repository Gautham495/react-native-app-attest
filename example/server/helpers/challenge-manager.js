// Simple in-memory challenge store (replace with Redis in production)

const challengeStore = new Map();

 function setChallenge(sessionId, challengeBase64) {
  challengeStore.set(sessionId, {
    value: challengeBase64,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 min TTL
  });
}

 function getChallenge(sessionId) {
  const entry = challengeStore.get(sessionId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    challengeStore.delete(sessionId);
    return null;
  }
  return entry.value;
}

 function clearChallenge(sessionId) {
  challengeStore.delete(sessionId);
}

export {
    setChallenge,
    getChallenge,
    clearChallenge
}