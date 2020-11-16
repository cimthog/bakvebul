var express=require("express");
var bodyparser=require('body-parser');
var con=require('../config/database');
var uniqid=require('uniqid');
var app=express.Router();
var app=express();
var routes = express();
var routes = require('../routes')
var randomstring = require("randomstring");
var moment = require('moment');

var cm=require('../model/common')
var constant=require('../constant/constant');
var constantAR=require('../constant/constantAr');
const lang_head=require('./check_lang');

app.use( async function(req, res, next) { 
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	await lang_head.checkLang(req, function(result,err){
		constant = result;
		return next();
	});
});

var base_url = constant.base_url;
var base_url_image = constant.base_url_image;
// var bcrypt=require('bcrypt');
var multer = require('multer');
var validator = require("email-validator");
app.use(routes);

app.post("/generateTicket", function(req, res) {
    if (!req.body.title || !req.body.user_pub_id || !req.body.description) {
		cm.responseMessage(constant.Zero,constant.chkfield,res)
    } else {
        cm.getUserStatus(req.body.user_pub_id, function(err, result) {
            if (err) {
        		cm.responseMessage(constant.Zero,err,res)
            } else {
                var parData = {
                    user_pub_id: req.body.user_pub_id,
                    title: req.body.title,
                    description: req.body.description,
                    created_at: (new Date()).valueOf().toString(),
                    date_time: moment(new Date()).format('DD MMM YYYY HH:MM')
                }
                con.query('INSERT INTO ticket SET ?', parData, function(error, results) {
                    if (error) {
                        console.log("error ocurred", error)
                        cm.responseMessage(constant.Zero,error,res)
                    } else {
                        console.log(result)
                        result = JSON.parse(JSON.stringify(result));
                        result = result[0]
                        var msg = '';
                        msg += '<div class="container">';
                        // msg += '<img src="'+constant.Mail_Small_logo_url+'"><br><br>';
                        msg += '<b>'+constant.HELLO+' '+result.name+'</b><br>';
                        msg += '<span>'+constant.ticket_successfully_send_to_admin+'</span><br>';
                        msg += '<h6>'+constant.ticket_title+'</h6>';
                        msg += '<span>'+req.body.title+'</span><br>';
                        msg += '<h6>'+constant.ticket_desc+'</h6>';
                        msg += '<span>'+req.body.description+'</span><br><br><br>';
                        // msg += '<img src="'+constant.Mail_logo_url+'" width="100"><br><br>';
                        // msg += '<b>'+constant.Thanks+'</b><br>';
                        msg += '<b>'+constant.SIGNATURE+'</b>';
                        msg += '</div>';

                        cm.sendmail(result.email_id,constant.ticket_add_subject, msg);
                        cm.saveAndSendNotification( req.body.user_pub_id, constant.ticket_confirmation_title, constant.ticket_confirmation_msg, constant.ticket_add_notification_type,result.device_token);

                        var msg_admin = '';
                        msg_admin += '<div class="container">'
                        // msg_admin += '<img src="'+constant.Mail_Small_logo_url+'"><br><br>'
                        msg_admin += '<span>'+constant.ticket_received+'</span><br>'
                        msg_admin += '<h6>'+constant.ticket_title+'</h6>'
                        msg_admin += '<span>'+req.body.title+'</span><br>'
                        msg_admin += '<h6>'+constant.ticket_desc+'</h6>'
                        msg_admin += '<span>'+req.body.description+'</span><br><br><br>'
                        msg_admin += '<b>'+constant.Thanks+'</b><br>'
                        msg_admin += '<b>'+constant.User_name+' '+result.name+'</b><br>'
                        msg_admin += '<b>'+constant.User_mobile+' '+result.country_code+''+result.mobile_no+'</b><br>'
                        // if(user.role == 3)msg_admin += '<b>'+constant.User_add+' '+user.house_number+', '+user.street_name+', '+city+', '+state+', '+country+'</b><br>'
                        msg_admin += '<b>'+constant.User_email+' '+result.email_id+'</b><br>'
                        msg_admin += '</div>'
                        cm.sendmail(constant.admin_support_mail,constant.ticket_add_subject, msg_admin);

		                cm.responseMessage(constant.One,constant.TIECKET_GENERATED,res)
                    }
                });
            }
        });
    }
});
app.post('/getMyticket', function(req, res) {
    if (!req.body.user_pub_id) {
		cm.responseMessage(constant.Zero,constant.chkFields,res)
    } else {
        cm.getUserStatus(req.body.user_pub_id, function(err, result) {
            if (err) {
                cm.responseMessage(constant.Zero,err,res)
            } else {
                if (result.length > 0) {
                    cm.getMyticket(req.body.user_pub_id, function(err, result) {
                        if (err) {
                            cm.responseMessage(constant.One,constant.TIECKET_GENERATED,res)
                        }
                        result = JSON.parse(JSON.stringify(result));
                        if (result.length != 0) {
                            res.send({
                                "status": 1,
                                "message": constant.MY_TIECKET,
                                "data": result
                            });

                        } else {
                            res.send({
                                "status": 0,
                                "message": constant.NODATA,
                            });
                        }
                    });
                } else {
		            res.send({
                        "status": 0,
                        "message": constant.NODATA,
                    });
                }
            }
        });
    }
});

