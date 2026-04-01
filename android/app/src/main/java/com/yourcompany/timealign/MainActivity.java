package com.yourcompany.timealign;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createAlarmChannel();
        }
    }

    private void createAlarmChannel() {
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;

        // 기존 채널 삭제 후 재생성 (소리 설정 반영)
        nm.deleteNotificationChannel("timealign_alarm_v2");

        Uri soundUri = Uri.parse("android.resource://" + getPackageName() + "/raw/alarm");
        AudioAttributes audioAttr = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build();

        NotificationChannel channel = new NotificationChannel(
                "timealign_alarm_v2",
                "TimeAlign Alarm",
                NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("TimeAlign 알람 알림");
        channel.setSound(soundUri, audioAttr);
        channel.enableVibration(true);
        channel.setShowBadge(true);
        nm.createNotificationChannel(channel);
    }
}
