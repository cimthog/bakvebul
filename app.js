var con=require('./config/database')
var cm=require('./model/common')

var express=require("express")
var app=express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyparser=require("body-parser")
var routes=require('./routes')
var moment = require('moment');
var fn = require('./firebase/firebase');
const uniquid = require('uniquid');
const uniqid = require('uniqid')
app.use(bodyparser.json());
app.use(routes);
var constant=require('./constant/constant');
var constantAR=require('./constant/constantAr');
  
  
var user=require('./routes/user.js');
var category=require('./routes/category.js');
var job=require('./routes/job.js');
var gallery=require('./routes/gallery.js');
var rating=require('./routes/rating.js');
var ticket=require('./routes/ticket');
var notification=require('./routes/notification.js');
var chat=require('./routes/chat.js');
var dashboard=require('./routes/dashboard.js');
var coupon=require('./routes/coupon.js');
var service=require('./routes/service.js');
var work=require('./routes/work.js');
var favourite=require('./routes/favourite.js')
var fannanpoint=require('./routes/fannan_point.js');
var package=require('./routes/package.js');
app.use('/',user);
app.use('/',service);
app.use('/',category);
app.use('/',job);
app.use('/',gallery);
app.use('/',rating);
app.use('/',notification);
app.use('/',ticket);
app.use('/',chat);
app.use('/',dashboard);
app.use('/',favourite);
app.use('/',coupon);
app.use('/',work);
app.use('/',fannanpoint);
app.use('/',package);
http.listen(4005);
const online_users = []
io.on('connection', (socket) => {
    console.log('connection');
    
    socket.on('user_connection', function(user_id) {
      console.log('user_connection - '+user_id);
      online_users.push(user_id);
      socket.my_user_id = user_id;
      socket.broadcast.emit('online', user_id);
    });
  
    socket.on('pong', function(user_id) {
      online_users.push(user_id);
      socket.broadcast.emit('online', user_id);
    });
  
    
    socket.on('sendTyping', function(data) {
      console.log('sendTyping - '+JSON.stringify(data));
        socket.broadcast.emit('sendTyping', data);
        // io.sockets.in(data.usena).emit('sendTyping', data);
    });
     
    socket.on('removeTyping', function(data) {
        console.log('removeTyping - '+JSON.stringify(data));
        socket.broadcast.emit('removeTyping', data);
        //  io.sockets.in(data.wantToCall).emit('removeTyping', data);
    });
  
    socket.on('newmessage', async (data) => {
      socket.broadcast.emit('newmessage', data);
      console.log('newmessage - '+data);
      console.log('user_pub_id - ',data.user_pub_id, 'artist_pub_id - ', data.artist_pub_id, 'message - ', data.message)
      // if(data.message == null || data.message == '' || data.message == undefined)data.message = '';
      if(data.user_pub_id && data.artist_pub_id && data.chat_type){
        if(data.image == null || data.image == '' || data.image == undefined)data.image = 'NA';
          cm.getMyChatData(data.user_pub_id,data.artist_pub_id, function(err, chat_result) {
          console.log('chat_data',chat_result);
          var thread_id = '';
          if(chat_result == null || chat_result == '' || chat_result == undefined){
          }
          else{
            chat_result = JSON.parse(JSON.stringify(chat_result));
            data.thread_id = chat_result[0].thread_id;
          }
          if(data.thread_id == null || data.thread_id == '' || data.thread_id == undefined)thread_id = uniquid();
          else thread_id = data.thread_id;
          console.log('thread_id',thread_id);

          var parData='';
          if(data.chat_type == 1){
              parData={
              thread_id:thread_id,
              user_pub_id:data.user_pub_id,
              artist_pub_id:data.artist_pub_id,
              chat_type:data.chat_type,
              message:data.message,
              send_at:(new Date()).valueOf().toString()
            }
          }
          if(data.chat_type == 2){
              parData={
              thread_id:thread_id,
              user_pub_id:data.user_pub_id,
              artist_pub_id:data.artist_pub_id,
              chat_type:data.chat_type,
              // message:data.message,
              send_at:(new Date()).valueOf().toString(),
              image:data.image
            }
            if(data.message == null || data.message == '' || data.message == undefined)var flag = '';
            else parData.message = data.message;
          }
          con.query('insert into chat set ?', [parData], function (err) {
              if(err){
                console.log('err',err);
              }else{
                  console.log('save');
              }
          })
        })
      }
    });
    
  
    socket.on('checkUserStatus',function(data){
      console.log('checkUserStatus - '+data.receiver_id, data.sender_id);
      //console.log(online_users);
      var index = online_users.indexOf(data.receiver_id);
      socket.broadcast.emit('checkUserStatus', {'receiver_id':data.receiver_id,"status":"Online"});
      if (index > -1) {
        socket.broadcast.emit('checkUserStatus', {'receiver_id':data.receiver_id,"status":"Online"});
        console.log('Online:-'+data.receiver_id, data.sender_id);
      }
      else
      {
        socket.broadcast.emit('checkUserStatus', {'receiver_id':data.receiver_id,"status":"Offline"});
        console.log('Offline:-'+data.receiver_id, data.sender_id);
      }
    });
  
    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
      console.log('disconnect : '+socket.my_user_id);
        var index = online_users.indexOf(socket.my_user_id);
        if (index > -1) {
          online_users.splice(index, 1);
        }
      socket.broadcast.emit('offline', socket.my_user_id);
    });
  
  });