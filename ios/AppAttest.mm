#import "AppAttest.h"
#import <DeviceCheck/DeviceCheck.h>

@implementation AppAttest

RCT_EXPORT_MODULE();

// Check if App Attest is supported
RCT_EXPORT_METHOD(isSupported:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  DCAppAttestService *service = [DCAppAttestService sharedService];
  if (@available(iOS 14.0, *)) {
    BOOL supported = service.isSupported;
    resolve(@(supported));
  } else {
    resolve(@(NO));
  }
}

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

// Attest Key
RCT_EXPORT_METHOD(attestAppKey:(NSString *)keyID
                  challenge:(NSString *)challenge
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  DCAppAttestService *service = [DCAppAttestService sharedService];
  NSData *challengeData = [[NSData alloc] initWithBase64EncodedString:challenge options:0];
  
  [service attestKey:keyID clientDataHash:challengeData completionHandler:^(NSData * _Nullable attestation, NSError * _Nullable error) {
    if (error) {
      reject(@"attest_error", error.localizedDescription, error);
    } else {
      resolve([attestation base64EncodedStringWithOptions:0]);
    }
  }];
}

// Generate Assertion
RCT_EXPORT_METHOD(generateAppAssertion:(NSString *)keyID
                  challenge:(NSString *)challenge
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  DCAppAttestService *service = [DCAppAttestService sharedService];
  NSData *challengeData = [[NSData alloc] initWithBase64EncodedString:challenge options:0];
  
  [service generateAssertion:keyID clientDataHash:challengeData completionHandler:^(NSData * _Nullable assertion, NSError * _Nullable error) {
    if (error) {
      reject(@"assert_error", error.localizedDescription, error);
    } else {
      resolve([assertion base64EncodedStringWithOptions:0]);
    }
  }];
}

@end
