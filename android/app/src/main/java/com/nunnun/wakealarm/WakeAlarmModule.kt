package com.nunnun.wakealarm

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WakeAlarmModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String = "WakeAlarm"

  @ReactMethod
  fun start(requestId: Double, promise: Promise) = runServiceCall(requestId, promise, true)

  @ReactMethod
  fun stop(requestId: Double, promise: Promise) = runServiceCall(requestId, promise, false)

  private fun runServiceCall(requestId: Double, promise: Promise, start: Boolean) {
    val id = requestId.toLong()
    if (id <= 0 || id.toDouble() != requestId) {
      promise.reject("INVALID_REQUEST_ID", "requestId must be a positive integer")
      return
    }
    runCatching {
      if (start) WakeAlarmService.start(reactApplicationContext, id)
      else WakeAlarmService.stop(reactApplicationContext, id)
    }.onSuccess { promise.resolve(null) }
      .onFailure { promise.reject("WAKE_ALARM_SERVICE_FAILED", it) }
  }

  @ReactMethod
  fun consumePendingNavigationRequestId(promise: Promise) = promise.resolve(WakeAlarmNavigation.consume())

  @ReactMethod fun addListener(eventName: String) = Unit
  @ReactMethod fun removeListeners(count: Double) = Unit
}
