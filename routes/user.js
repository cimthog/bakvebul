var express = require("express");
var bodyparser = require('body-parser');
var con = require('../config/database');
var uniqid = require('uniqid');
var app = express.Router();
var app = express();
var routes = express();
var routes = require('../routes');
var randomstring = require("randomstring");
var constant = require('../constant/constant');
var constantAR = require('../constant/constantAr');
var cm = require('../model/common')
var base_url_image = constant.base_url_image;
var bcrypt = require('bcryptjs');
var multer = require('multer');
var validator = require("email-validator");
var _ = require('lodash');
app.use(routes);
var base_url_image = constant.base_url_image;
var googleTranslate = require('google-translate')('AIzaSyAc1BDz3i2couP6VKHT4EyzycnZ1dnKoqs'); //('AIzaSyB0aTR_q7mn-eif8W-di1ZqIXYOHO5Wr78');
app.use(express.static('Image'))
var base_url = constant.base_url;
var storage = multer.diskStorage({ //multers disk storage settings
	destination: function (req, file, cb) {
		cb(null, '../../../../../var/www/html/Bakvebul/images')
	},
	filename: function (req, file, cb) {
		var datetimestamp = Date.now();
		cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
	}
});

var upload = multer({
	storage: storage
});
// app.use( function(req, res, next) { //allow cross origin requests
// 	res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
// 	res.header("Access-Control-Allow-Origin", "http://localhost");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	// console.log(" s------------->   "+req.headers.language)  
// 	if (req.headers.language == 'ar') {
// 		 constant = constantAR;

// 	} else  {
// 		 constant = constant;
// 	} 
// 	next();
// });
const lang_head = require('./check_lang');

app.use(async function (req, res, next) {
	res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
	res.header("Access-Control-Allow-Origin", "http://localhost");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	await lang_head.checkLang(req, function (result, err) {
		constant = result;
		return next();
	});
});


app.get("/verify-email/:session", (req, res) => {
	var session = req.params.session;
	console.log('verify-email',session);
	con.query('SELECT * FROM user WHERE user_pub_id=?', [session], function (err, results) {
		if (err) {
			return res.json({ success: false, 'message': err });
		} else {
			var result = JSON.parse(JSON.stringify(results))
			console.log(result);
			var user_id = result[0].user_pub_id;
			var email_value = 1;
			var status = 1;
			con.query('UPDATE user set email_verified =?,status=? WHERE user_pub_id = ? ', [email_value, status, user_id], function (err) {
				if(err)res.redirect(base_url+"html_pages/Email_Verification_Error.html")
				else {res.redirect(base_url+"html_pages/email_successfully_verify.html")};
			});
		}
	});
});


// var path = require("path"); 
// app.get('/',function(req,res){
//  res.sendFile(path.join(__dirname + '/html/test.html'));
//   //res.sendM("Your email has been verified successfully. Thank You!")
// })

