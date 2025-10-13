import crypto from "crypto";

 function verifyAssertion(publicKeyPem:string, assertionB64:string, challengeB64:string) {
  const challenge = Buffer.from(challengeB64, "base64");
  const signature = Buffer.from(assertionB64, "base64");

  const verify = crypto.createVerify("SHA256");
  verify.update(challenge);
  verify.end();

  return verify.verify(publicKeyPem, signature);
}

export {
    verifyAssertion
}