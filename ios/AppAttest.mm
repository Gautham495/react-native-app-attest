#import "AppAttest.h"
#import <DeviceCheck/DeviceCheck.h>
#import <CommonCrypto/CommonCrypto.h>

@implementation AppAttest

RCT_EXPORT_MODULE();

// Generate Key
RCT_EXPORT_METHOD(generateAppAttestKey:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  DCAppAttestService *service = [DCAppAttestService sharedService];
  [service generateKeyWithCompletionHandler:^(NSString * _Nullable keyID, NSError * _Nullable error) {
    if (error) {
      reject(@"key_error", error.localizedDescription, error);
    } else {
      resolve(keyID);
    }
  }];
}

// Helper: SHA256
NSData *sha256(NSData *data) {
  uint8_t digest[CC_SHA256_DIGEST_LENGTH];
  CC_SHA256(data.bytes, (CC_LONG)data.length, digest);
  return [NSData dataWithBytes:digest length:CC_SHA256_DIGEST_LENGTH];
}

// Attest Key
RCT_EXPORT_METHOD(attestAppKey:(NSString *)keyID
                  challenge:(NSString *)challenge
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 14, *)) {
    DCAppAttestService *service = [DCAppAttestService sharedService];

    // Convert raw challenge string → UTF8 → SHA256
    NSData *challengeData = [challenge dataUsingEncoding:NSUTF8StringEncoding];
    NSData *challengeHash = sha256(challengeData);

    [service attestKey:keyID
         clientDataHash:challengeHash
     completionHandler:^(NSData * _Nullable attestation, NSError * _Nullable error) {

      if (error) {
        reject(@"attest_error", error.localizedDescription, error);
      } else {
        resolve([attestation base64EncodedStringWithOptions:0]);
      }
    }];
  } else {
    reject(@"unsupported", @"iOS < 14 not supported", nil);
  }
}

// Generate Assertion
RCT_EXPORT_METHOD(generateAppAssertion:(NSString *)keyID
                  payload:(NSString *)payload
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 14, *)) {
    DCAppAttestService *service = [DCAppAttestService sharedService];

    // payload is a normal UTF-8 JSON string
    NSData *payloadData = [payload dataUsingEncoding:NSUTF8StringEncoding];
    NSData *payloadHash = sha256(payloadData);

    [service generateAssertion:keyID
                clientDataHash:payloadHash
            completionHandler:^(NSData * _Nullable assertion, NSError * _Nullable error) {

      if (error) {
        reject(@"assert_error", error.localizedDescription, error);
      } else {
        resolve([assertion base64EncodedStringWithOptions:0]);
      }
    }];
  } else {
    reject(@"unsupported", @"iOS < 14 not supported", nil);
  }
}

@end
