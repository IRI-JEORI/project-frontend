package com.nunnun.wakealarm

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.Build
import android.os.IBinder
import android.os.VibrationEffect
import android.os.Vibrator
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.nunnun.MainActivity
import com.nunnun.R

class WakeAlarmService : Service() {
  private var mediaPlayer: MediaPlayer? = null
  private var audioFocusRequest: AudioFocusRequest? = null
  private var activeRequestId: Long? = null
  private val audioManager by lazy { getSystemService(AudioManager::class.java) }
  private val vibrator by lazy { getSystemService(Vibrator::class.java) }

  override fun onCreate() {
    super.onCreate()
    activeRequestId = storedRequestId()
    createNotificationChannel()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      ACTION_STOP -> stopIfCurrent(intent.getLongExtra(EXTRA_REQUEST_ID, INVALID_REQUEST_ID))
      ACTION_START -> startOrReplace(intent.getLongExtra(EXTRA_REQUEST_ID, INVALID_REQUEST_ID))
      else -> storedRequestId()?.let(::startOrReplace)
    }
    return START_STICKY
  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onDestroy() {
    releasePlayback()
    super.onDestroy()
  }

  @Synchronized
  private fun startOrReplace(requestId: Long) {
    if (requestId <= 0 || activeRequestId == requestId && mediaPlayer?.isPlaying == true) return
    releasePlayback()
    activeRequestId = requestId
    preferences().edit().putLong(PREF_ACTIVE_REQUEST_ID, requestId).apply()
    startForeground(NOTIFICATION_ID, buildNotification(requestId))
    try {
      requestAudioFocus()
      startVibration()
      startAlarmSound()
    } catch (_: Exception) {
      stopAndClear()
    }
  }

  @Synchronized
  private fun stopIfCurrent(requestId: Long) {
    if (requestId > 0 && activeRequestId == requestId) stopAndClear()
  }

  private fun stopAndClear() {
    preferences().edit().remove(PREF_ACTIVE_REQUEST_ID).apply()
    activeRequestId = null
    releasePlayback()
    stopForeground(STOP_FOREGROUND_REMOVE)
    stopSelf()
  }

  private fun startAlarmSound() {
    val uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
      ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
    mediaPlayer = MediaPlayer().apply {
      setAudioAttributes(alarmAudioAttributes())
      setDataSource(this@WakeAlarmService, uri)
      isLooping = true
      prepare()
      start()
    }
  }

  private fun alarmAudioAttributes() = AudioAttributes.Builder()
    .setUsage(AudioAttributes.USAGE_ALARM)
    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
    .build()

  private fun requestAudioFocus() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      audioFocusRequest = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
        .setAudioAttributes(alarmAudioAttributes())
        .build()
        .also(audioManager::requestAudioFocus)
    } else {
      @Suppress("DEPRECATION")
      audioManager.requestAudioFocus(null, AudioManager.STREAM_ALARM, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
    }
  }

  private fun startVibration() {
    val pattern = longArrayOf(0, 700, 500)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      vibrator.vibrate(VibrationEffect.createWaveform(pattern, 0))
    } else {
      @Suppress("DEPRECATION")
      vibrator.vibrate(pattern, 0)
    }
  }

  private fun releasePlayback() {
    vibrator.cancel()
    mediaPlayer?.runCatching {
      if (isPlaying) stop()
      release()
    }
    mediaPlayer = null
    audioFocusRequest?.let(audioManager::abandonAudioFocusRequest)
    audioFocusRequest = null
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      @Suppress("DEPRECATION")
      audioManager.abandonAudioFocus(null)
    }
  }

  private fun buildNotification(requestId: Long) = NotificationCompat.Builder(this, CHANNEL_ID)
    .setSmallIcon(R.mipmap.ic_launcher)
    .setContentTitle("깨우기 요청이 왔어요")
    .setContentText("사진 인증을 완료해주세요.")
    .setCategory(NotificationCompat.CATEGORY_ALARM)
    .setPriority(NotificationCompat.PRIORITY_HIGH)
    .setOngoing(true)
    .setContentIntent(PendingIntent.getActivity(
      this,
      requestId.hashCode(),
      Intent(this, MainActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
        putExtra(EXTRA_REQUEST_ID, requestId)
      },
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    ))
    .build()

  private fun createNotificationChannel() {
    getSystemService(NotificationManager::class.java).createNotificationChannel(
      NotificationChannel(CHANNEL_ID, "깨우기 알람", NotificationManager.IMPORTANCE_HIGH).apply {
        description = "친구의 깨우기 요청이 진행 중일 때 표시됩니다."
        setSound(null, null)
        enableVibration(false)
      },
    )
  }

  private fun preferences() = getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)
  private fun storedRequestId() = preferences().getLong(PREF_ACTIVE_REQUEST_ID, INVALID_REQUEST_ID).takeIf { it > 0 }

  companion object {
    const val EXTRA_REQUEST_ID = "wakeAlarmRequestId"
    private const val ACTION_START = "com.nunnun.wakealarm.START"
    private const val ACTION_STOP = "com.nunnun.wakealarm.STOP"
    private const val CHANNEL_ID = "wake_alarm"
    private const val NOTIFICATION_ID = 4101
    private const val PREFERENCES = "wake_alarm"
    private const val PREF_ACTIVE_REQUEST_ID = "active_request_id"
    private const val INVALID_REQUEST_ID = -1L

    fun start(context: Context, requestId: Long) {
      ContextCompat.startForegroundService(context, Intent(context, WakeAlarmService::class.java).apply {
        action = ACTION_START
        putExtra(EXTRA_REQUEST_ID, requestId)
      })
    }

    fun stop(context: Context, requestId: Long) {
      context.startService(Intent(context, WakeAlarmService::class.java).apply {
        action = ACTION_STOP
        putExtra(EXTRA_REQUEST_ID, requestId)
      })
    }
  }
}