app.post("/addTicketComment", function(req, res) {
    if (!req.body.ticket_id || !req.body.user_pub_id || !req.body.comment) {
        cm.responseMessage(constant.Zero,constant.chkFields,res)
    } else {
        cm.getUserStatus(req.body.user_pub_id, function(err, result) {
            if (err) {
                cm.responseMessage(constant.Zero,err,res)
            } else {
                var parData = {
                    user_pub_id: req.body.user_pub_id,
                    ticket_id: req.body.ticket_id,
                    role: 1,
                    comment: req.body.comment,
                    // created_at:new Date(2);
                    created_at: (new Date()).valueOf().toString(),
                    date_time: moment(new Date()).format('DD MMM YYYY HH:MM')
                }
                con.query('INSERT INTO ticket_comments SET ?', parData, function(error, results) {
                    if (error) {
                        console.log("error ocurred", error)
                        cm.responseMessage(constant.Zero,error,res)
                    } else {
		                cm.responseMessage(constant.One,constant.ADD_COMMENT,res)
                    }
                });
            }
        });
    }
});

app.post("/getTicketComment", function(req, res) {
    if (!req.body.ticket_id || !req.body.user_pub_id) {
        cm.responseMessage(constant.Zero,constant.chkFields,res)
    } else {
        con.query('select t.*,u.name,u.email_id,u.image from ticket t join user u on u.user_pub_id=t.user_pub_id where t.id="'+req.body.ticket_id+'"', function (err, user_data) {
            if (err) {
                res.send({
                    "status": 0,
                    "message": constant.ERR,
                });
            } else {
                // console.log(user_data)
                con.query('select * from ticket_comments where ticket_id="'+req.body.ticket_id+'"', function (error, result) {
                    if (error) {
                        console.log("error ocurred", error)
                        res.send({
                            "status": 0,
                            "message": constant.ERR,
                        });
                    } else {
		                result = JSON.parse(JSON.stringify(result));
                        if (result == '' || result == undefined || result == null) {
                            var user = [];
                            var obj = {};
                            obj.id = 0;
                            obj.ticket_id = req.body.ticket_id;
                            obj.role = 1;
                            obj.user_pub_id = user_data[0].user_pub_id;
                            obj.comment = user_data[0].description;
                            obj.created_at = user_data[0].created_at;
                            obj.date_time = user_data[0].date_time;
                            user.push(obj)
                            result = user.concat(result)
                            res.send({
                                "status": 1,
                                "message": constant.ticket_comment,
                                "data": result,
                                "user_data":user_data
                            });
                        } else {
                            var user = [];
                            var obj = {};
                            obj.id = 0;
                            obj.ticket_id = req.body.ticket_id;
                            obj.role = 1;
                            obj.user_pub_id = user_data[0].user_pub_id;
                            obj.comment = user_data[0].description;
                            obj.created_at = user_data[0].created_at;
                            obj.date_time = user_data[0].date_time;
                            user.push(obj)
                            result = user.concat(result)
                            res.send({
                                "status": 1,
                                "message": constant.ticket_comment,
                                "data": result,
                                "user_data":user_data
                            });
                        }
                    }
                });
            }
        });
    }
});


module.exports=app;