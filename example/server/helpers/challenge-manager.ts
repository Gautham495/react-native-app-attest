// Simple in-memory challenge store replace with database in real app as this is pseudo code for managing keys)
const challengeStore = new Map();

function setChallenge(sessionId: string, challengeBase64: string) {
  challengeStore.set(sessionId, {
    value: challengeBase64,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 min TTL
  });
}

function getChallenge(sessionId: string) {
  const entry = challengeStore.get(sessionId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    challengeStore.delete(sessionId);
    return null;
  }
  return entry.value;
}

function clearChallenge(sessionId: string) {
  challengeStore.delete(sessionId);
}

export { setChallenge, getChallenge, clearChallenge };
