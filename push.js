const push = require('web-push')


let vapidKeys = {
  publicKey: 'BMkEkgX3pacOflUelgGHtJkbmY8q3ok58hluHNyJREjds23LB6Ds_z7645zTt90ZYMntvmyAKDnOcGp5v-MOMmU',
  privateKey: 'w9eOpv1BG4Jhin4uRwaHzKrwmGXGqUNZjxzOjQIdYUU'
}

push.setVapidDetails('mailto:@code.co.uk', vapidKeys.publicKey, vapidKeys.privateKey)

let sub = {"endpoint":"https://fcm.googleapis.com/fcm/send/clq2lq83lzs:APA91bGXeTxGDYLve7hQNmSfkcSI4dGuUj6AKRZC4A_rDf6b7GVuIzw_WBaWI_Ab9qghVtABtuj3QnWVMhqyrjNdvi9lV4BxBOY7LYNre7AuPtn9mQyNyqzTT2qEvF0fZE9A4TAY71lQ","expirationTime":null,"keys":{"p256dh":"BHPyOZDxazqITnf_lCgWqB2hcD8FWcaRECmpWjNhDbB7x_00SWlYdUjA5cFa7HD52UwQcWjM5PiA9wbQa9u3YDc","auth":"AKYoZrF5IdOzvJObHtEZRg"}}
push.sendNotification(sub, 'test message')