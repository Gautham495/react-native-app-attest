// import crypto from 'crypto';

// function verifyAssertion(publicKeyPem, assertionB64, challengeB64) {
//   const challenge = Buffer.from(challengeB64, 'base64');
//   const signature = Buffer.from(assertionB64, 'base64');

//   const verify = crypto.createVerify('SHA256');
//   verify.update(challenge);
//   verify.end();

//   return verify.verify(publicKeyPem, signature);
// }

// export { verifyAssertion };
