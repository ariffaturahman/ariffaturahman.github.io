const webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BDdmuhigYA6SGcjwRT8rRBIHWHFblbUQGM4YjKcbf0g_RRTuEhgKuFth22OMWJUdwqEaBIwvfz9lJEoFIC6zAnw",
    "privateKey": "2UD1Di8zzfTKUdB9y3Qvs2OKHl8XEht1_sQDah42Gno"
};


webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
let pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/cZKnt2lqpks:APA91bFl20eIj8O20gLp5Kstgo9bbeDpcWYtKvNTJe4IglE6_iXzxv2Tp1Z7ejh71KTu12J9zB-jJWRQIokvx280GWydE-N_Wvzh294UKXrkWe7aDNxt74euSTBrOQZJV_ssWoehm8rJ",
    "keys": {
        "p256dh": "BLLovV7wXZlBAkBRJimldmUEMmtJ7NQ4Fbp2AUfYd2HXdCIlfV/XkgQw2OIq0UZCK8kQzkhv1TA/UNqAYgNAht0=",
        "auth": "0Ne596W1cCKV51EqXhE/rA=="
    }
};
const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

const options = {
    gcmAPIKey: '1009546042754',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);