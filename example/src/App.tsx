import 'react-native-quick-base64';
import { btoa } from 'react-native-quick-base64';
import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import {
  generateAppAttestKey,
  attestAppKey,
  generateAppAssertion,
} from 'react-native-app-attest';
import axios from 'axios'; // 🚀 add axios for backend call

// Helper: Convert server challenge to base64 if not already
const sampleChallengeBase64 = btoa('example-server-challenge');

export default function App() {
  const [keyID, setKeyID] = useState<string | null>(null);
  const [attestation, setAttestation] = useState<string | null>(null);
  const [assertion, setAssertion] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<string | null>(
    null
  ); // 🚀 new

  const handleGenerateKey = async () => {
    try {
      const key = await generateAppAttestKey();
      setKeyID(key);
      Alert.alert('✅ Key Generated', key);
    } catch (err: any) {
      Alert.alert('❌ Error Generating Key', err.message);
    }
  };

  const handleAttestKey = async () => {
    if (!keyID) {
      Alert.alert('Missing Key ID', 'Generate a key first.');
      return;
    }

    try {
      const result = await attestAppKey(keyID, sampleChallengeBase64);
      setAttestation(result);
      Alert.alert('✅ Attestation Generated', result.slice(0, 50) + '...');
    } catch (err: any) {
      Alert.alert('❌ Error Attesting Key', err.message);
    }
  };

  const handleGenerateAssertion = async () => {
    if (!keyID) {
      Alert.alert('Missing Key ID', 'Generate a key first.');
      return;
    }

    try {
      const result = await generateAppAssertion(keyID, sampleChallengeBase64);
      setAssertion(result);
      Alert.alert('✅ Assertion Generated', result.slice(0, 50) + '...');
    } catch (err: any) {
      Alert.alert('❌ Error Generating Assertion', err.message);
    }
  };

  // 🚀 New function: send attestation and assertion to backend
  const handleVerifyWithBackend = async () => {
    if (!keyID || !attestation || !assertion) {
      Alert.alert(
        '❌ Missing Data',
        'Generate key, attestation, and assertion first.'
      );
      return;
    }

    try {
      const response = await axios.post(
        'https://your-backend.com/api/verify-app-attest',
        {
          keyID,
          attestation,
          assertion,
          challenge: sampleChallengeBase64,
        }
      );

      const { verified, reason } = response.data;
      setVerificationResult(
        verified ? '✅ Verified' : `❌ Failed: ${reason || 'Unknown'}`
      );
      Alert.alert(
        verified ? '✅ App Attest Verified' : '❌ Verification Failed',
        reason || ''
      );
    } catch (err: any) {
      Alert.alert('❌ Backend Error', err.message);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🔐 App Attest Example</Text>

        <Button title="Generate App Attest Key" onPress={handleGenerateKey} />
        <View style={styles.spacer} />

        <Button title="Attest Key with Challenge" onPress={handleAttestKey} />
        <View style={styles.spacer} />

        <Button title="Generate Assertion" onPress={handleGenerateAssertion} />
        <View style={styles.spacer} />

        {/* 🚀 New button to verify on backend */}
        <Button title="Verify with Backend" onPress={handleVerifyWithBackend} />
        <View style={styles.spacer} />

        <View style={styles.resultBox}>
          <Text style={styles.label}>Key ID:</Text>
          <Text selectable style={styles.value}>
            {keyID || 'Not generated yet'}
          </Text>

          <Text style={styles.label}>Attestation:</Text>
          <Text selectable style={styles.value}>
            {attestation || 'None'}
          </Text>

          <Text style={styles.label}>Assertion:</Text>
          <Text selectable style={styles.value}>
            {assertion || 'None'}
          </Text>

          {/* 🚀 Show backend verification result */}
          <Text style={styles.label}>Verification Result:</Text>
          <Text selectable style={styles.value}>
            {verificationResult || 'Not verified yet'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  spacer: {
    height: 20,
  },
  resultBox: {
    marginTop: 24,
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#333',
  },
});
