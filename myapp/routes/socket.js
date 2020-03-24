const {RECEIVE_NOTIFICATION ,RECEIVE_NOTIFICATION_ERROR} = require('../config/socketEvents');
var notificationModel = require('../models/notificationModel');
var connectedUsers = {};

module.exports = function (io) {
    io.on('connection', function (socket) {
        socket.on('join', function (userEmail) { 
            connectedUsers[userEmail] = connectedUsers[userEmail] || []; //if already assign else new empty
            connectedUsers[userEmail].push(socket.id);
            notify(userEmail, RECEIVE_NOTIFICATION , connectedUsers);
            // console.log('inside the join',connectedUsers)

        })

        socket.on('readMessage', (data) => {
            if (data.length > 0) {
                notificationModel.update({ _id: { $in: data } }, { $set: { 'notificationState': true } }, { multi: true })
                .exec(function (err, resp) {
                    // console.log('response after update', resp);
                })
            }
        })

        socket.on('sendNotification', (data) => { 
            let receiverId = data.recieverId;
            if (receiverId in connectedUsers) { //if online save and emit
                saveNotification(data).then(resp => {
                    // console.log('connected are',connectedUsers);
                    notify(receiverId, RECEIVE_NOTIFICATION, resp)
                }).catch(err => {
                    notify(receiverId, RECEIVE_NOTIFICATION_ERROR, err)
                })
            } else { //otherwise save to db do not emit
                saveNotification(data).then(resp => {
                    console.log('response after saving user online user not connected', resp)
                })
            }
        })

        socket.on('disconnect', () => { //on connection close delete socket id
            let socId = socket.id;
            // console.log('socket id to delete', socId);
            for (let user in connectedUsers) { //find on the basis of socket id and delete
                let foundIndex = connectedUsers[user].indexOf(socId)
                if (foundIndex >= 0) {
                    connectedUsers[user].splice(foundIndex, 1);
                    // console.log('all users are', connectedUsers)
                    if (!connectedUsers[user].length) {
                        // console.log('deleting user', connectedUsers[user]);
                        delete connectedUsers[user];      //if no sockets
                    }
                    // console.log('deleted the user now all users are', connectedUsers);
                }
            }
        })

        function saveNotification(data) { // To create new notification
           return new Promise(function (resolve, reject) {
                let newNotification = new notificationModel({
                    userId: data.recieverId,
                    SenderId: data.senderId,
                    redirectUrl: data.pageLink,
                    message: data.notificationMessage
                })
                // console.log('newNotification before saving', newNotification);
                newNotification.save(function (err, data) {
                    if (err) {
                        // console.log('error is ',err)
                        reject(err)
                    }
                    // console.log('data is ',data);
                    resolve(data);
                })
            })
        }

        function notify(user, eventType, data) { //send recieve notification to each user in array
            // console.log('inside the notification')
            for (let i = 0; i < connectedUsers[user].length; i++) { 
                io.to(connectedUsers[user][i]).emit(eventType, data);
            }
        }
    })
}

// io.on('connection', function (socket) {
//  //register user by email and show online
//  socket.on('join',function(userEmail){
//    //join rooom

//    console.log('joining room called',userEmail);
//     console.log('active users are ',io.sockets.adapter.rooms);

//   var allRooms = io.sockets.adapter.rooms;
//    if(userEmail in allRooms){
//      // console.log('room is already created');

//    }else{
//      socket.join(userEmail);
//    }
//  })

//  socket.on('readMessage',(data)=>{
//    if(data.length > 0){
//      notificationModel.update({_id:{$in:data}},{$set:{'notificationState':true}},{multi : true})
//      .exec(function(err,resp){
//        console.log('response after update',resp);
//      })
//    }

//  })

//  socket.on('sendNotification',(data)=>{
//    // if the user is online send notificattion then save to db
//    if(data.recieverId in io.sockets.adapter.rooms){
//      console.log('active rooms are',io.sockets.adapter.rooms)
//      saveNotification(data).then(resp=>{
//        io.sockets.in(data.recieverId).emit('recievNotification',resp);
//      }).catch(err=>{
//        io.sockets.in(data.SenderId).emit('recievSendError',data);
//      })
//    }else{ //otherwise save to db do not emit
//      saveNotification(data).then(resp=>{
//        console.log('response after saving user online',resp)
//      })
//    }
//  })

//  function saveNotification(data){ //function to create
//    var prom = new Promise(function (resolve, reject) {
//      let newNotification = new notificationModel({
//        userId : data.recieverId,
//        SenderId : data.senderId,
//        redirectUrl : data.pageLink,
//        message: data.notificationMessage
//      })
//      console.log('newNotification before saving',newNotification);
//      newNotification.save(function(err,data){
//        if(err){
//          reject(err)
//        }
//        resolve(data);
//      })
//    })
//  return prom;
// }

// })
