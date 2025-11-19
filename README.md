<a href="https://gauthamvijay.com">
  <picture>
    <img alt="react-native-app-attest" src="./docs/img/banner.png" />
  </picture>
</a>

# react-native-app-attest

A **React Native TurboModule** that provides a bridge to Apple’s **App Attest API (DeviceCheck framework)**, allowing iOS apps and App Clips to generate **hardware-backed cryptographic keys**,  
perform **device attestation**, and generate **assertions** to securely verify app integrity on your backend.

> [!NOTE]
>
> - This library was originally built for my work app, which uses the Bare React Native CLI (non-Expo).
> - I’ve open-sourced it so the wider React Native community can easily integrate App Attest APIs
> - Pull requests are welcome — especially for Expo support (via custom config plugins) or additional native enhancements.

---

## 📦 Installation

```
npm install react-native-app-attest
```

Then install pods:

```
cd ios && pod install
```

---

> [!IMPORTANT]
>
> - Requires iOS 14+ (App Attest API availability).
> - Works on **real devices only** (Secure Enclave required).
> - App Attest helps detect cloned apps, replay attacks, and tampering of iOS apps or App Clips.

---

## ✅ Required native setup (must-do)

Enable App Attest in Apple Developer (App ID)

Go to Apple Developer → Certificates, IDs & Profiles → Identifiers.

Select your App ID (and the App Clip App ID if using App Clip).

Under Capabilities, enable App Attest / DeviceCheck (if shown).
If “App Attest” is not toggled there, enable the DeviceCheck/App Attest related capability.

Add App Attest entitlement (optional for sandbox testing)
Add to your app’s entitlements file (YourApp.entitlements and App Clip entitlements if applicable):

```
<key>com.apple.developer.devicecheck.appattest-environment</key>
<string>development</string>
```

Use "development" for debug/TestFlight testing (sandbox).

Remove or change to production per Apple docs when releasing to App Store as instructed.

Use a real device
App Attest requires Secure Enclave — simulator will not work.

No AppDelegate changes required
App Attest calls are in-process and handled by the native module. (You still need the usual bridging/native module compile steps.)

Provisioning profile
Ensure the provisioning profile for the App ID contains the App Attest/DeviceCheck capability.

---

## 🔗 Reference Links

- 📘 Apple Docs: [Validating Apps That Connect to Your Server](https://developer.apple.com/documentation/devicecheck/validating_apps_that_connect_to_your_server)
- 🧾 Apple Framework: [DeviceCheck → DCAppAttestService](https://developer.apple.com/documentation/devicecheck/dcappattestservice)
- 🔐 Security Overview: [Protecting Apps with App Attest](https://developer.apple.com/documentation/devicecheck)

---

##  Why This Library Exists

App Attest provides Apple-signed, Secure Enclave–generated keys to help backends verify that a request truly comes from your legitimate app binary.

---

## 🧠 What It Does

This module wraps Apple’s `DCAppAttestService` and exposes three async methods:

```ts
{
  generateAppAttestKey(): Promise<string>;
  attestAppKey(keyID: string, challenge: string): Promise<string>;
  generateAppAssertion(keyID: string, payload: string): Promise<string>;
}
```

---

## ⚙️ Usage

```tsx
import {
  generateAppAttestKey,
  attestAppKey,
  generateAppAssertion,
} from 'react-native-app-attest';
import axios from 'axios';
import { Alert } from 'react-native';

export default async function secureHandshake() {
  const challenge = 'example-server-challenge';

  try {
    const keyID = await generateAppAttestKey();
    const attestation = await attestAppKey(keyID, challenge);

    const payload = JSON.stringify({
      subject: 'Hello',
      message: 'World',
    });

    const assertion = await generateAppAssertion(keyID, payload);

    const { data } = await axios.post(
      'https://your-backend.com/api/verify-app-attest',
      {
        keyID,
        attestation,
        assertion,
        challenge,
      }
    );

    if (data.verified) Alert.alert('✅ Verified', 'App Attest succeeded');
    else Alert.alert('❌ Verification failed', data.reason);
  } catch (err: any) {
    Alert.alert('Error', err.message);
  }
}
```

---

## 🧩 Supported Platforms

| Platform      | Status                               |
| ------------- | ------------------------------------ |
| **iOS (14+)** | ✅ Fully supported                   |
| **App Clip**  | ✅ Supported                         |
| **Android**   | 🚫 Not applicable                    |
| **Simulator** | ⚠️ Not supported (no Secure Enclave) |

---

## 🧰 Backend Verification

You can use this library to verify your app attestation in the backend to secure your API:

https://www.npmjs.com/package/node-app-attest

---

## 🤝 Contributing

Pull requests and discussions are welcome!

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

---

## 🪪 License

MIT © [Gautham Vijayan](https://gauthamvijay.com)

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