app.post(constant.SignUp, function (req, res) {
	var user_pub_id = uniqid();
	if (!req.body.email_id || !req.body.name || !req.body.device_id || !req.body.device_type || !req.body.device_token) {
		cm.responseMessage(constant.Zero, constant.chkfield, res);
	} else {
		console.log("data");
		var referral_code = cm.randomString(6, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		console.log(req.body.email_id)

		cm.getUserByEmail(req.body.email_id, function (err, result) {
			if (err) {
				console.log(err)
			}
			if (result.length > 0) {
				console.log(req.body.signUpBy)
				if (req.body.signUpBy != 0) {
					cm.getallDataWhere(constant.USER, {
						email_id: req.body.email_id
					}, function (err, result) {
						if (err) {
							cm.responseMessage(constant.Zero, constant.ERR, res);
						} else {
							if (result.length == 0) {
								cm.responseMessage(constant.Zero, constant.USER_NOT_FOUND, res);
							} else {
								if (result.length > 0) {
									cm.responseMessage(constant.Zero, constant.AlredyRegister, res)
								} else {
									cm.responseMessage(constant.One, constant.USER_NOT_FOUND)
								}
							}
						}
					})
				}
				else {
					cm.responseMessage(constant.Zero, constant.EMAILAREADY);
				}
			}
			else {
				if (req.body.password) {
					bcrypt.hash(req.body.password, 5, function (err, bcryptedPassword) {
						if (bcryptedPassword.length > 0) {
							var password = bcryptedPassword
						}
						var user_pub_id = uniqid();
						con.query('SELECT * FROM package WHERE is_default="1" ', function (err, packageData) {
							if (err) {
								console.log(err);
							} else {
								var parData = {
									user_pub_id: user_pub_id.toUpperCase(),
									device_type: req.body.device_type,
									device_token: req.body.device_token,
									device_id: req.body.device_id,
									referral_code: referral_code,
									// signUpBy:req.body.signUpBy,
									email_id: req.body.email_id,
									name: req.body.name,
									password: password,
									email_verified: 0,
									status: 0,
									created_at: (new Date()).valueOf().toString(),
									updated_at: (new Date()).valueOf().toString()
								}
								if(packageData.length > 0){
									var packageData = JSON.parse(JSON.stringify(packageData));
									packageData = packageData[0];
									var myDate = new Date();
									myDate.setDate(myDate.getDate() + packageData.days);
									var subs_end_date = (myDate).valueOf().toString();
									parData.sub_end_date = subs_end_date;
								}
		
								cm.insert(constant.USER, parData, function (err, result) {
									if (err) {
										cm.responseMessage(constant.Zero, err, res)
									}
									else {
										con.query('select * from user where email_id="' + req.body.email_id + '"', function (err, re) {
		
											if (err) {
												console.log(err)
											} else {
												var re = JSON.parse(JSON.stringify(re));
												var user_pub_id = re[0].user_pub_id;
												// console.log(user_pub_id); 
												var point = "0"
												var created_at = (new Date()).valueOf().toString()
												var updated_at = (new Date()).valueOf().toString()
												con.query('insert into user_point set user_id="' + user_pub_id + '",point="' + point + '",created_at="' + created_at + '" and updated_at="' + updated_at + '"', function (err, result) {
													if (err) {
														cm.responseMessage(constant.Zero, err, res)
													} else {
														var msg = constant.HELLO + req.body.name + constant.REGISTRATION_TXT + ' <a href="' + constant.VERIFIED_EMAIL + user_pub_id + '">Click Here</a>' + constant.SIGNATURE;
														//  var msg="Registration";
														var result = cm.sendmail(req.body.email_id, constant.RGN, msg)
														cm.responseMessagedata(constant.One, constant.REG_SUCCESS, re[0], res)
													}
												})
												// var msg="Thank you for Registration"
											}
										})
										// cm.responseMessagedata(constant.One,constant.REG_SUCCESS,result,res)
									}
								});
								
							}
						});

					});
				} else {
					console.log("data2")
				}
			}
		});
	}


});

app.post(constant.SignUp1, function (req, res) {
	var user_pub_id = uniqid();
	if (!req.body.email_id || !req.body.name || !req.body.device_id || !req.body.device_type || !req.body.device_token || !req.body.online_type || !req.body.password) {
		cm.responseMessage(constant.Zero, constant.chkfield, res);
	} else {
		var referral_code = cm.randomString(6, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		bcrypt.hash(req.body.password, 5, function (err, bcryptedPassword) {
			if (bcryptedPassword.length > 0) {
				var password = bcryptedPassword
			}else{
				var password = '';
			}
			cm.getUserByEmail(req.body.email_id, function (err, result) {
				if(err){
					console.log(err)
				}
				if(result.length > 0){
					// if (req.body.online_type != "Normal") {
					// 	cm.getallDataWhere(constant.USER, {
					// 		email_id: req.body.email_id
					// 	}, function (err, result) {
					// 		if (err) {
					// 			cm.responseMessage(constant.Zero, constant.ERR, res);
					// 		} else {
					// 			if (result.length == 0) {
					// 				cm.responseMessage(constant.Zero, constant.USER_NOT_FOUND, res);
					// 			} else {
					// 				if (result[0].status == '0') {
					// 					cm.responseMessage(constant.Zero.constant.VerifyEmail, res);
					// 				} else {
					// 					if (result.length > 0) {
					// 						if(result[0].online_type != "Normal") {
												var sql = "UPDATE user SET password=?, email_verified WHERE email_id=?";
												con.query(sql, [password, 1, req.body.email_id], function (err) {})
												cm.LoginData(req.body.email_id, req.body.device_token, req.body.device_type).then(function (result) {
													cm.responseMessagedata(constant.One, constant.LOGINSUCCESSFULL, result, res)
												})
						// 					} else {
						// 						cm.responseMessage(constant.Zero, constant.AlredyRegisterWithNormal, res)
						// 					}
						// 				} else {
						// 					cm.responseMessage(constant.Zero, constant.USER_NOT_FOUND, res)
						// 				}
						// 			}
						// 		}
						// 	}
						// })
					// }
					// else {
					// 	cm.responseMessage(constant.Zero, constant.EMAILAREADY);
					// }
				}
				else {
					con.query('SELECT * FROM package WHERE is_default="1" ', function (err, packageData) {
						if (err) {
							console.log(err);
						} else {
							var user_pub_id = uniqid();
							var parData = {
								user_pub_id: user_pub_id.toUpperCase(),
								device_type: req.body.device_type,
								device_token: req.body.device_token,
								device_id: req.body.device_id,
								referral_code: referral_code,
								online_type: req.body.online_type,
								email_id: req.body.email_id,
								name: req.body.name,
								status: 1,
								email_verified:1,
								password:password,
								created_at: (new Date()).valueOf().toString(),
								updated_at: (new Date()).valueOf().toString()
							}
							if(packageData.length > 0){
								var packageData = JSON.parse(JSON.stringify(packageData));
								packageData = packageData[0];
								var myDate = new Date();
								myDate.setDate(myDate.getDate() + packageData.days);
								var subs_end_date = (myDate).valueOf().toString();
								parData.sub_end_date = subs_end_date;
							}
							cm.insert(constant.USER, parData, function (err, result) {
								if(err){
									cm.responseMessage(constant.Zero, err, res)
								}else {
									con.query('select *from user where email_id="' + req.body.email_id + '"', function (err, re) {
										if (err) {
											console.log(err)
										} else {
											var re = JSON.parse(JSON.stringify(re));
											var user_pub_id = re[0].user_pub_id;
											// console.log(user_pub_id);
											var point = "0"
											var created_at = (new Date()).valueOf().toString()
											var updated_at = (new Date()).valueOf().toString()
											con.query('insert into user_point set user_id="' + user_pub_id + '",point="' + point + '",created_at="' + created_at + '" and updated_at="' + updated_at + '"', function (err, result) {
												if (err) {
													cm.responseMessage(constant.Zero, err, res)
												} else {
													cm.LoginData(req.body.email_id, req.body.device_token, req.body.device_type).then(function (result) {
														cm.responseMessagedata(constant.One, constant.LOGINSUCCESSFULL, result, res)
													})
												}
											})
										}
									})
								}
							});
						}
					})
				}
			});
		})
	}
});

// function checkUserCode(use_code,user_pub_id,res){
// 	var referral_code=use_code;
// 	var user_pub_id=user_pub_id;
// 	cm.getReferralCode(function(err,result){
// 		if(result.length != 0){
// 			if(result[0].type == 1){
// 				var no_of_usages=result[0].no_of_usages;
// 				var amount=result[0].amount;
// 				var parData={
// 					user_pub_id:user_pub_id,
// 					referral_code:referral_code
// 				}
// 				con.query('insert into ')
// 			}
// 		}
// 	})
// }

app.post('/signIn', function (req, res) {
	if (!validator.validate(req.body.email_id) || !req.body.email_id) {
		cm.responseMessage(constant.Zero, constant.CHECK_YOUR_EMAIL, res);
	} else {
		if (!req.body.password) {
			cm.responseMessage(constant.Zero, constant.PASS_NT_MATCH, res)
		} else {
			if (!req.body.device_token || !req.body.device_type) {
				cm.responseMessage(constant.Zero, constant.chkfield, res)
			} else {
				con.query('select *,concat("' + base_url + '",image) as image from user where email_id="' + req.body.email_id + '" AND status != "2"', function (err, result) {
					if (err) {
						cm.responseMessage(constant.Zero, constant.ERR, res)
					} else {
						if (result.length == 0) {
							cm.responseMessage(constant.Zero, constant.CHECK_YOUR_EMAIL, res)
						} else {
							bcrypt.compare(req.body.password, result[0].password, function (err, doesMatch) {
								if (!doesMatch) {
									cm.responseMessage(constant.Zero, constant.incorrectPwd, res)
								} else {
									if (result[0].status == '0') {
										cm.responseMessage(constant.Zero, constant.VerifyEmail, res)
									} else {
										// if(role!=1)
										cm.update(constant.USER,
											{ email_id: req.body.email_id },
											{
												device_type: req.body.device_type,
												device_token: req.body.device_token
											}, function (err, result_update) {

												if (err) {
													constant.log(err);
												}
												else {
													if (result.length > 0) {
														cm.getUserStatus(result[0].user_pub_id, function (err, user_status) {
															if (err) {
																cm.responseMessage(constant.Zero, err, res)
															} else {
																if (user_status.length > 0) {
																	var currency_id =  result[0].currency_id;
																	con.query('select * from currency_setting where id="' + currency_id + '"', function (err, resultCurrency) {
																		if(resultCurrency == null || resultCurrency == '' || resultCurrency == undefined || resultCurrency == []){
																			result[0].currency_name = '';
																			result[0].currency_symbol = '';
																		}else{
																			result[0].currency_name = resultCurrency[0].currency_name;
																			result[0].currency_symbol = resultCurrency[0].currency_symbol;
																		}
																		var cat_id = result[0].cat_id;
																		if(cat_id){
																			con.query('select u.*,c.cat_name from multiple_category u join categories c on c.id=u.cat_id where u.user_pub_id="' + result[0].user_pub_id + '"', function (err, resultCat) {
																			// con.query('select * from categories where id="' + cat_id + '"', function (err, resultCat) {
																				if (err) {
																					console.log(err);
																				} else {
																					var resultCat = JSON.parse(JSON.stringify(resultCat));
																					var cat_name = resultCat;
																					// console.log('cat_name',cat_name)
																					result[0].cat_name = cat_name;
																					var user_id = result[0].user_pub_id;
																					con.query('select count(rating) as rating from rating where artist_pub_id="' + user_id + '"', function (err, resultRating) {
																						if (err) {
																							console.log(err);
																						} else {
																							var resultRating = JSON.parse(JSON.stringify(resultRating))
																							if (resultRating.length > 0) {
																								result[0].rating = resultRating[0].rating;
																								con.query('select * from user_point where user_id="' + user_id + '"', function (err, resultPoint) {
																									if (err) {
																										console.log(err);
																									} else {
																										var resultPoint = JSON.parse(JSON.stringify(resultPoint));
																										result[0].point = resultPoint[0].point;
																										cm.responseMessagedata(constant.One, constant.LOGINSUCCESSFULL, result[0], res)
																									}
																								})
																							} else {
																								// console.log('ssffsddfs');
																								result[0].rating = 0.0;
																								con.query('select * from user_point where user_id="' + user_id + '"', function (err, resultPoint) {
																									if (err) {
																										console.log(err);
																									} else {
																										var resultPoint = JSON.parse(JSON.stringify(resultPoint));
																										result[0].point = resultPoint[0].point;
																										cm.responseMessagedata(constant.One, constant.LOGINSUCCESSFULL, result[0], res)
																									}
																								})
																							}
																						}
																					})
																				}
																			})
																		} else {
																			result[0].cat_name = [];
																			var user_id = result[0].user_pub_id
																			con.query('select count(rating) as rating from rating where artist_pub_id="' + user_id + '"', function (err, resultRating) {
																				if (err) {
																					console.log(err);
																				} else {
																					var resultRating = JSON.parse(JSON.stringify(resultRating))
																					if (resultRating.length > 0) {
																						result[0].rating = resultRating[0].rating;
																						con.query('select * from user_point where user_id="' + user_id + '"', function (err, resultPoint) {
																							if (err) {
																								console.log(err);
																							} else {
																								var resultPoint = JSON.parse(JSON.stringify(resultPoint));
																								result[0].point = resultPoint[0].point;
																								cm.responseMessagedata(constant.One, constant.LOGINSUCCESSFULL, result[0], res)
																							}
																						})
																					} else {
																						// console.log('ssffsddfs');
																						result[0].rating = 0.0;
																						con.query('select * from user_point where user_id="' + user_id + '"', function (err, resultPoint) {
																							if (err) {
																								console.log(err);
																							} else {
																								var resultPoint = JSON.parse(JSON.stringify(resultPoint));
																								result[0].point = resultPoint[0].point;
																								
																								cm.responseMessagedata(constant.One, constant.LOGINSUCCESSFULL, result[0], res)
																							}
																						})
																					}

																				}
																			})
																		}
																	})
																} else {
																	cm.responseMessage(constant.TWo, constant.ACCOUNT_STATUS, res)
																}
															}
														});
													}
													else {
														cm.responseMessage(constant.Zero, constant.USER_NOT_FOUND, res);

													}
												}
											});

									}
								}
							});
						}
					}
				});
			}
		}
	}
});

app.post(constant.changePassword, function (req, res) {
	if (!req.body.user_pub_id || !req.body.old_password || !req.body.new_password) {
		cm.responseMessage(constant.Zero, constant.chkfield, res)
	} else {
		var user_pub_id = req.body.user_pub_id;
		var old_password = req.body.old_password;
		var new_password = req.body.new_password;
		con.query('select * from user where user_pub_id=?', [user_pub_id], function (err, result) {
			if (result.length > 0) {
				bcrypt.compare(old_password, result[0].password, function (err, doesMatch) {
					if (doesMatch) {
						bcrypt.hash(req.body.new_password, 5, function (err, bcryptedPassword) {
							if(bcryptedPassword.length > 0) {
								var password = bcryptedPassword;
							}
							con.query('update user set password=? where user_pub_id=?', [password, req.body.user_pub_id], function (err, result) {
								if (err) {
									cm.responseMessage(constant.Zero, err, res)
								} else {
									if (result.length != 0) {
										cm.responseMessage(constant.One, constant.FORGETPASS, res)
									} else {
										cm.responseMessage(constant.Zero, constant.NOT_RESPONDING, res)
									}
								}
							});
						});
					} else {
						cm.responseMessage(constant.Zero, constant.NOT_MATCHED, res)
					}
				});
			} else {
				cm.responseMessage(constant.Zero, constant.CHECK_YOUR_EMAIL, res)
			}
		})
	}
})

app.post(constant.fogetPassword, function (req, res) {
	if (!req.body.email_id) {
		cm.responseMessage(constant.One, constant.chkfield, res)
	} else {
		cm.getallDataWhere(constant.USER, { email_id: req.body.email_id }, function (err, result) {
			if (err) {

				cm.responseMessage(constant.Zero, err, res)
			} else {
				if (result.length > 0) {
					// const newPass=randomstring.generate(7);
					const newPass = randomstring.generate({ length: 8, charset: 'alphanumeric', capitalization: 'uppercase' });
					bcrypt.hash(newPass, 5, function (err, bcryptedPassword) {
						if (bcryptedPassword.length > 0) {
							var password = bcryptedPassword;
						}
						var rand_password = password;
						cm.update('user', {
							email_id: req.body.email_id
						},
							{
								password: rand_password,
								updated_at: (new Date()).valueOf().toString()
							}, function (err, result) {
								if (err) {
									console.log(err);
								} else {
									/*mail code*/
									var msg = constant.HELLO + constant.MSGUPDATEDPASSWORD + ' ' + newPass + constant.SIGNATURE;
									cm.sendmail(req.body.email_id, constant.FRGPWD, msg);
									cm.responseMessage(constant.One, constant.PWD_CNG, res)
								}
							});
					});
				} else {

					cm.responseMessage(constant.Zero, constant.EMAILIDNOTFOUND, res)
				}
			}
		});
	}
});

app.post(constant.updateProfile,upload.single('image'), function (req, res) { 
	if (!req.body.user_pub_id) {
		cm.responseMessage(constant.Zero, constant.chkfield, res)
	} else {
		cm.getUserStatus(req.body.user_pub_id, function (err, result) {
			if (err) {
				cm.responseMessage(constant.Zero, err, res)
			} else {
				if (result.length > 0) {
					let user_pub_id = req.body.user_pub_id;
					// let que='select *from user where user_pub_id="'+user_pub_id+'"';
					con.query('select * from user where user_pub_id="' + user_pub_id + '"',async function (err, userData) {
						if (err) {
							cm.responseMessage(constant.Zero, err, res)
						} else {
							if (userData.length == 0) {
								cm.responseMessage(constant.Zero, constant.USER_NOT_FOUND, res)
							} else {
								userData = JSON.parse(JSON.stringify(userData));
								// console.log('userData',userData);
								if(req.body.name == '' || req.body.name == null || req.body.name == undefined)req.body.name = userData[0].name;
								var name = req.body.name;
								name = name.charAt(0).toUpperCase() + name.slice(1)
								// if(req.body.country_code == null || req.body.country_code == undefined)req.body.country_code = 0;
								if(req.body.is_artist == '' || req.body.is_artist == null || req.body.is_artist == undefined)req.body.is_artist = userData[0].is_artist;
								if(req.body.price == '' || req.body.price == null || req.body.price == undefined)req.body.price = userData[0].price;
								if(req.body.name == '' || req.body.name == null || req.body.name == undefined)req.body.name = userData[0].name;
								if(req.body.adhar_no == '' || req.body.adhar_no == null || req.body.adhar_no == undefined)req.body.adhar_no = userData[0].adhar_no;
								if(req.body.pancard_no == '' || req.body.pancard_no == null || req.body.pancard_no == undefined)req.body.pancard_no = userData[0].pancard_no;
								if(req.body.city == '' || req.body.city == null || req.body.city == undefined)req.body.city = userData[0].city;
								if(req.body.description == '' || req.body.description == null || req.body.description == undefined)req.body.description = userData[0].description;
								if(req.body.bio == '' || req.body.bio == null || req.body.bio == undefined)req.body.bio = userData[0].bio;
								if(req.body.gender == '' || req.body.gender == null || req.body.gender == undefined)req.body.gender = userData[0].gender;
								if(req.body.address == '' || req.body.address == null || req.body.address == undefined)req.body.address = userData[0].address;
								if(req.body.country_code == '' || req.body.country_code == null || req.body.country_code == undefined)req.body.country_code = userData[0].country_code;
								if(req.body.latitude == '' || req.body.latitude == null || req.body.latitude == undefined)req.body.latitude = userData[0].latitude;
								if(req.body.longitude == '' || req.body.longitude == null || req.body.longitude == undefined)req.body.longitude = userData[0].longitude;
								if(req.body.currency_id == '' || req.body.currency_id == null || req.body.currency_id == undefined)req.body.currency_id = userData[0].currency_id;
								if (!req.file) {
									//req.body.cat_id,
									if(req.body.cat_id == null || req.body.cat_id == undefined || req.body.cat_id == '' || req.body.cat_id == []){
									}else{
										req.body.cat_id = JSON.parse(req.body.cat_id);
										cm.deleteCategoryInUser(req.body.user_pub_id)
										var arr = [];
										var val;
										for(let i=0; i<req.body.cat_id.length; i++){
											arr[i] = [req.body.user_pub_id,req.body.cat_id[i]]
										}
										await cm.updateCategoryInUser(req.body.user_pub_id,arr)
									}
									con.query('UPDATE user SET name=?,is_artist=?,adhar_no=?,pancard_no=?,city=?,latitude=?,longitude=?,description=?,price=?,bio=?,gender=?,address=?,country_code=?,currency_id=? where user_pub_id=?', [req.body.name, req.body.is_artist, req.body.adhar_no, req.body.pancard_no, req.body.city, req.body.latitude, req.body.longitude, req.body.description, req.body.price, req.body.bio, req.body.gender, req.body.address, req.body.country_code, req.body.currency_id, req.body.user_pub_id], function (err, result) {
										if (err) {
											cm.responseMessage(constant.Zero, err, res)
										} else {
											if (result.length != 0) {
												con.query('select u.*,COALESCE(r.rating,0.0) as rating,concat("' + base_url + '",u.image) as image,r.rating from user u left join rating r on r.user_pub_id=u.user_pub_id where u.user_pub_id="' + user_pub_id + '"', function (err, userData) {
													var userData = JSON.parse(JSON.stringify(userData));
													if (userData.length > 0) {
														con.query('select u.*,c.cat_name from multiple_category u join categories c on c.id=u.cat_id where u.user_pub_id="' + user_pub_id + '"', function (err_catdata, catdata) {
															if(err_catdata){
																cm.responseMessage(constant.Zero, constant.NOT_RESPONDING, res)
															}else{
																con.query('select * from currency_setting where id="' + userData[0].currency_id + '"', function (err, resultCurrency) {
																	if(resultCurrency == null || resultCurrency == '' || resultCurrency == undefined || resultCurrency == []){
																		userData[0].currency_name = '';
																		userData[0].currency_symbol = '';
																	}else{
																		userData[0].currency_name = resultCurrency[0].currency_name;
																		userData[0].currency_symbol = resultCurrency[0].currency_symbol;
																	}
																	catdata = JSON.parse(JSON.stringify(catdata));
																	userData[0].cat_name = catdata
																	cm.responseMessagedata(constant.One, constant.PROFILE_UPDATED, userData[0], res)
																})
															}
														})
													}
													else {
														cm.responseMessage(constant.Zero, constant.NOT_RESPONDING, res)
													}
												})
											}
										}
									});
								} else {
									if(req.body.cat_id == null || req.body.cat_id == undefined || req.body.cat_id == '' || req.body.cat_id == []){
									}else{
										cm.deleteCategoryInUser(req.body.user_pub_id)
										req.body.cat_id = JSON.parse(req.body.cat_id);
										var arr = []
										var val;
										for(let i=0; i<req.body.cat_id.length; i++){
											arr[i] = [req.body.user_pub_id,req.body.cat_id[i]]
										}
										await cm.updateCategoryInUser(req.body.user_pub_id,arr)
									}
									req.body.image = "Bakvebul/images/" + req.file.filename
									// cat_id
									// if(req.body.is_artist == '' || req.body.is_artist == null || req.body.is_artist == undefined)req.body.is_artist = 0;
									// if(req.body.price == '' || req.body.price == null || req.body.price == undefined)req.body.price = 0;
									con.query('UPDATE user SET name=?,is_artist=?,adhar_no=?,pancard_no=?,city=?,latitude=?,longitude=?,description=?,price=?,bio=?,gender=?,image=?,address=?,country_code=?,currency_id=? where user_pub_id=?', [req.body.name,req.body.is_artist, req.body.adhar_no, req.body.pancard_no, req.body.city, req.body.latitude, req.body.longitude, req.body.description, req.body.price, req.body.bio, req.body.gender, req.body.image, req.body.address, req.body.country_code,req.body.currency_id, req.body.user_pub_id], function (err, result) {
										if (err) {
											console.log('file',err)
											cm.responseMessage(constant.Zero, err, res)
										} else {
											if (result.length != 0) {
												con.query('select u.*,COALESCE(r.rating,0.0) as rating,concat("' + base_url + '",u.image) as image,r.rating from user u left join rating r on r.user_pub_id=u.user_pub_id where u.user_pub_id="' + user_pub_id + '"', function (err, userData) {
													var userData = JSON.parse(JSON.stringify(userData));
													if (userData.length > 0) {
														con.query('select u.*,c.cat_name from multiple_category u join categories c on c.id=u.cat_id where u.user_pub_id="' + user_pub_id + '"', function (err_catdata, catdata) {
															if(err_catdata){
																cm.responseMessage(constant.Zero, constant.NOT_RESPONDING, res)
															}else{
																con.query('select * from currency_setting where id="' + userData[0].currency_id + '"', function (err, resultCurrency) {
																	if(resultCurrency == null || resultCurrency == '' || resultCurrency == undefined || resultCurrency == []){
																		userData[0].currency_name = '';
																		userData[0].currency_symbol = '';
																	}else{
																		userData[0].currency_name = resultCurrency[0].currency_name;
																		userData[0].currency_symbol = resultCurrency[0].currency_symbol;
																	}
																	catdata = JSON.parse(JSON.stringify(catdata));
																	userData[0].cat_name = catdata
																	cm.responseMessagedata(constant.One, constant.PROFILE_UPDATED, userData[0], res)
																})
															}
														})
													}
													else {
														cm.responseMessage(constant.Zero, constant.NOT_RESPONDING, res)
													}
												})
											}
										}
									});
								}
							}
						}
					});
				} else {

					cm.responseMessage(constant.TWo, constant.ACCOUNT_STATUS, res)
				}
			}
		});
	}
});

app.post('/logout', function (req, res) {
	var user_pub_id = req.body.user_pub_id;
	con.query('update user set device_token="123456" where user_pub_id="' + user_pub_id + '"', function (err, result) {
		if (err) {
			cm.responseMessage(constant.Zero, err, res);
		} else {
			cm.responseMessage(constant.One, constant.logout, res);
		}
	})
})

app.post(constant.checkSocialLogin, function (req, res) {
	if (!req.body.email_id || !req.body.device_type || !req.body.device_token) {
		cm.responseMessage(constant.Zero, constant.chkfield, res)
	} else {
		cm.getUserByEmail(req.body.email_id, function (err, result) {
			if(err){
				console.log(err);
			} if (result.length > 0) {
				if (req.body.signUpBy != 1) {
					cm.getallDataWhere(constant.USER, { email_id: req.body.email_id }, function (err, result) {
						if (err) {
							cm.responseMessage(constant.Zero, constant.ERR, res);
						} else {
							if (result.length == 0) {
								cm.responseMessage(constant.Zero, constant.USER_NOT_FOUND, res)
							} else {
								if (result[0].status == '0') {
									cm.responseMessage(constant.Zero, constant.DEACTIVATEUSER, res)
								} else {
									if (result.length > 0) {
										cm.update(constant.USER, {
											email_id: req.body.email_id
										}, { device_type: req.body.device_type, device_token: req.body.device_token }, function (err, result_update) {
											if (err) {
												cm.responseMessage(constant.Zero, constant.ERR, res)
											} else {
												console.log(constant.One)
												cm.responseMessagedata(constant.One, constant.LOGINSUCCESSFULL, result[0], res)
											}
										});
									} else {
										cm.responseMessage(constant.Zero, constant.USER_NOT_FOUND, res)
									}
								}
							}
						}
					});
				} else {
					cm.responseMessage(constant.Zero, constant.NOT_RESPONDING, err)
				}
			} else {
				cm.responseMessage(constant.Zero, constant.EMAILAREADY, res)
			}
		});
	}
});

//GetProfile

app.post('/getProfileDetail', function (req, res) {
	if (!req.body.email) {
		cm.responseMessage(constant.Zero, constant.chkfield, res)
	} else {
		con.query('select *from user where email_id="' + req.body.email + '"', function (err, result) {
			if (err) {
				console.log(err)
			} else {
				if (result.length > 0) {
					res.send({
						"status": 1,
						"message": constant.getUserData,
						"data": result[0]
					})
				} else {
					cm.responseMessage(constant.Zero, constant.NODATA, res)
				}
			}
		})
	}
})


app.post('/deleteAccount', function (req, res) {
	if (!req.body.user_pub_id) {
		cm.responseMessage(constant.Zero, constant.chkfield, res)
	} else {
		// con.query('DELETE FROM user WHERE user_pub_id="' + req.body.user_pub_id + '"', function (err, resultUser) {
		con.query('update user set status="2" where user_pub_id="' + req.body.user_pub_id + '"', function (err, resultUser) {
			if (err) {
				cm.responseMessage(constant.Zero, err, res)
			} else {
				cm.responseMessage(constant.TWo, constant.DeleteAcc, res)
			}
		})
	}
})


// app.post('/updateEmail',function(req,res){
// 	if(!req.body.email_id&&!req.body.user_pub_id){

// 	}else{
// 		con.query('select * from user where email_id="'+req.body.email_id+'"',function(err,result){
// 			if(err){
// 				cm.responseMessage(constant.Zero,constant.DeleteAcc,res)
// 			}else{
// 				if(result.length>0){
// 		cm.responseMessage(constant.Zero,constant.alreadyRegistered,res)
// 				}else{
// 					con.query("update user set email_id='"+req.body.email_id+"' where user_pub_id='"+req.body.user_pub_id+"'",function(err,result){
// 						if(err){
// 							cm.responseMessage(constant.Zero,err,res)
// 						}else{
// 							con.query('select * from user where user_pub_id="'+req.body.user_pub_id+'"',function(err,result){
// 								if(err){
// 									cm.responseMessage(constant.Zero,err,res)
// 								}else{
// 							res.send({
// 								"status":1,
// 								"message":constant.updateEmail,
// 								"data":result[0]
// 							})		
// 								}
// 							})
// 						}
// 					})
// 				}
// 			}
// 		})
// 	}
// })
app.get('/update_email/:email_id/:user_id', function (req, res) {
	var email_id = req.params.email_id;
	var user_id = req.params.user_id;
	con.query('update user set email_id="' + email_id + '" where user_pub_id="' + user_id + '"', function (err, result) {
		if (err) {
			cm.responseMessage(constant.Zero, constant.DeleteAcc, res)
		} else {
			res.redirect(base_url + "success1.html");

		}
	})
})
app.post('/updateEmail', function (req, res) {
	if (!req.body.email_id || !req.body.user_pub_id) {
	} else {
		con.query('select * from user where email_id="' + req.body.email_id + '"', function (err, result) {
			if (err) {
				cm.responseMessage(constant.Zero, constant.DeleteAcc, res)
			} else {
				if (result.length > 0) {
					cm.responseMessage(constant.Zero, constant.alreadyRegistered, res)
				} else {
					con.query('select * from user where user_pub_id="' + req.body.user_pub_id + '"', function (err, result) {
						if (err) {
							res.send({
								"status": 0,
								"message": err
							})
						} else {
							var result = JSON.parse(JSON.stringify(result));
							var email = result[0].email_id;
							var name = result[0].name;
							var msg = constant.HELLO + constant.changedEmail + constant.SIGNATURE;
							cm.sendmail(email, constant.email_update, msg)
							var email1 = req.body.email_id;
							// var name=result[0].name;
							var msg1 = constant.HELLO + name + constant.update_email_msg + ' <a href="' + constant.UPDATE_EMAIL + req.body.email_id + "/" + req.body.user_pub_id + '">Click Here</a>' + constant.SIGNATURE;
							cm.sendmail(email1, constant.email_update, msg1)
							res.send({
								"status": 1,
								"message": constant.verifyUpdateEmail
							})
						}
					})
				}
			}
		})

	}
})
app.post('/updatePhone', function (req, res) {
	if (!req.body.mobile_no && !req.body.user_pub_id) {
		
	} else {
		console.log('req.body.mobile_no',req.body.mobile_no);
		console.log('req.body.user_pub_id',req.body.user_pub_id);
		console.log('req.body.country_code',req.body.country_code);
		con.query("update user set country_code='" + req.body.country_code + "',mobile_no='" + req.body.mobile_no + "' where user_pub_id='" + req.body.user_pub_id + "'", function (err, result) {
			if (err) {
				cm.responseMessage(constant.Zero, err, res)
			} else {
				cm.responseMessage(constant.One, constant.updateMobile, res)
			}
		})
	}
})

app.post('/updatePrivateStatus', function (req, res) {
	if (!req.body.user_pub_id || !req.body.privateStatus) {
		cm.responseMessage(constant.Zero, constant.chkfield, res);
	} else {
		con.query("update user set is_private='" + req.body.privateStatus + "' where user_pub_id='" + req.body.user_pub_id + "'", function (err, result) {
			if (err) {
				cm.responseMessage(constant.Zero, err, res)

			} else {

				cm.responseMessage(constant.One, constant.updatePrivate, res)

			}
		})
	}
})

app.post('/myCurrentData', function (req, res) {
	if (!req.body.user_pub_id) {
		cm.responseMessage(constant.Zero, constant.chkfield, res);
	} else {
		con.query('select u.*,p.point,u.price as price, concat("' + base_url + '",u.image) as image from user u join user_point p on p.user_id=u.user_pub_id  where user_pub_id="' + req.body.user_pub_id + '" ', function (err, resultUser) {
			if (err) {
				cm.responseMessage(constant.Zero, err, res);
			} else {
				var resultUser = JSON.parse(JSON.stringify(resultUser));
				if (resultUser.length > 0) {
					con.query('select u.*,c.cat_name from multiple_category u join categories c on c.id=u.cat_id where u.user_pub_id="' + req.body.user_pub_id + '"', function (err_catdata, catdata) {
						if(err_catdata){
							cm.responseMessage(constant.Zero, err_catdata, res);
						}else{
							con.query('select * from currency_setting where id="' + resultUser[0].currency_id + '"', function (err, resultCurrency) {
								if(resultCurrency == null || resultCurrency == '' || resultCurrency == undefined || resultCurrency == []){
									resultUser[0].currency_name = '';
									resultUser[0].currency_symbol = '';
								}else{
									resultUser[0].currency_name = resultCurrency[0].currency_name;
									resultUser[0].currency_symbol = resultCurrency[0].currency_symbol;
								}
								catdata = JSON.parse(JSON.stringify(catdata));
								resultUser[0].cat_name = catdata
								con.query('select COALESCE(ROUND(AVG(rating),2),0) as Allrating from rating join user on rating.user_pub_id=user.user_pub_id join user as user1 on user1.user_pub_id=rating.artist_pub_id where rating.artist_pub_id="' + req.body.user_pub_id + '" and user1.is_private="0"', function (err, resultAllRating) {
									if (err) {
									console.log('3',err)
										//   cm.responseMessage(constant.Zero, err, res);
										res.send({"status": 1,"message": constant.getAllData,"data": resultUser[0]})
									} else {
										var Rating = JSON.parse(JSON.stringify(resultAllRating));
										if(resultAllRating != null)resultUser[0].avg_rating = resultAllRating[0].Allrating;
										con.query('select count(j.job_id) as jobDone  from apply_job j join user u on j.artist_pub_id = u.user_pub_id where j.artist_pub_id="' + req.body.user_pub_id + '" and u.is_private="0" and j.status="2"', function (err, resultJob) {
											if (err) {
											console.log('8',err)
											//   cm.responseMessage(constant.Zero, err, res);
											res.send({"status": 1,"message": constant.getAllData,"data": resultUser[0]})
											} else {
											var resultJob = JSON.parse(JSON.stringify(resultJob))
											if(resultJob != null)resultUser[0].job_done = resultJob[0].jobDone;
												con.query('select COALESCE(sum(p.price),0.0) as totalEarned from post_job p join apply_job a on a.job_id=p.job_id join user u on u.user_pub_id=a.artist_pub_id where a.artist_pub_id="' + req.body.user_pub_id + '" and u.is_private="0"  ', function (err, resultEarned) {
													if (err) {
														console.log('9',err)
														// cm.responseMessage(constant.Zero, err, res);
														res.send({"status": 1,"message": constant.getAllData,"data": resultUser[0]})
													} else {
														var resultEarned = JSON.parse(JSON.stringify(resultEarned));
														if(resultEarned != null)resultUser[0].earning = resultEarned[0].totalEarned
														res.send({"status": 1,"message": constant.getAllData,"data": resultUser[0]})
													}
												})
											}
										});
									}
								})
							})
						}
					})
				}else{
					cm.responseMessage(constant.Zero, constant.NOT_RESPONDING, res)
				}
			}
		})
	}
})

app.post('/searchArtistByCategory', function (req, res) {
	if (!req.body.user_pub_id || !req.body.keyword) {
		cm.responseMessage(constant.Zero, constant.chkfield, res);
	} else {
		if (req.headers.language == 'ar' || req.headers.language == 'AR') {
			googleTranslate.translate([req.body.keyword], 'en', function (err, translation) {
				if (translation.translatedText == undefined) {
					res.send({ "status": 0, "message": "Translation not working" });
				} else {
					if (translation.detectedSourceLanguage == 'ar') {
						req.body.keyword = translation.translatedText;
					}
				}
			});
		}
		var sql = 'select u.*,c.*, concat("' + base_url + '",u.image) as image, u.status, u.price as price ' +
			' from user u join categories c on c.id=u.cat_id ' +
			' where u.user_pub_id!="' + req.body.user_pub_id + '" ' +
			' AND (u.sub_end_date != "" AND u.sub_end_date > ROUND(UNIX_TIMESTAMP()*1000)) ';
		var searchArr = [];
		searchArr = _.split(req.body.keyword, " ");
		for (i = 0; i < searchArr.length; i++) {
			searchArr[i] = (searchArr[i]).toLowerCase();
			if (i == 0) {
				sql += " AND ( LOWER(c.cat_name) like '%" + searchArr[i] + "%' ESCAPE '!' OR LOWER(u.name) like '%" + searchArr[i] + "%' ESCAPE '!' ";
			} else {
				sql += " OR  LOWER(c.cat_name) like '%" + searchArr[i] + "%' ESCAPE '!' OR LOWER(u.name) like '%" + searchArr[i] + "%' ESCAPE '!' ";
			}
			if (i == searchArr.length - 1) {
				sql += ")";
			}
		}
		con.query(sql, function (err, resultUser) {
			if (err) {
				cm.responseMessage(constant.Zero, err, res);
			} else {
				if (resultUser.length > 0) {
					var resultUser = JSON.parse(JSON.stringify(resultUser));
					res.send({
						"status": 1,
						"message": constant.getAllData,
						"data": resultUser
					})
				} else {
					res.send({
						"status": 0,
						"message": constant.ARTIST_NOT_FOUND
					})
				}
			}
		})
	}
})

app.post('/add_update_bank_details', function(req, res)
{ 
	var data = {};
	if (!req.body.user_pub_id) {
		cm.responseMessage(constant.Zero, constant.chkfield, res);
	} else {
		con.query("select * from bank_details where user_pub_id='"+req.body.user_pub_id+"'", function (err, result) {
			if(err){
				cm.responseMessage(constant.Zero, err, res);
			}else{
				if(result == null || result == '' || result == undefined || result == []){
					var Obj = {};
					Obj.user_pub_id = req.body.user_pub_id;
					if(req.body.name)Obj.name = req.body.name;
					if(req.body.t_c_id_no)Obj.t_c_id_no = req.body.t_c_id_no;
					if(req.body.handy_phone)Obj.handy_phone = req.body.handy_phone;
					if(req.body.iban)Obj.iban = req.body.iban;
					if(req.body.address)Obj.address = req.body.address;
					Obj.created_at = (new Date()).valueOf().toString()
					con.query('insert into bank_details set ?', [Obj], function (err) {
						if (err) {
							console.log('1054',err);
							res.send({"status": 0,"message": err})
						} else {
							res.send({"status": 1,"message": constant.success})
						}
					})
				}else{
					result = JSON.parse(JSON.stringify(result));
					result = result[0]
					if(req.body.name == null || req.body.name == undefined || req.body.name == '')req.body.name = result.name;
					if(req.body.t_c_id_no == null || req.body.t_c_id_no == undefined || req.body.t_c_id_no == '')req.body.t_c_id_no = result.t_c_id_no;
					if(req.body.handy_phone == null || req.body.handy_phone == undefined || req.body.handy_phone == '')req.body.handy_phone = result.handy_phone;
					if(req.body.iban == null || req.body.iban == undefined || req.body.iban == '')req.body.iban = result.iban;
					if(req.body.address == null || req.body.address == undefined || req.body.address == '')req.body.address = result.address;
					req.body.updated_at = (new Date()).valueOf().toString()
					var sql = "UPDATE bank_details SET name=?,t_c_id_no=?,handy_phone=?,iban=?,address=?,updated_at=? WHERE user_pub_id=?";
					con.query(sql, [req.body.name, req.body.t_c_id_no,req.body.handy_phone,req.body.iban,req.body.address,req.body.updated_at, req.body.user_pub_id], function (err, result) {
						if (err) {
							console.log('1072',err);
							res.send({"status": 0,"message": err})
						}
						else {
							res.send({"status": 1,"message": constant.success})
						}
					});
				}
			}
		})
	}
});

app.post('/get_bank_details', function(req, res)
{ 
    var data = {};
	if(!req.body.user_pub_id){
		cm.responseMessage(constant.Zero, constant.chkfield, res);
	}else{
		con.query("select * from bank_details where user_pub_id='"+req.body.user_pub_id+"'", function (err, result) {
			if(err){
				cm.responseMessage(constant.Zero, err, res);
			}else{
				if(result == null || result == '' || result == undefined || result == []){
					res.send({"status": 0,"message": constant.null_data})
				}else{
					result = result[0]
					res.send({"status": 1,"message": constant.success,"data":result})
				}
			}
		})
	}
});

module.exports = app;