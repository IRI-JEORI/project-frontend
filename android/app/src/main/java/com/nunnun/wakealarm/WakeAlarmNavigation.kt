package com.nunnun.wakealarm

import android.app.Application
import android.content.Intent
import com.facebook.react.ReactApplication
import com.facebook.react.modules.core.DeviceEventManagerModule

object WakeAlarmNavigation {
  private var pendingRequestId: Long? = null

  @Synchronized
  fun capture(application: Application, intent: Intent?) {
    val requestId = intent?.getLongExtra(WakeAlarmService.EXTRA_REQUEST_ID, -1L)?.takeIf { it > 0 } ?: return
    pendingRequestId = requestId
    val reactContext = (application as? ReactApplication)?.reactHost?.currentReactContext ?: return
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("WakeAlarmNotificationOpened", requestId.toDouble())
    pendingRequestId = null
  }

  @Synchronized
  fun consume(): Double? = pendingRequestId?.also { pendingRequestId = null }?.toDouble()
}
