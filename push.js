const push = require('web-push')


let vapidKeys = {
  publicKey: 'BMkEkgX3pacOflUelgGHtJkbmY8q3ok58hluHNyJREjds23LB6Ds_z7645zTt90ZYMntvmyAKDnOcGp5v-MOMmU',
  privateKey: 'w9eOpv1BG4Jhin4uRwaHzKrwmGXGqUNZjxzOjQIdYUU'
}

push.setVapidDetails('mailto:@code.co.uk', vapidKeys.publicKey, vapidKeys.privateKey)

let sub = {"endpoint":"https://fcm.googleapis.com/fcm/send/c5xlxP_aluk:APA91bGol3CXRzIf8HfT7NviYJ5x-9t_fpc35_aHBbj47ygwSV0y0EQd_kaEZevn4jnbKei_bnSdpFAihDdnLxVwUkVnSho6u6f_5g_t8x3xNP9g9S0fVulfKV4DGK6v2sa-Q9It-kJY","expirationTime":null,"keys":{"p256dh":"BFYHTj6ntcc_6QUK8ZArY9dpVM6yOI0EETSk5EwzS5sYR-uXk2KXQoBCWRTga-VpRUDPIOKpIsLWhObjxg5w2Q0","auth":"au11zPbH_icBxY1t3yV7Nw"}}
push.sendNotification(sub, 'test message')