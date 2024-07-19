import 'web-push'

let vapidKeys = {
  publicKey: 'BMkEkgX3pacOflUelgGHtJkbmY8q3ok58hluHNyJREjds23LB6Ds_z7645zTt90ZYMntvmyAKDnOcGp5v-MOMmU',
  privateKey: 'w9eOpv1BG4Jhin4uRwaHzKrwmGXGqUNZjxzOjQIdYUU'
}

push.setVapidDetails('mailto:@code.co.uk', vapidKeys.publicKey, vapidKeys.privateKey)

let sub = {}
push.sendNotification(sub, 'test message')