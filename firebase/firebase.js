
var path = require("path");
var admin = require('firebase-admin');

var serviceAccount = require('./privatekey.json');

module.exports.pushnotification = function(title, msg, receiver_token,type) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://bekvebul.firebaseio.com"
        });
    }
    console.log('balram');
    console.log(receiver_token);
    console.log(title);
    console.log(msg);
    var message = {
        android: {
            ttl: 10000,
            priority: 'high',
            data: {
                title: title,
                type: type,
                body: decodeURIComponent(msg)
            }
        },
        apns: {
            payload: {
                ttl: 10000,
                priority: 'high',
                data: {
                    title: title,
                    type: type,
                    body: decodeURIComponent(msg)
                },
                aps: {
                    badge: 0,
                    sound: "bingbong.aiff",
                    alert: decodeURIComponent(msg),
                    "content-available": 1
                }
            }
        },
        token: receiver_token
    };
    admin.messaging().send(message).then(res => {
        console.log("Success", res)
    }).catch(err => {
        console.log("Error:", err)
    })
}

module.exports.pushnotificationticket = function(title, msg, receiver_token,type,ticket_id) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://rojgar-136fc.firebaseio.com"
        });
    }
    console.log('balram');
    console.log(receiver_token);
    console.log(title);
    console.log(msg);
    ticket_id = JSON.stringify(ticket_id);
    var message = {
        android: {
            ttl: 10000,
            priority: 'high',
            data: {
                title: title,
                type: type,
                ticket_id:ticket_id,
                body: decodeURIComponent(msg)
            }
        },
        apns: {
            payload: {
                ttl: 10000,
                priority: 'high',
                data: {
                    title: title,
                    type: type,
                    ticket_id:ticket_id,
                    body: decodeURIComponent(msg)
                },
                aps: {
                    badge: 0,
                    sound: "bingbong.aiff",
                    alert: decodeURIComponent(msg),
                    "content-available": 1
                }
            }
        },
        token: receiver_token
    };
    admin.messaging().send(message).then(res => {
        console.log("Success", res)
    }).catch(err => {
        console.log("Error:", err)
    })
}

module.exports.pushNotificationChat = function(title, msg, receiver_token,type = '10001',sender_pub_id,sender_name) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://rojgar-136fc.firebaseio.com"
        });
    }
   
    var message = {
        android: {
            ttl: 10000,
            priority: 'high',
            data: {
                title: title,
                // role: role,
                type: type,
                sender_pub_id: sender_pub_id,
                sender_name: sender_name,
                body: decodeURIComponent(msg)
            }
        },
        apns: {

            payload: {
                ttl: 10000,
                priority: 'high',
                data: {
                    title: title,
                    // role: role,
                    type: type,
                    sender_pub_id: sender_pub_id,
                    sender_name: sender_name,
                    body: decodeURIComponent(msg)
                },
                aps: {
                    badge: 0,
                    sound: "bingbong.aiff",
                    alert: decodeURIComponent(msg),
                    "content-available": 1
                }
            }
        },
        token: receiver_token
     };

    admin.messaging().send(message).then(res => {
        console.log("Success", res)
    }).catch(err => {
        console.log("Error:", err)
    })
}

module.exports.pushNotificationChat11 = function(title, msg, receiver_token,type = '10001',sender_pub_id,sender_name,sender_image) {
    if (!admin.apps.length) {

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://rojgar-136fc.firebaseio.com"
        });
    }
    var message = {
        android: {
            ttl: 10000,
            priority: 'high',
            data: {
                title: title,
                // role: role,
                type: type,
                sender_pub_id: sender_pub_id,
                sender_name: sender_name,
                sender_image:sender_image,
                body: decodeURIComponent(msg)
            }
        },
        apns: {

            payload: {
                ttl: 10000,
                priority: 'high',
                data: {
                    title: title,
                    // role: role,
                    type: type,
                    sender_pub_id: sender_pub_id,
                    sender_name: sender_name,

                    body: decodeURIComponent(msg)
                },
                aps: {
                    badge: 0,
                    sound: "bingbong.aiff",
                    alert: decodeURIComponent(msg),
                    "content-available": 1
                }
            }
        },
        token: receiver_token
     };

    admin.messaging().send(message).then(res => {
        console.log("Success", res)
    }).catch(err => {
        console.log("Error:", err)
    })
}