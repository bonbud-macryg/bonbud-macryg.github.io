import 'web-push'

let vapidKeys = {
  publicKey: 'BMkEkgX3pacOflUelgGHtJkbmY8q3ok58hluHNyJREjds23LB6Ds_z7645zTt90ZYMntvmyAKDnOcGp5v-MOMmU',
  privateKey: 'w9eOpv1BG4Jhin4uRwaHzKrwmGXGqUNZjxzOjQIdYUU'
}

push.setVapidDetails('mailto:@code.co.uk', vapidKeys.publicKey, vapidKeys.privateKey)

let sub = {"endpoint":"https://fcm.googleapis.com/fcm/send/cYpbsEqV2Mc:APA91bHwJIclUhZ70TCfAWTJDyWsPM-uh11yrJc6O_vO2v7fViTaRu5QZbV66HDJUDsHKPXnRGrrkY8IkpTTmYf8QbfeN5GWSmBX762fZ4cGf-RoKYSjgG9XPnc2PQjCYVN48qqPOThK","expirationTime":null,"keys":{"p256dh":"BDDMvBH__dUnbEd0s4Rnfnru6lyIAHMOo9foGoL3miaxkyvyOJrfzinS8kpwFXXGT4qcyRTtBlZaU78Ul80JPWU","auth":"C2K00EPNsopcnB_NxsTssg"}}
push.sendNotification(sub, 'test message')