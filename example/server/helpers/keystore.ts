// // In-memory key store (replace with database in real app as this is pseudo code for managing keys)
// const keyStore = new Map(); // keyID -> publicKeyPem

// function storeKey(keyID, publicKeyPem) {
//   keyStore.set(keyID, { publicKeyPem, createdAt: Date.now() });
// }

// function getKey(keyID) {
//   const record = keyStore.get(keyID);
//   return record?.publicKeyPem ?? null;
// }

// export { storeKey, getKey };
