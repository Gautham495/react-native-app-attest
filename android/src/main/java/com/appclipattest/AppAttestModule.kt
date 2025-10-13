package com.appattest

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = AppAttestModule.NAME)
class AppAttestModule(reactContext: ReactApplicationContext) :
  NativeAppAttestSpec(reactContext) {

  override fun getName(): String = NAME

  // iOS-only functionality placeholders
  @ReactMethod
  override fun generateAppAttestKey(promise: Promise) {
    promise.reject("not_supported", "This library's App Attest Implementation is only supported on iOS App.")
  }

  @ReactMethod
  override fun attestAppKey(keyID: String, challenge: String, promise: Promise) {
   promise.reject("not_supported", "This library's App Attest Implementation is only supported on iOS App.")
  }

  @ReactMethod
  override fun generateAppAssertion(keyID: String, challenge: String, promise: Promise) {
    promise.reject("not_supported", "This library's App Attest Implementation is only supported on iOS App.")
  }

  companion object {
    const val NAME = "AppAttest"
  }
}
