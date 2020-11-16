const express = require('express');
const app = express.Router();
const bodyparser = require('body-parser');
const cm = require('../model/common');
var multer = require('multer')
var routes = require('../routes');
var con = require('../config/database');
var Promise = require('promise');
var fn = require('../firebase/firebase');
var voucher_codes = require('voucher-code-generator');
// var base_url=constant.base_url;
app.use(bodyparser.json());
app.use(routes);

var constant = require('../constant/constant');
var constantAR = require('../constant/constantAr');
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
var base_url = constant.base_url;

app.post(constant.PostJob, function (req, res) {
  // console.log(req.body.user_pub_id,req.body.description)
  if (!req.body.cat_id || !req.body.user_pub_id || !req.body.job_title || !req.body.description || !req.body.address || !req.body.latitude || !req.body.longitude || !req.body.time || !req.body.date || !req.body.duration) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    cm.getUserStatus(req.body.user_pub_id, function (err, result) {
      if (err) {
        // console.log('getuserstatus',err,res);
        cm.responseMessage(constant.Zero, err, res)
      }
      else {
        // console.log('insert job');
        var referanceCodeArr = voucher_codes.generate({
          length: 8,
          count: 1,
          charset: "0123456789"
        })
        // var job_id = cm.randomString(8, '0123456789abcdefghijklmnopqrstuvwxyz');
        var job_id = referanceCodeArr[0];
        var parData = {
          job_id: job_id,
          cat_id: req.body.cat_id,
          time: req.body.time,
          date: req.body.date,
          user_pub_id: req.body.user_pub_id,
          job_title: req.body.job_title,
          description: req.body.description,
          duration: req.body.duration,
          address: req.body.address,
          price: req.body.price,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          job_start_time: req.body.job_start_time,
          created_at: (new Date()).valueOf().toString(),
          updated_at: (new Date()).valueOf().toString()
        }
        if(req.body.currency_id)parData.currency_id = req.body.currency_id;
        cm.insert('post_job', parData, function (err, result) {
          if (err) {
            cm.responseMessage(constant.Zero, err, res)
          } else {
            // console.log('job success')
            cm.getNearbyArtistCat(req.body.user_pub_id, req.body.latitude, req.body.longitude, req.body.cat_id, function (err, photograhpar) {
              //photograhpar = JSON.parse(JSON.stringify(photograhpar));
              if(err)console.log('Post job getNearbyArtistCat',err);
              if (photograhpar.length != 0) {
                photograhpar
                  .reduce(function (promiesRes, photograhpardata, index) {
                    return promiesRes
                      .then(function (data) {
                        return new Promise(function (resolve, reject) {
                          // console.log(photograhpardata);
                          con.query('select * from user where user_pub_id="' + photograhpardata.user_pub_id + '"', function (err, result) {
                            if (err) {
                              console.log(err)
                            } else {
                              var result = JSON.parse(JSON.stringify(result));
                              var email = result[0].email_id;
                              var name = result[0].name;
                              var msg = constant.HELLO + '<br><br/>' + name + ' ' + constant.POST_JOB + constant.SIGNATURE;
                              cm.sendmail(email, constant.POST_JOB, msg)
                              var device_token = photograhpardata.device_token;
                              var title = constant.newJob;
                              var msg = constant.jobMsg;
                              var type = constant.post_job_type;
                              var parData = {
                                user_pub_id: photograhpardata.user_pub_id,
                                title: title,
                                type: type,
                                msg: msg,
                                created_at: (new Date()).valueOf().toString()
                              }
                              cm.insert('notification', parData, function (err, result) {
                                if (err) {
                                  cm.responseMessage(constant.Zero, err, res);
                                } else {
                                  fn.pushnotification(title, msg, device_token, type);
                                  resolve(photograhpardata);
                                }
                              })
                            }
                          })
                        });
                      })
                      .catch(function (error) {
                        return error.message;
                      })
                  }, Promise.resolve(null)).then(arrayOfResults => {
                  });
              }
            });
            cm.responseMessage(constant.One, constant.POST_JOB, res)
          }
        })
      }
    })
  }

})

app.post('/directBooking', function (req, res) {
  if (!req.body.cat_id || !req.body.user_pub_id || !req.body.job_title || !req.body.description || !req.body.address || !req.body.latitude || !req.body.longitude || !req.body.time || !req.body.date || !req.body.duration) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    // con.query('select * from post_job where user_pub_id="'+req.body.user_pub_id+'" and artist_pub_id="'+req.body.artist_pub_id+'" and time="'+req.body.time+'"',function(err,result){
    //   if(err){
    //     cm.responseMessage(constant.Zero,err,res);
    //   }else{
    //     if(result.length>0){
    //       cm.responseMessage(constant.Zero,constant.timeMsg,res);
    //     }else{
    // console.log(req.body.user_pub_id)
    cm.getUserStatus(req.body.user_pub_id, function (err, result) {
      if (err) {
        cm.responseMessage(constant.Zero, err, res)
      }
      else {
        cm.getUserStatus(req.body.artist_pub_id, function (err, artistresult) {
          if(artistresult == null || artistresult == '' || artistresult == undefined || artistresult == []){
            artistresult={};
            artistresult.currency_id = '';
          }else{
            artistresult = artistresult[0];
          }
          var status = 1;
          // var job_id = cm.randomString(8, '0123456789abcdefghijklmnopqrstuvwxyz');
          var referanceCodeArr = voucher_codes.generate({
            length: 8,
            count: 1,
            charset: "0123456789"
          })
          // var job_id = cm.randomString(8, '0123456789abcdefghijklmnopqrstuvwxyz');
          var job_id = referanceCodeArr[0];
          var parData = {
            job_id: job_id,
            artist_pub_id: req.body.artist_pub_id,
            cat_id: req.body.cat_id,
            time: req.body.time,
            date: req.body.date,
            user_pub_id: req.body.user_pub_id,
            job_title: req.body.job_title,
            description: req.body.description,
            duration: req.body.duration,
            address: req.body.address,
            status: status,
            price: req.body.price,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            job_start_time: req.body.job_start_time,
            created_at: (new Date()).valueOf().toString(),
            updated_at: (new Date()).valueOf().toString(),
            currency_id:artistresult.currency_id
          }
          cm.insert('post_job', parData, function (err, result) {
            if (err) {
              cm.responseMessage(constant.Zero, err, res)
            } else {
              var insertId = result.insertId;
              con.query('select * from post_job where id="' + insertId + '"', function (err, resultPost) {
                if (err) {
                  cm.responseMessage(constant.Zero, err, res)
                } else {
                  var resultPost = JSON.parse(JSON.stringify(resultPost));
                  var job_id = resultPost[0].job_id;
                  var parApplydata = {
                    job_id: job_id,
                    artist_pub_id: req.body.artist_pub_id,
                    status: 1,
                    created_at: (new Date()).valueOf().toString(),
                    updated_at: (new Date()).valueOf().toString()
                  }
                  cm.insert('apply_job', parApplydata, function (err, result) {
                    if (err) {
                      cm.responseMessage(constant.Zero, err, res)
                    } else {
                      con.query('select * from user where user_pub_id="' + req.body.artist_pub_id + '"', function (err, resultUser) {
                        if (err) {
                          cm.responseMessage(constant.Zero, err, res);
                        } else {
                          var resultUser = JSON.parse(JSON.stringify(resultUser));
                          var title = constant.AccepJotTitle;
                          var msg = constant.Accept_Job_msg;
                          var type = constant.Direct_Job;
                          var device_token = resultUser[0].device_token;
                          var parData = {
                            user_pub_id: req.body.artist_pub_id,
                            title: title,
                            type: type,
                            msg: msg,
                            created_at: (new Date()).valueOf().toString()
                          }
                          cm.insert('notification', parData, function (err, result) {
                            if (err) {
                              cm.responseMessage(constant.Zero, err, res);
                            } else {
                              fn.pushnotification(title, msg, device_token, type)
                              cm.responseMessage(constant.One, constant.POST_JOB, res)
                            }
                          })

                        }
                      })

                    }
                  })
                }
              })
            }
          })
        })
      }
    })
    //     }
    //   }
    // })

  }

})

app.post('/getMyJobs', function (req, res) {
  if (!req.body.user_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkFields, res)
  } else {
    cm.getUserStatus(req.body.user_pub_id, function (err, result){
      if (err) {
        cm.responseMessage(constant.Zero, err, res)
      } else {
        if (result.length > 0) {
          cm.getPostedJobs(req.body.user_pub_id, function (err, result) {
            if (err) {
              cm.responseMessage(constant.Zero, err, res)
            }
            var result = JSON.parse(JSON.stringify(result));
            if (result.length != 0) {
              var resultLength = result.length;
              // console.log(result);
              var counter = 0;
              var result_array = [];
              result.forEach(function (result) {
                con.query('select coalesce(count(job_id),0) as applicant_count from apply_job where job_id="' + result.job_id + '" and status in(0,1,2,5)',async function (err, resultCount) {
                  if (err) {
                    console.log(err);
                  } else {
                    var resultCount = JSON.parse(JSON.stringify(resultCount));
                    if (resultCount.length > 0) {
                      result.applicant_count = resultCount[0].applicant_count;
                    } else {
                      result.applicant_count = 0;
                    }
                    // console.log('result.currency_id0',result.currency_id);
                    con.query('select * from currency_setting where id="' + result.currency_id + '"', function (err, resultCurrency) {
                      if(resultCurrency == null || resultCurrency == '' || resultCurrency == undefined || resultCurrency == []){
                        result.currency_name = '';
                        result.currency_symbol = '';
                      }else{
                        result.currency_name = resultCurrency[0].currency_name;
                        result.currency_symbol = resultCurrency[0].currency_symbol;
                      }
                      // console.log('resultCurrency',result);
                      var is_invoice = 0;
                      cm.GetInvoiceByJobId(result.job_id, function (err, invoce_data) {
                        if(invoce_data == null || invoce_data == '' || invoce_data == undefined || invoce_data == [])invoce_data = {}
                        else {
                          if(invoce_data[0].job_id == null)invoce_data = {}
                          else {
                            invoce_data = invoce_data[0];
                            is_invoice = 1
                          }
                        }
                        result.invoce_data = invoce_data;
                        // console.log('invoce_data',invoce_data);
                        if(is_invoice == 1){
                          var is_rating = 0
                          cm.getRatingByInvoiceId(invoce_data.invoice_id, function (err, rating_data) {
                            if(rating_data == null || rating_data == '' || rating_data == undefined || rating_data == []){
                              rating_data = [];
                              is_rating = 0;
                            }
                            else{
                              var is_rating_data =  rating_data.filter(function(item) {
                                return item.user_pub_id == req.body.user_pub_id;
                              });
                              if(is_rating_data == null || is_rating_data == '' || is_rating_data == undefined)is_rating = 0
                              else is_rating = 1
                            }
                            result.is_rating = is_rating;
                            result.rating_data = rating_data;
                            result_array.push(result);
                            counter++;
                            if(counter == resultLength) {
                              cm.responseMessagedata(constant.One, constant.GET_JOB, result_array, res)
                              console.log("counter" + counter);
                            }
                          });
                        }else{
                          result.rating_data = [];
                          result.is_rating = 0;
                          result_array.push(result);
                          counter++;
                          if (counter == resultLength) {
                            cm.responseMessagedata(constant.One, constant.GET_JOB, result_array, res)
                            console.log("counter" + counter);
                          }
                        }
                      });
                    })
                  }
                })
              })
            } else {
              cm.responseMessage(constant.Zero, constant.NO_CAT, res)
            }
          });
        } else {
          cm.responseMessage(constant.TWo, constant.ACCOUNT_STATUS, res)
        }
      }
    });
  }
});

app.post(constant.UpdateJob, function (req, res) {
  if (!req.body.job_id || !req.body.user_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    cm.getUserStatus(req.body.user_pub_id, function (err, result) {
      if (err) {
        cm.responseMessage(constant.Zero, err, res)
      } else {
        if (result.length != 0) {
          let job_id = req.body.job_id;
          con.query("select * from post_job where job_id='" + job_id + "'", function (err, jobData) {
            if (err) {
              cm.responseMessage(constant.Zero, err, res)
            } else {
              if (jobData.length == 0) {
                cm.responseMessage(constant.Zero, constant.USER_NOT_FOUND, res)
              } else {
                if(req.body.currency_id == null || req.body.currency_id == undefined || req.body.currency_id == '')req.body.currency_id = jobData[0].currency_id
                con.query('update post_job set cat_id=?,time=?,date=?,job_title=?,description=?,duration=?,address=?,latitude=?,longitude=?,price=?,job_start_time=?,currency_id=? where job_id=?', [req.body.cat_id, req.body.time, req.body.date, req.body.job_title, req.body.description, req.body.duration, req.body.address, req.body.latitude, req.body.longitude, req.body.price, req.body.job_start_time, req.body.currency_id, req.body.job_id], function (err, result, fields) {
                  if (err) {
                    cm.responseMessage(constant.Zero, err, res)
                  } else {
                    if (result.length != 0) {
                      cm.responseMessage(constant.One, constant.JOB_UPDATE, res)
                    } else {
                      cm.responseMessage(constant.Zero, constant.NOT_RESPONDING, res)
                    }
                  }
                });
              }
            }
          });
        } else {
          cm.responseMessage(constant.TWo, constant.ACCOUNT_STATUS, res)
        }
      }
    })
  }
});

//Delete Job
app.post(constant.Deletejob, function (req, res) {
  if (!req.body.user_pub_id || !req.body.job_id) {
    cm.responseMessage(constant.Zero, err, res)
  } else {
    cm.getUserStatus(req.body.user_pub_id, function (err, result) {
      if (err) {
        cm.responseMessage(constant.Zero, err, res)
      } else {
        if (result.length != 0) {
          cm.getAppliedJob(req.body.job_id, function (err, job) {
            if (err) {
              cm.responseMessage(constant.Zero, err, res)
            } else {
              if (job.length == 0) {
                var status = 4;
                con.query('update post_job set status=? where job_id=?', [status, req.body.job_id], function (err, result) {
                  if (err) {
                    cm.responseMessage(constant.One, err, res)
                  } else {
                    if (result.length != 0) {
                      var status = 4;
                      con.query('update apply_job set status=? where job_id=?', [status, req.body.job_id], function (err, result) {
                        if (!err) {
                          cm.getUserStatus(req.body.user_pub_id, function (err, result) {
                            if (err) {
                              console.log(err)
                            } else {
                              // var msg=constant.Delete_msg;
                              // var title=constant.Delete_job_title;
                              // var type=constant.Delete_job;
                              //         var result=JSON.parse(JSON.stringify(result));
                              // var reciver_token=result[0].device_token;
                              // fn.pushnotification(title,msg,reciver_token,type);
                              cm.responseMessage(constant.One, constant.JOB_DELETE, res)
                            }
                          })
                        }
                      })
                    } else {
                      cm.responseMessage(constant.Zero, constant.NOT_RESPONDING, res)
                    }
                  }
                });
              } else {
                cm.responseMessage(constant.Zero, constant.ARTIST_WORKING, res)
              }
            }
          });
        } else {
          cm.responseMessage(constant.TWo, constant.ACCOUNT_STATUS)
        }
      }
    })
  }
});

app.post('/rejectJob', function (req, res) {
  if (!req.body.user_pub_id || !req.body.job_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    cm.getUserStatus(req.body.user_pub_id, function (err, result) {
      if (err) {
        cm.responseMessage(constant.Zero, err, res)
      } else {
        if (result.length != 0) {
          cm.getAppliedJob(req.body.job_id, function (err, job) {
            if (err) {
              cm.responseMessage(constant.Zero, err, res)
            } else {
              if (job.length == 0) {
                if (result.length != 0) {
                  var status = 3;
                  con.query('update apply_job set status=? where job_id=? and artist_pub_id="' + req.body.user_pub_id + '"', [status, req.body.job_id], function (err, result) {
                    if (!err) {
                      cm.getUserStatus(req.body.user_pub_id, function (err, result) {
                        if (err) {
                          console.log(err)
                        } else {
                          con.query('select *from post_job where job_id="' + req.body.job_id + '"', function (err, result) {
                            if (err) {
                              console.log(err)
                            } else {
                              var result = JSON.parse(JSON.stringify(result));
                              var user_pub_id = result[0].user_pub_id;
                              con.query("select *from user where user_pub_id='" + user_pub_id + "'", function (err, result) {
                                if (err) {
                                  console.log(err)
                                } else {
                                  var result = JSON.parse(JSON.stringify(result));
                                  // var email=result[0].email_id;
                                  // var name=result[0].name;
                                  con.query('select * from user where user_pub_id="' + req.body.user_pub_id + '"', function (err, resultArtist) {
                                    if (err) {
                                      cm.responseMessage(constant.Zero, err, res);
                                    } else {
                                      var resultArtist = JSON.parse(JSON.stringify(resultArtist));
                                      var emailArtist = resultArtist[0].email;
                                      var name = resultArtist[0].name;
                                      var reciver_token = resultArtist[0].device_token;
                                      var msg = constant.HELLO + '<br><br/>' + name + ' ' + constant.JOB_REJECTED + constant.SIGNATURE;
                                      cm.sendmail(emailArtist, constant.JOB_REJECTED, msg)
                                      var title = constant.Job_reject;
                                      var type = constant.reject_job_type;
                                      var msg = constant.Job_reject_msg;
                                      var parData = {
                                        user_pub_id: req.body.user_pub_id,
                                        title: title,
                                        type: type,
                                        msg: msg,
                                        created_at: (new Date()).valueOf().toString()
                                      }
                                      cm.insert('notification', parData, function (err, result) {
                                        if (err) {
                                          cm.responseMessage(constant.Zero, err, res);
                                        } else {
                                          fn.pushnotification(title, msg, reciver_token, type);
                                          cm.responseMessage(constant.One, constant.JOB_REJECTED, res);
                                        }
                                      })
                                    }
                                  })

                                }
                              })
                            }
                          })
                        }
                      })

                    }
                  })
                } else {

                  cm.responseMessage(constant.Zero, constant.NOT_RESPONDING, res)
                }

              } else {

                cm.responseMessage(constant.Zero, constant.ARTIST_WORKING, res)
              }
            }
          });

        } else {

          cm.responseMessage(constant.TWo, constant.ACCOUNT_STATUS)
        }

      }
    })
  }
});

app.post('/changeJobStatus', function (req, res) {
  if (!req.body.user_pub_id || !req.body.job_id || !req.body.status) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    cm.getUserStatus(req.body.user_pub_id, function (err, result) {
      if (err) {
        cm.responseMessage(constant.Zero, err, res)
      } else {
        if (result.length != 0) {
          var status = req.body.status;
          if (status == 1) {
            con.query('update post_job set status=? where job_id=?', [status, req.body.job_id], function (err, result) {

            })
            con.query('update apply_job set status=? where job_id=?', [3, req.body.job_id], function (err, result) {
            });
          }
          con.query('update apply_job set status=? where job_id=?', [status, req.body.job_id], function (err, result) {

            if (err) {

              cm.responseMessage(constant.Zero, err, res)
            } else {
              if (result.length != 0) {
                var msg = "";
                var mg = "";
                var title = "";
                var type = "";
                if (status == 4) {
                  mg = constant.DELETE_JOB_BY_USER;
                  msg = constant.JOB_DELETE;
                  title = constant.Delete_msg_title;
                  type = constant.Delete_job;
                }
                if (status == 1) {
                  mg = constant.CONFIRM_JOB_BY_USER;
                  msg = constant.JOB_CONFIRM;
                  title = constant.AccepJotTitle;
                  type = constant.Accept_Job;
                }
                if (status == 3) {
                  mg = constant.REJECT_JOB_BY_USER;
                  msg = constant.JOB_REJECTED;
                  title = constant.Reject_title;
                  type = constant.reject_job_type;
                }
                cm.getsingleApplyjob(req.body.job_id, function (err, job) {
                  if (job.length > 0) {
                    var reciver_pub = job[0].artist_pub_id;
                    cm.getUserStatus(reciver_pub, function (err, user_result) {
                      if (err) {
                        cm.responseMessage(constant.Zero, err, res)
                      } else {
                        var data1 = JSON.parse(JSON.stringify(user_result));
                        var reciver_token = data1[0].device_token;
                        fn.pushnotification(title, msg, reciver_token, type);
                      }
                    });
                    cm.responseMessage(constant.One, constant.JOB_START, res)
                  }
                })
              } else {
                cm.responseMessage(constant.Zero, constant.NOT_RESPONDING, res)
              }
            }
          })
        } else {
          cm.responseMessage(constant.TWo, constant.ACCOUNT_STATUS, res)
        }
      }
    });
  }
});

//Apply Job
app.post(constant.ApplyJob, function (req, res) {
  if (!req.body.user_pub_id || !req.body.job_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    cm.getUserStatus(req.body.user_pub_id, function (err, result) {
      if (err) {
        cm.responseMessage(constant.Zero, err, res)
      } else {
        var userDate = JSON.parse(JSON.stringify(result));
        if(userDate[0].is_artist == 0){
          cm.responseMessage(constant.Zero, constant.CANT_APPLIED_JOB, res)
        }else{
          var parData = {
            artist_pub_id: req.body.user_pub_id,
            job_id: req.body.job_id,
            created_at: (new Date()).valueOf().toString(),
            updated_at: (new Date()).valueOf().toString(),
          }
          con.query("INSERT INTO apply_job set ?", parData, function (err, result) {
            if (err) {
              cm.responseMessage(constant.Zero, err, res)
            } else {
              con.query('select *from post_job where job_id="' + req.body.job_id + '"', function (err, Jobresult) {
                if (err) {
                  console.log(err)
                } else {
                  var Jobresult = JSON.parse(JSON.stringify(Jobresult));
                  var user_pub_id = Jobresult[0].user_pub_id;
                  con.query('select *from user where user_pub_id="' + user_pub_id + '"', function (err, userresult) {
                    if (err) {
                      console.log(err)
                    } else {
                      //    var email=userresult[0].email_id
                      //      console.log(email)
                      //      var user_name=userresult[0].name
                      //      console.log(user_pub_id);
  
                      //   var msg = constant.HELLO+'<br><br/>'+user_name+constant.APPLIED_JOB+constant.SIGNATURE;
                      // cm.sendmail(email,constant.APPLIED_JOB,msg)
                      //      cm.responseMessage(constant.One,constant.APPLIED_JOB,res)
                      con.query('select *from user where user_pub_id="' + user_pub_id + '"', function (err, result) {
                        if (err) {
                          console.log(err)
                        } else {
                          var email1 = userresult[0].email_id
                          var user_name = userresult[0].name
                          var result = JSON.parse(JSON.stringify(result));
                          var email2 = result[0].email_id;
                          var user_name = result[0].name;
                          var msg = constant.HELLO + '<br><br/>' + user_name + ' ' + constant.APPLIED_JOB + constant.SIGNATURE;
                          cm.sendmail(email1, constant.APPLIED_JOB, msg)
                          var msg1 = constant.APPLIED_JOB;
                          var title = constant.Applied_job_title;
                          var type = constant.Applied_job;
                          var device_token = result[0].device_token;
                          var parData = {
                            user_pub_id: user_pub_id,
                            title: title,
                            type: type,
                            msg: msg1,
                            created_at: (new Date()).valueOf().toString()
                          }
                          cm.insert('notification', parData, function (err, result) {
                            if (err) {
                              cm.responseMessage(constant.Zero, err, res);
                            } else {
                              fn.pushnotification(title, msg1, device_token, type)
                              cm.responseMessage(constant.One, constant.APPLIED_JOB, res)
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
        
      }
    })
  }
})

//Get Job throw Status
app.post(constant.GetJobByStatus, function (req, res) {
  if (!req.body.user_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res);
  } else {
    var status = req.body.status;
    var user_pub_id = req.body.user_pub_id;
    var Latitude = req.body.latitude;
    var Longitude = req.body.longitude;
    var distance = '';
    if(Latitude && Longitude)distance = '111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS('+Latitude+')) * COS(RADIANS(p.Latitude)) * COS(RADIANS('+Longitude+' - p.Longitude)) + SIN(RADIANS('+Latitude+')) * SIN(RADIANS(p.Latitude))))) AS distance_in_km'
    else distance = '';
    var qua = '';
    if(distance)qua = 'select p.*,a.*,c.cat_name, u.name,u.mobile_no,'+distance+',cs.currency_symbol,concat("' + base_url + '",u.image)  as image,GROUP_CONCAT(c.cat_name) as cat_name from post_job p join categories c on FIND_IN_SET(c.id,p.cat_id) join user u on u.user_pub_id = p.user_pub_id  join currency_setting cs on cs.status="1" join apply_job a on p.job_id=a.job_id where a.artist_pub_id="' + user_pub_id + '" and a.status="' + status + '" GROUP BY p.job_id order by a.created_at desc';
    else qua = 'select p.*,a.*,c.cat_name, u.name,u.mobile_no,cs.currency_symbol,concat("' + base_url + '",u.image)  as image,GROUP_CONCAT(c.cat_name) as cat_name from post_job p join categories c on FIND_IN_SET(c.id,p.cat_id) join user u on u.user_pub_id = p.user_pub_id  join currency_setting cs on cs.status="1" join apply_job a on p.job_id=a.job_id where a.artist_pub_id="' + user_pub_id + '" and a.status="' + status + '" GROUP BY p.job_id order by a.created_at desc';
    con.query(qua, function (err, resultPostData) {
      if (err) {
        cm.responseMessage(constant.Zero, err, res);
      } else {
        var resultPostData = JSON.parse(JSON.stringify(resultPostData));
        if (resultPostData.length > 0) {
          if (status == "0")var message = constant.pending_job;
          if (status == "1")var message = constant.confirmJob;
          if (status == "2")var message = constant.getCompleteJob;
          if (status == "3")var message = constant.getRejectJob;
          if (status == "4")var message = constant.getDeactivejob;
          if (status == "5"){
            var message = constant.runningJob;
            var startTime = resultPostData[0].start_time;
            var endTime = (new Date()).valueOf().toString();
            var difference = endTime - startTime; // This will give difference in milliseconds
            var resultInMinutes = Math.round(difference / 60000);
            console.log('resultInMinutes',resultInMinutes);
            resultPostData[0].total_time = resultInMinutes
          }
          var result_array = [];
          var counter = 0;
          var resultLength = resultPostData.length;
          resultPostData.forEach(function (result) {
            con.query('select * from currency_setting where id="' + result.currency_id + '"', function (err, resultCurrency) {
              if(resultCurrency == null || resultCurrency == '' || resultCurrency == undefined || resultCurrency == []){
                result.currency_name = '';
                result.currency_symbol = '';
              }else{
                result.currency_name = resultCurrency[0].currency_name;
                result.currency_symbol = resultCurrency[0].currency_symbol;
              }
              var is_invoice = 0;
              cm.GetInvoiceByJobId(result.job_id, function (err, invoce_data) {
                if(invoce_data == null || invoce_data == '' || invoce_data == undefined || invoce_data == [])invoce_data = {}
                else {
                  if(invoce_data[0].job_id == null)invoce_data = {}
                  else {
                    invoce_data = invoce_data[0];
                    is_invoice = 1
                  }
                }
                result.invoce_data = invoce_data;
                // console.log('invoce_data',invoce_data);
                if(is_invoice == 1){
                  var is_rating = 0
                  cm.getRatingByInvoiceId(invoce_data.invoice_id, function (err, rating_data) {
                    if(rating_data == null || rating_data == '' || rating_data == undefined || rating_data == []){
                      rating_data = [];
                      is_rating = 0;
                    }
                    else{
                      var is_rating_data =  rating_data.filter(function(item) {
                        return item.user_pub_id == req.body.user_pub_id;
                      });
                      if(is_rating_data == null || is_rating_data == '' || is_rating_data == undefined)is_rating = 0
                      else is_rating = 1
                    }
                    result.is_rating = is_rating;
                    result.rating_data = rating_data;
                    result_array.push(result);
                    counter++;
                    if(counter == resultLength) {
                      cm.responseMessagedata(constant.One, message, result_array, res)
                      console.log("counter" + counter);
                    }
                  });
                }else{
                  result.rating_data = [];
                  result.is_rating = 0;
                  result_array.push(result);
                  counter++;
                  if (counter == resultLength) {
                    cm.responseMessagedata(constant.One, message, result_array, res)
                    console.log("counter" + counter);
                  }
                }
              });
            })
          })
          // cm.responseMessagedata(constant.One, message, resultPostData, res);
        } else {
          var msg = constant.NODATA;
          cm.responseMessage(constant.Zero, msg, res);
        }
      }
    })
  }
});

//Get favourite job
app.post('/getFavouriteJob', function (req, res) {
  if (!req.body.user_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res);
  } else {
    // var status = req.body.status;
    var user_pub_id = req.body.user_pub_id;
    // status in(0,1,2,5)'
    var Latitude = req.body.latitude;
    var Longitude = req.body.longitude;
    var distance = '';
    if(Latitude && Longitude)distance = '111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS('+Latitude+')) * COS(RADIANS(p.Latitude)) * COS(RADIANS('+Longitude+' - p.Longitude)) + SIN(RADIANS('+Latitude+')) * SIN(RADIANS(p.Latitude))))) AS distance_in_km'
    else distance = '';
    
    con.query('select target_id from favourite where user_pub_id="'+req.body.user_pub_id+'" AND status="1"', function (err, favjobdata) {
      console.log('favjobdata',favjobdata);
      if(favjobdata == null || favjobdata == '' || favjobdata == undefined || favjobdata == []){
        var msg = constant.NODATA;
        cm.responseMessage(constant.Zero, msg, res);
      }else{
        favjobdata = JSON.parse(JSON.stringify(favjobdata));
        var favJobId = '';
        for(let i=0; i<favjobdata.length; i++){
          if(i+1 == favjobdata.length){
            favJobId +=  '"'+favjobdata[i].target_id+'"'
          }else{
            favJobId +=  '"'+favjobdata[i].target_id+'",'
          }
        }
        var qua = '';
        if(distance)qua = 'select p.*,c.cat_name, u.name,u.mobile_no,'+distance+',cs.currency_symbol,concat("' + base_url + '",u.image)  as image,GROUP_CONCAT(c.cat_name) as cat_name from post_job p join categories c on FIND_IN_SET(c.id,p.cat_id) join user u on u.user_pub_id = p.user_pub_id  join currency_setting cs on cs.status="1" where p.job_id in('+favJobId+') AND p.status="0" GROUP BY p.job_id order by p.created_at desc';
        else qua = 'select p.*,c.cat_name, u.name,u.mobile_no,cs.currency_symbol,concat("' + base_url + '",u.image)  as image,GROUP_CONCAT(c.cat_name) as cat_name from post_job p join categories c on FIND_IN_SET(c.id,p.cat_id) join user u on u.user_pub_id = p.user_pub_id  join currency_setting cs on cs.status="1" where p.job_id in('+favJobId+') AND p.status="0" GROUP BY p.job_id order by p.created_at desc';
        con.query(qua, function (err, resultPostData) {
          if (err) {
            cm.responseMessage(constant.Zero, err, res);
          } else {
            var resultPostData = JSON.parse(JSON.stringify(resultPostData));
            if (resultPostData.length > 0) {
              var message = constant.favourite_job;
              var result_array = [];
              var counter = 0;
              var resultLength = resultPostData.length;
              resultPostData.forEach(function (result) {
                con.query('select * from currency_setting where id="' + result.currency_id + '"', function (err, resultCurrency) {
                  if(resultCurrency == null || resultCurrency == '' || resultCurrency == undefined || resultCurrency == []){
                    result.currency_name = '';
                    result.currency_symbol = '';
                  }else{
                    result.currency_name = resultCurrency[0].currency_name;
                    result.currency_symbol = resultCurrency[0].currency_symbol;
                  }
                  var is_invoice = 0;
                  cm.GetInvoiceByJobId(result.job_id, function (err, invoce_data) {
                    if(invoce_data == null || invoce_data == '' || invoce_data == undefined || invoce_data == [])invoce_data = {}
                    else {
                      if(invoce_data[0].job_id == null)invoce_data = {}
                      else {
                        invoce_data = invoce_data[0];
                        is_invoice = 1
                      }
                    }
                    result.invoce_data = invoce_data;
                    // console.log('invoce_data',invoce_data);
                    if(is_invoice == 1){
                      var is_rating = 0
                      cm.getRatingByInvoiceId(invoce_data.invoice_id, function (err, rating_data) {
                        if(rating_data == null || rating_data == '' || rating_data == undefined || rating_data == []){
                          rating_data = [];
                          is_rating = 0;
                        }
                        else{
                          var is_rating_data =  rating_data.filter(function(item) {
                            return item.user_pub_id == req.body.user_pub_id;
                          });
                          if(is_rating_data == null || is_rating_data == '' || is_rating_data == undefined)is_rating = 0
                          else is_rating = 1
                        }
                        result.is_rating = is_rating;
                        result.rating_data = rating_data;
                        result_array.push(result);
                        counter++;
                        if(counter == resultLength) {
                          cm.responseMessagedata(constant.One, message, result_array, res)
                          console.log("counter" + counter);
                        }
                      });
                    }else{
                      result.rating_data = [];
                      result.is_rating = 0;
                      result_array.push(result);
                      counter++;
                      if (counter == resultLength) {
                        cm.responseMessagedata(constant.One, message, result_array, res)
                        console.log("counter" + counter);
                      }
                    }
                  });
                });  
              })
              // cm.responseMessagedata(constant.One, message, resultPostData, res);
            } else {
              var msg = constant.NODATA;
              cm.responseMessage(constant.Zero, msg, res);
            }
          }
        })
      }
    })
  }
});

//Get All Posted Artist
app.post(constant.GetJobsArtist, function (req, res) {
  if (!req.body.user_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res);
  } else {
    if (!req.body.cat_id) {
      cm.getUserStatus(req.body.user_pub_id, function (err, result) {
        if (err) {
          cm.responseMessage(constant.Zero, constant.USER_NOT_FOUND, res)
        } else {
          if (result.length > 0) {
              cm.getJobsArtist1(req.body.user_pub_id,req.body.latitude,req.body.longitude, function (err, resultArtistJob) {
              if (err) {
                cm.responseMessage(constant.Zero, constant.ERR, res)
              }
              if (resultArtistJob.length != 0) {
                var result_array = [];
                var counter = 0;
                var resultLength = resultArtistJob.length;
                resultArtistJob.forEach(function (result) {
                  con.query('select * from currency_setting where id="' + result.currency_id + '"', function (err, resultCurrency) {
                    if(resultCurrency == null || resultCurrency == '' || resultCurrency == undefined || resultCurrency == []){
                      result.currency_name = '';
                      result.currency_symbol = '';
                    }else{
                      result.currency_name = resultCurrency[0].currency_name;
                      result.currency_symbol = resultCurrency[0].currency_symbol;
                    }
                    var is_invoice = 0;
                    cm.GetInvoiceByJobId(result.job_id, function (err, invoce_data) {
                      if(invoce_data == null || invoce_data == '' || invoce_data == undefined || invoce_data == [])invoce_data = {}
                      else {
                        if(invoce_data[0].job_id == null)invoce_data = {}
                        else {
                          invoce_data = invoce_data[0];
                          is_invoice = 1
                        }
                      }
                      result.invoce_data = invoce_data;
                      // console.log('invoce_data',invoce_data);
                      if(is_invoice == 1){
                        var is_rating = 0
                        cm.getRatingByInvoiceId(invoce_data.invoice_id, function (err, rating_data) {
                          if(rating_data == null || rating_data == '' || rating_data == undefined || rating_data == []){
                            rating_data = [];
                            is_rating = 0;
                          }
                          else{
                            var is_rating_data =  rating_data.filter(function(item) {
                              return item.user_pub_id == req.body.user_pub_id;
                            });
                            if(is_rating_data == null || is_rating_data == '' || is_rating_data == undefined)is_rating = 0
                            else is_rating = 1
                          }
                          result.is_rating = is_rating;
                          result.rating_data = rating_data;
                          result_array.push(result);
                          counter++;
                          if(counter == resultLength) {
                            cm.responseMessagedata(constant.One, constant.GET_JOB, result_array, res)
                            console.log("counter" + counter);
                          }
                        });
                      }else{
                        result.rating_data = [];
                        result.is_rating = 0;
                        result_array.push(result);
                        counter++;
                        if (counter == resultLength) {
                          cm.responseMessagedata(constant.One, constant.GET_JOB, result_array, res)
                          console.log("counter" + counter);
                        }
                      }
                    });
                  })
                })
                // cm.responseMessagedata(constant.One, constant.GET_JOB, result, res)
              } else {
                cm.responseMessage(constant.Zero, constant.NO_CAT, res)
              }
            });
          } else {
            cm.responseMessage(constant.TWo, constant.ACCOUNT_STATUS, res)
          }
        }
      });
    } else {
      cm.getUserStatus(req.body.user_pub_id, function (err, result) {
        if (err) {
          cm.responseMessage(constant.Zero, constant.USER_NOT_FOUND, res)
        } else {
          if (result.length > 0) {
            var cat_id = result[0].cat_id;
            cm.getJobsArtist(req.body.user_pub_id, req.body.cat_id, req.body.job_id,req.body.latitude,req.body.longitude, function (err, resultArtistJob) {
              if (err) {
                console.log(err)
                cm.responseMessage(constant.Zero, err, res)
              }
              var resultArtistJob = JSON.parse(JSON.stringify(resultArtistJob));
              if (resultArtistJob.length > 0) {
                var result_array = [];
                var counter = 0;
                var resultLength = resultArtistJob.length;
                resultArtistJob.forEach(function (result) {
                  con.query('select * from currency_setting where id="' + result.currency_id + '"', function (err, resultCurrency) {
                    if(resultCurrency == null || resultCurrency == '' || resultCurrency == undefined || resultCurrency == []){
                      result.currency_name = '';
                      result.currency_symbol = '';
                    }else{
                      result.currency_name = resultCurrency[0].currency_name;
                      result.currency_symbol = resultCurrency[0].currency_symbol;
                    }
                    var is_invoice = 0;
                    cm.GetInvoiceByJobId(result.job_id, function (err, invoce_data) {
                      if(invoce_data == null || invoce_data == '' || invoce_data == undefined || invoce_data == [])invoce_data = {}
                      else {
                        if(invoce_data[0].job_id == null)invoce_data = {}
                        else {
                          invoce_data = invoce_data[0];
                          is_invoice = 1
                        }
                      }
                      result.invoce_data = invoce_data;
                      // console.log('invoce_data',invoce_data);
                      if(is_invoice == 1){
                        var is_rating = 0
                        cm.getRatingByInvoiceId(invoce_data.invoice_id, function (err, rating_data) {
                          if(rating_data == null || rating_data == '' || rating_data == undefined || rating_data == []){
                            rating_data = [];
                            is_rating = 0;
                          }
                          else{
                            var is_rating_data =  rating_data.filter(function(item) {
                              return item.user_pub_id == req.body.user_pub_id;
                            });
                            if(is_rating_data == null || is_rating_data == '' || is_rating_data == undefined)is_rating = 0
                            else is_rating = 1
                          }
                          result.is_rating = is_rating;
                          result.rating_data = rating_data;
                          result_array.push(result);
                          counter++;
                          if(counter == resultLength) {
                            cm.responseMessagedata(constant.One, constant.GET_JOB, result_array, res)
                            console.log("counter" + counter);
                          }
                        });
                      }else{
                        result.rating_data = [];
                        result.is_rating = 0;
                        result_array.push(result);
                        counter++;
                        if (counter == resultLength) {
                          cm.responseMessagedata(constant.One, constant.GET_JOB, result_array, res)
                          console.log("counter" + counter);
                        }
                      }
                    });
                  })
                })
                // cm.responseMessagedata(constant.One, constant.GET_JOB, result, res)
              } else {
                cm.responseMessage(constant.Zero, constant.NO_CAT, res)
              }
            });
          } else {
            cm.responseMessage(constant.TWo, constant.ACCOUNT_STATUS, res)
          }
        }
      });
    }
  }
});

//Get Jobs Applid By User
app.post(constant.GetJobsAppliedByUser, function (req, res) {
  if (!req.body.user_pub_id || !req.body.job_id) {
    cm.responseMessage(constant.Zero, constant.chkFields, res);
  } else {
    cm.getUserStatus(req.body.user_pub_id, function (err, result) {
      if (err) {
        cm.responseMessage(constant.Zero, err, res);

      } else {
        if (result.length > 0) {
          cm.getJobsAppliedUser(req.body.job_id, function (err, result) {
            if (err) {
              cm.responseMessage(constant.Zero, err, res);
            }
            result = JSON.parse(JSON.stringify(result));
            if (result.length != 0) {
              res.send({
                "status": 1,
                "message": constant.GET_JOB,
                "data": result,
                "count": result.length
              });
            } else {
              cm.responseMessage(constant.Zero, constant.NO_CAT, res);
            }
          });
        } else {
          // res.send({
          //     "status": 2,
          //     "message": constant.ACCOUNT_STATUS
          // });
          cm.responseMessage(constant.TWo, constant.ACCOUNT_STATUS, res);
        }
      }
    });
  }
});

//Accept
app.post(constant.AcceptJobByUser, function (req, res) {
  if (!req.body.job_id || !req.body.artist_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  }
  cm.getUserStatus(req.body.artist_pub_id, function (err, artistresult) {
    if(artistresult == null || artistresult == '' || artistresult == undefined || artistresult == []){
      artistresult={};
      artistresult.currency_id = '';
    }else{
      artistresult = artistresult[0];
    }//currency_id="'+artistresult.currency_id+'"
    con.query('update post_job set status="1", artist_pub_id="'+req.body.artist_pub_id+'" where job_id="' + req.body.job_id + '" ', function (err, resultJob) {
      if (err) {
        cm.responseMessage(constant.Zero, constant.ERR, res)
      } else {
        con.query('update apply_job set status="1" where job_id="' + req.body.job_id + '" and artist_pub_id="' + req.body.artist_pub_id + '"', function (err, resultJob) {
          if (err) {
            cm.responseMessage(constant.Zero, constant.Err, res)
          } else {
            con.query('update apply_job set status="3" where job_id="' + req.body.job_id + '" and artist_pub_id!="' + req.body.artist_pub_id + '"', function (err, resultJob) {
              if (err) {
                // console.log(err);
                cm.responseMessage(constant.Zero, constant.ERR, res);
              } else {
                con.query('select * from user where user_pub_id="' + req.body.artist_pub_id + '"', function (err, resulUser) {
                  if (err) {
                    cm.responseMessage(constant.Zero, err, res);
                  } else {
                    var resulUser = JSON.parse(JSON.stringify(resulUser));
                    console.log(resulUser);
                    var name = resulUser[0].name;
                    var email = resulUser[0].email_id;
                    console.log(email)
                    var msg = constant.HELLO + '<br><br/>' + name + constant.APPLIED_JOB + constant.SIGNATURE;
                    cm.sendmail(email, constant.AccepJotTitle, msg);

                    var title = constant.AccepJotTitle;
                    var msg1 = constant.Accept_Job_msg;
                    var type = constant.Accept_Job;
                    var device_token = resulUser[0].device_token;
                    var parData = {
                      user_pub_id: req.body.artist_pub_id,
                      title: title,
                      type: type,
                      msg: msg1,
                      created_at: (new Date()).valueOf().toString()
                    }
                    cm.insert('notification', parData, function (err, result) {
                      if (err) {
                        cm.responseMessage(constant.Zero, err, res);
                      } else {
                        fn.pushnotification(title, msg1, device_token, type)
                        cm.responseMessage(constant.One, constant.AccepJotTitle, res)
                      }
                    })

                  }
                })
              }
            })
          }
        })
      }
    })
  })
})

//Start_job
app.post(constant.StartJob, function (req, res) {
  if (!req.body.user_pub_id || !req.body.job_id) {
    console.log("check all field")
    cm.responseMessage(constant.Zero, constant.chkField, res)

  } else {
    con.query('select * FROM apply_job where artist_pub_id="' + req.body.user_pub_id + '" and status="5"', function (err, result1) {
      if (err) {
        console.log(err)
      } else {
        if (result1.length > 0) {

          cm.responseMessage(constant.Zero, constant.jobRunning, res)

        } else {
          var parData = {
            status: 5,
            end_time: "",
            start_time: (new Date()).valueOf().toString(),
            updated_at: (new Date()).valueOf().toString(),
          }
          con.query('update apply_job set status="5" where job_id=? and artist_pub_id="' + req.body.user_pub_id + '" and status="1"', [req.body.job_id], function (err, result) {
            if (err) {
              console.log(err)
            } else {
              con.query('update post_job set ? where job_id=?', [parData, req.body.job_id], function (err, resultStart) {
                if (err) {
                  console.log(err)
                } else {
                  con.query("select *from post_job where job_id='" + req.body.job_id + "'", function (err, result) {
                    if (result.length > 0) {
                      var reciver_pub = result[0].user_pub_id;
                      cm.getUserStatus(reciver_pub, function (err, user_result) {
                        if (err) {
                          console.log(err)
                        } else {
                          var user_result = JSON.parse(JSON.stringify(user_result));
                          var email = user_result[0].email_id;


                          var name = user_result[0].name;
                          var msg = constant.HELLO + '<br><br/>' + name + constant.JOB_START + constant.SIGNATURE;
                          cm.sendmail(email, constant.JOB_START, msg);
                          var user_pub_id = user_result[0].user_pub_id;
                          var device_token = user_result[0].device_token;
                          var title = constant.startJob;
                          var msg1 = constant.StartJobByArtist;
                          var type = constant.Start_job;
                          var parData = {
                            user_pub_id: user_pub_id,
                            title: title,
                            type: type,
                            msg: msg1,
                            created_at: (new Date()).valueOf().toString()
                          }
                          cm.insert('notification', parData, function (err, result) {
                            if (err) {
                              cm.responseMessage(constant.Zero, err, res);
                            } else {
                              fn.pushnotification(title, msg1, device_token, type)
                              cm.responseMessage(constant.One, constant.START_JOB, res);
                            }
                          })
                        }
                      });
                      // res.send({
                      // 	"status":1,
                      // 	"message":"start job"
                      // })
                    }
                  })
                }
              })
            }
          })
        }
      }
    })

  }
})
//end job

app.post(constant.EndJob, function (req, res) {
  if (!req.body.user_pub_id || !req.body.job_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    con.query("select *from post_job where job_id='" + req.body.job_id + "' and status !='2'", function (err, result) {
      if (err) {
        console.log('EndJob1')
        cm.responseMessage(constant.Zero, constant.ERR, res)
      } else {
        con.query('update apply_job set status="2" where job_id="' + req.body.job_id + '" and status="5"', function (err, result) {
          if (err) {
            console.log('EndJob2')
            cm.responseMessage(constant.Zero, constant.ERR, res)
          } else {
            var end_time = (new Date()).valueOf().toString();
            con.query('update post_job set status="2",end_time="' + end_time + '" where job_id="' + req.body.job_id + '"', function (err, result) {
              if (err) {
                console.log('EndJob3')
                cm.responseMessage(constant.Zero, constant.ERR, res)
              } else {
                con.query('SELECT * from post_job where job_id="' + req.body.job_id + '" and status ="2"', function (err, result) {
                  if (result.length > 0) {
                    var user_id = result[0].user_pub_id;
                    var parData = {
                      user_pub_id: user_id,
                      final_amount: result[0].price,
                      status: 0,
                      job_id: req.body.job_id,
                      invoice_id: cm.randomString(8, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                      artist_pub_id: req.body.user_pub_id,
                      net_amount:result[0].price,
                      created_at: (new Date()).valueOf().toString(),
                      updated_at: (new Date()).valueOf().toString(),
                      currency_id: result[0].currency_id
                    }
                    console.log(parData);
                    con.query('insert into booking_invoice1 set ?', [parData], function (err, result) {
                      if (err) {
                        console.log('EndJob4',err)
                        cm.responseMessage(constant.Zero, constant.ERR, res)
                      } else {
                        con.query('select *from user where user_pub_id="' + user_id + '"', function (err, result) {
                          if (err) {
                            console.log('EndJob5');
                            console.log(err)
                          } else {
                            var result = JSON.parse(JSON.stringify(result));
                            var email = result[0].email_id;
                            var name = result[0].name
                            var msg = constant.HELLO + '<br><br/>' + name + ' ' + constant.Completejob + constant.SIGNATURE;
                            cm.sendmail(email, constant.Completejob, msg);
                            var device_token = result[0].device_token;
                            var title = constant.Completejob;
                            var msg1 = constant.completeJobMsg;
                            var type = constant.end_job;
                            var parData = {
                              user_pub_id: user_id,
                              title: title,
                              type: type,
                              msg: msg1,
                              created_at: (new Date()).valueOf().toString()
                            }
                            cm.insert('notification', parData, function (err, result) {
                              if (err) {
                                console.log('EndJob6')
                                cm.responseMessage(constant.Zero, err, res);
                              } else {
                                fn.pushnotification(title, msg1, device_token, type)
                                cm.responseMessage(constant.One, constant.end_job_succ, res)
                              }
                            })
                          }
                        })
                      }
                    })
                  } else {
                    cm.responseMessage(constant.Zero, constant.NOT_FOUND_DATA, res)
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})

//get all Active job Job

app.post(constant.GetAllActiveJobs, function (req, res) {
  if (!req.body.user_pub_id) {
    // console.log("not define")
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  }
  else {
    con.query('SELECT *FROM POST_JOB where user_pub_id="' + req.body.user_pub_id + '" and status="5"', function (err, result) {
      if (err) {
        // console.log(err)
        cm.responseMessage(constant.Zero, constant.ERR, res)
      } else {


        cm.responseMessagedata(constant.One, constant.ActiveJob, result, res)
      }
    })
  }
});

//get All ActiveJob 
app.post(constant.GetCurrentJob, function (req, res) {
  if (!req.body.user_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    cm.getUserStatus(req.body.user_pub_id, function (err, result) {
      if (err) {
        cm.responseMessage(constant.Zero, constant.ERR, res)
      } else {
        if (result.length > 0) {
          cm.getCurrentAppointmentArtist(req.body.user_pub_id, function (err, Activeresult) {
            if (err) {
              cm.responseMessage(constant.Zero, constant.ERR, res)
            }
            Activeresult = JSON.parse(JSON.stringify(Activeresult));
            if (Activeresult.length != 0) {
              var startTime = Activeresult[0].start_time;
              var endTime = (new Date()).valueOf().toString();
              var difference = endTime - startTime; // This will give difference in milliseconds
              var resultInMinutes = Math.round(difference / 60000);
              Activeresult[0].total_time = resultInMinutes;
              cm.responseMessagedata(constant.One, constant.CURRENT_APPOINTMENT, Activeresult, res)
            } else {
              cm.responseMessage(constant.Zero, constant.NODATA, res)
            }
          });
        } else {
          cm.responseMessage(constant.TWo, constant.ACCOUNT_STATUS, res)
        }
      }
    });
  }
});

//Near Artist
app.post(constant.GetNearestArtist, function (req, res) {
  console.log(req.body.user_pub_id,req.body.latitude,req.body.longitude)
  if (!req.body.user_pub_id || !req.body.latitude || !req.body.longitude) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    cm.getUserStatus(req.body.user_pub_id, function (err, result) {
      if (err) {
        cm.responseMessage(constant.Zero, constant.ERR, res)
      } else {
        if (result.length > 0) {
          cm.getNearbyArtist(req.body.user_pub_id, req.body.latitude, req.body.longitude, function (err, NearArtistresult) {
            if (err) {
              console.log('1',err)
              cm.responseMessage(constant.Zero, constant.ERR, res)
            }
            NearArtistresult = JSON.parse(JSON.stringify(NearArtistresult));
            if (NearArtistresult.length != 0) {
              res.send({
                "status": 1,
                "message": constant.GET_ARTIST_NEAR,
                "data": NearArtistresult,
                "count": NearArtistresult.length
              });

            } else {

              cm.responseMessage(constant.Zero, constant.NODATA, res)
            }
          });
        } else {

          cm.responseMessage(constant.TWo, constant.ACCOUNT_STATUS, res)
        }
      }
    });
  }
});

app.post('/getAllArtist', function (req, res) {
  if (!req.body.user_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    console.log('search artist');
    cm.getUserStatus(req.body.user_pub_id, function (err, result) {
      if (err) {
        console.log('getUserStatus',err);
        cm.responseMessage(constant.Zero.constant.NODATA, res)
      } else {
        var result = JSON.parse(JSON.stringify(result));
        // console.log(result)
        if (result.length > 0) {
          if (!req.body.cat_id) {
            var result_array = [];
            var c = 0;
            cm.getAllArtist1(req.body.user_pub_id, function (err, result1) {
              if (err) {
                console.log('getAllArtist1',err);
                cm.responseMessage(constant.Zero, constant.ERR, res)
              } else {
                if (result1 == '' || result1 == undefined || result1 == null || result1 == []) {
                  cm.responseMessage(constant.Zero, constant.NODATA, res);
                } else {
                  var result1 = JSON.parse(JSON.stringify(result1));
                  cm.responseMessagedata(constant.One, constant.getAllArtist, result1, res);
                }
              }
            })
          } else {
            cm.getAllArtist(req.body.user_pub_id, req.body.cat_id, function (err, result1) {
              if (err) {
                console.log('getAllArtist',err);
                cm.responseMessage(constant.Zero, constant.ERR, res)
              } else {
                if (result1 == '' || result1 == undefined || result1 == null || result1 == []) {
                  cm.responseMessage(constant.Zero, constant.NODATA, res);
                } else {
                  var result1 = JSON.parse(JSON.stringify(result1));
                  cm.responseMessagedata(constant.One, constant.getAllArtist, result1, res);
                }
              }
            })
          }
        }
      }
    })
  }
})

function commentedCode(){
// app.post('/getAllArtist',function(req,res){
//   console.log("getAllArtist")
//   if(!req.body.user_pub_id ){
//     cm.responseMessage(constant.Zero,constant.chkfield,res)
//   }else{
//     cm.getUserStatus(req.body.user_pub_id,function(err,result){
//       if(err){
//         cm.responseMessage(constant.Zero.constant.NODATA,res)
//       }else{
//         var result=JSON.parse(JSON.stringify(result));
//         // console.log(result)
//         if(result.length>0){
//           if(!req.body.cat_id){
//             var result_array=[];
//             var c=0;
//              cm.getAllArtist1(req.body.user_pub_id,function(err,result1){
//           if(err){
//             cm.responseMessage(constant.Zero,constant.ERR,res)
//           }else{

//             var result1=JSON.parse(JSON.stringify(result1));
//                         if(result1.length>0){           
//            result1.forEach(function(rows){
//             con.query('select * from rating where artist_pub_id="'+rows.user_pub_id+'"',function(err,resultRating){
//               if(err){
//                 res.send({
//                   "status":0,
//                   "message":err
//                 })
//               }else{
//                 var resultRating=JSON.parse(JSON.stringify(resultRating));
//                 rows.Rating=resultRating;
//                 con.query('select COALESCE(ROUND(AVG(rating),2),0)as Allrating from rating where artist_pub_id="'+rows.user_pub_id+'"',function(err,resultAllRating){
//                   if(err){
//                     res.send({
//                       "status":0,
//                       "message":err
//                     })
//                   }else{
//                       var resultAllRating=JSON.parse(JSON.stringify(resultAllRating));
//                       rows.Allrating=resultAllRating[0];
//                       var result_service=[];
//                       con.query('select * from service where user_pub_id="'+rows.user_pub_id+'"',function(err,resultService){
//                         if(err){
//                             res.send({
//                               "status":0,
//                               "message":err
//                             })
//                         }else{
//                           if(resultService.length>0){
//                             var resultService=JSON.parse(JSON.stringify(resultService));
//                             var resultLength=resultService.length;
//           // for(var i=0;i<result.length;i++){
//              resultService.forEach(function(row_service){
//             con.query('select concat("'+base_url+'",service_image) as service_image from service_images where service_id="'+row_service.service_id+'"',function(err,resultServiceImage){
//               if(err){
//                 console.log(err);
//               }else{
//                 var resultImage=JSON.parse(JSON.stringify(resultServiceImage));
//                 // console.log(resultImage);
//                 row_service.service_image=resultImage[0];

//                   result_service.push(row_service);

//                  rows.service= result_service;
//               con.query('select * from apply_job where artist_pub_id="'+rows.user_pub_id+'" and status="2"',function(err,resultwork){
//   if(err){
//     res.send({
//       "status":0,
//       "message":err
//     })
//   }else{
//     var result_work=[];

//     var result=JSON.parse(JSON.stringify(resultwork));
//     console.log(result);
//     if(result.length>0){
//     var resultLength2=result.length;
//     resultwork.forEach(function(row){
//       con.query('select p.*,p.cat_id as post_cat_id,u.*,COALESCE(c1.cat_name,"") as post_cat_name ,concat("'+base_url+'",u.image) as image,c.currency_symbol ,r.* from post_job p JOIN user u on u.user_pub_id=p.user_pub_id JOIN currency_setting c Left JOIN categories c1 on p.cat_id=c1.id JOIN booking_invoice1 b JOIN rating r on b.invoice_id=r.invoice_id  where p.job_id="'+row.job_id+'" and b.job_id="'+row.job_id+'" and c.status="1"',function(err,resultsWork){
//         if(err){
//           res.send({
//             "status":0,
//             "message":err
//           })
//         }else{

//           var row=JSON.parse(JSON.stringify(resultsWork));

//           result_work.push(row[0]);
//           rows.work=result_work;


//                             c++;
//                 if(c==result1.length){
//                       res.send({
//                 "status": 1,
//                  "message": constant.GET_ARTIST_NEAR,
//                  "data": result1,
//                 "count": result1.length
//               })
//                 }

//         }
//       })
//     })    
//     }else{
//             console.log('sbb');
//                                c++;
//                 if(c==result1.length){
//                       res.send({
//                 "status": 1,
//                  "message": constant.GET_ARTIST_NEAR,
//                  "data": result1,
//                 "count": result1.length
//               })
//                 }

//     }

//   }
// })




//               }
//             })

//           })

//                           }else{
//                             c++;
//                 if(c==result1.length){
//                       res.send({
//                 "status": 1,
//                  "message": constant.GET_ARTIST_NEAR,
//                  "data": result1,
//                 "count": result1.length
//               })
//                 }      
//                           }
//                         }
//                       })                 

//                     }
//                 })

//               }
//             })
//            })


//             }else{
//               cm.responseMessage(constant.Zero,constant.NODATA,res)
//             }
//           }
//          });
//           }else{

//           var result_array=[];
//           var c=0
//          cm.getAllArtist(req.body.user_pub_id,req.body.cat_id,function(err,result1){
//           if(err){
//             cm.responseMessage(constant.Zero,constant.ERR,res)
//           }else{
//             var result1=JSON.parse(JSON.stringify(result1));
//             console.log(result1)
//             if(result1.length>0){

//             var result1=JSON.parse(JSON.stringify(result1));
//                         if(result1.length>0){           
//            result1.forEach(function(rows){
//             con.query('select * from rating where artist_pub_id="'+rows.user_pub_id+'"',function(err,resultRating){
//               if(err){
//                 res.send({
//                   "status":0,
//                   "message":err
//                 })
//               }else{
//                 var resultRating=JSON.parse(JSON.stringify(resultRating));
//                 rows.Rating=resultRating;
//                 con.query('select COALESCE(ROUND(AVG(rating),2),0)as Allrating from rating where artist_pub_id="'+rows.user_pub_id+'"',function(err,resultAllRating){
//                   if(err){
//                     res.send({
//                       "status":0,
//                       "message":err
//                     })
//                   }else{
//                       var resultAllRating=JSON.parse(JSON.stringify(resultAllRating));
//                       rows.Allrating=resultAllRating[0];
//                       var result_service=[];
//                       con.query('select * from service where user_pub_id="'+rows.user_pub_id+'"',function(err,resultService){
//                         if(err){
//                             res.send({
//                               "status":0,
//                               "message":err
//                             })
//                         }else{
//                           if(resultService.length>0){
//                             var resultService=JSON.parse(JSON.stringify(resultService));
//                             var resultLength=resultService.length;
//           // for(var i=0;i<result.length;i++){
//              resultService.forEach(function(row_service){
//             con.query('select concat("'+base_url+'",service_image) as service_image from service_images where service_id="'+row_service.service_id+'"',function(err,resultServiceImage){
//               if(err){
//                 console.log(err);
//               }else{
//                 var resultImage=JSON.parse(JSON.stringify(resultServiceImage));
//                 // console.log(resultImage);
//                 row_service.service_image=resultImage[0];

//                   result_service.push(row_service);

//                  rows.service= result_service;
//               con.query('select * from apply_job where artist_pub_id="'+rows.user_pub_id+'" and status="2"',function(err,resultwork){
//   if(err){
//     res.send({
//       "status":0,
//       "message":err
//     })
//   }else{
//     var result_work=[];

//     var result=JSON.parse(JSON.stringify(resultwork));
//     console.log(result);
//     if(result.length>0){
//     var resultLength2=result.length;
//     resultwork.forEach(function(row){
//       con.query('select p.*,p.cat_id as post_cat_id,u.*,COALESCE(c1.cat_name,"") as post_cat_name ,concat("'+base_url+'",u.image) as image,c.currency_symbol ,r.* from post_job p JOIN user u on u.user_pub_id=p.user_pub_id JOIN currency_setting c Left JOIN categories c1 on p.cat_id=c1.id JOIN booking_invoice1 b JOIN rating r on b.invoice_id=r.invoice_id  where p.job_id="'+row.job_id+'" and b.job_id="'+row.job_id+'" and c.status="1"',function(err,resultsWork){
//         if(err){
//           res.send({
//             "status":0,
//             "message":err
//           })
//         }else{

//           var row=JSON.parse(JSON.stringify(resultsWork));


//           result_work.push(row[0]);
//           rows.work=result_work;
//                             c++;
//                 if(c==result1.length){
//                       res.send({
//                 "status": 1,
//                  "message": constant.GET_ARTIST_NEAR,
//                  "data": result1,
//                 "count": result1.length
//               })
//                 }

//         }
//       })
//     })    
//     }else{
//                                c++;
//                 if(c==result1.length){
//                       res.send({
//                 "status": 1,
//                  "message": constant.GET_ARTIST_NEAR,
//                  "data": result1,
//                 "count": result1.length
//               })
//                 }

//     }

//   }
// })
//               }
//             })

//           })

//                           }else{
//                             c++;
//                 if(c==result1.length){
//                       res.send({
//                 "status": 1,
//                  "message": constant.GET_ARTIST_NEAR,
//                  "data": result1,
//                 "count": result1.length
//               })
//                 }      
//                           }
//                         }
//                       })                 

//                     }
//                 })

//               }
//             })
//            })


//             }else{
//               cm.responseMessage(constant.Zero,constant.NODATA,res)
//             }
//             }else{
//               cm.responseMessage(constant.Zero,constant.NODATA,res)
//             }
//           }
//          });
//         }
//         }else{
//           cm.responseMessage(constant.TWo,constant.ACCOUNT_STATUS,res)
//         }
//       }
//     })
//   }
// })
// getInvoice
}

app.post(constant.GetInvoice, function (req, res) {
  if (!req.body.user_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    if (!req.body.status) {
      cm.GetInvoice1(req.body.user_pub_id, function (err, result) {
        if (err) {
          console.log(err)
        } else {
          var result = JSON.parse(JSON.stringify(result));
          if (result.length > 0) {
            if (err) {
              cm.responseMessage(constant.Zero, constant.NODATA, res)
            } else {
              cm.responseMessagedata(constant.One, constant.GetAllInvoice, result, res)
            }
          }
        }
      })
    }
    else {
      cm.GetInvoice(req.body.user_pub_id, req.body.status, function (err, result) {
        if (err) {
          console.log(err)
          cm.responseMessage(constant.Zero, err, res)
        } else {
          var result = JSON.parse(JSON.stringify(result))
          if (result.length > 0) {
            if (err) {
              console.log(err)
            } else {
              cm.responseMessagedata(constant.One, constant.GetAllInvoice, result, res)
            }

          } else {
            cm.responseMessage(constant.Zero, constant.NODATA, res)
          }
        }
      })
    }
  }
})
//Done Job

app.post('/getJobDone', function (req, res) {
  if (!req.body.user_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    cm.getTotalDoneJob(req.body.user_pub_id, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        var result = JSON.parse(JSON.stringify(result));
        if (result.length > 0){
          res.send({
            "status": 1,
            "message": constant.jobDone,
            "data": result,
          })
        } else {
          cm.responseMessage(constant.Zero, constant.NODATA, res)
        }

      }
    })
  }
})

//total Earn
app.post('/getTotalEarneds', function (req, res) {
  if (!req.body.user_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res)
  } else {
    cm.getTotalEarn(req.body.user_pub_id, function (err, result) {
      if (err) {
        console.log(err)
      } else {

        var result = JSON.parse(JSON.stringify(result));
        if (result.length > 0) {
          res.send({
            "status": 1,
            "message": constant.jobDone,
            "data": result,

          })

        } else {
          cm.responseMessage(constant.Zero, constant.NODATA, res)
        }

      }
    })
  }
})

//Paid Invoice
app.post('/sasasasasasasas', function (req, res) {
  // if (!req.body.user_pub_id || !req.body.invoice_id) {
  //   res.send({
  //     "status": 0,
  //     "message": constant.chkfield
  //   })
  // } else {
  //   if (!req.body.coupon_id) {
  //     con.query('select * from booking_invoice1 where user_pub_id="' + req.body.user_pub_id + '" and invoice_id="' + req.body.invoice_id + '"', function (err, resultBooking) {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         var resultBooking = JSON.parse(JSON.stringify(resultBooking));
  //         var booking_amount = resultBooking[0].final_amount;
  //         var job_id = resultBooking[0].job_id
  //         var artist_pub_id = resultBooking[0].artist_pub_id;
  //         cm.fannanConverter(booking_amount, "amount").then(function (final_point) {
  //           cm.getMyPoints(req.body.user_pub_id).then(function (data) {
  //             if (data) {
  //               var user_point = data.point;
  //               if (final_point <= user_point) {
  //                 var type = "minus";
  //                 cm.manageUserPoint(req.body.user_pub_id, user_point, final_point, type).then(function (data1) {
  //                   if (data1) {
  //                     var artist_pub_id = resultBooking[0].artist_pub_id;
  //                     req.body.created_at = (new Date()).valueOf().toString();
  //                     cm.addTransactionHistory(req.body.user_pub_id, final_point, "0", req.body.invoice_id, artist_pub_id, req.body.created_at).then(function (data1) {
  //                       cm.getMyPoints(artist_pub_id).then(function (data) {
  //                         if (data) {
  //                           var user_point = data.point;
  //                           var type = "add";
  //                           cm.manageUserPoint(artist_pub_id, user_point, final_point, type).then(function (data1) {
  //                             if (data1) {
  //                               cm.addTransactionHistory(artist_pub_id, final_point, "1", req.body.invoice_id, req.body.user_pub_id, req.body.created_at).then(function (data1) {
  //                                 con.query('update booking_invoice1 set status="1" where invoice_id="' + req.body.invoice_id + '"', function (err, result) {
  //                                   if (err) {
  //                                     console.log(err)
  //                                   } else {
  //                                     con.query('select * from user where user_pub_id="' + artist_pub_id + '"', function (err, resultUser) {
  //                                       if (err) {
  //                                         cm.responseMessage(constant.Zero, err, res);
  //                                       } else {
  //                                         var resultUser = JSON.parse(JSON.stringify(resultUser));
  //                                         var email = resultUser[0].email;
  //                                         var name = resultUser[0].name;
  //                                         var device_token = resultUser[0].device_token;
  //                                         var msg = constant.HELLO + '<br><br/>' + name + ' ' + constant.Invoice_created + constant.SIGNATURE;
  //                                         cm.sendmail(email, constant.Invoice_created, msg)
  //                                         var title = constant.Invoice_created;
  //                                         var type = constant.invoice_type;
  //                                         var msg1 = constant.Invoice_created;
  //                                         var parData = {
  //                                           user_pub_id: artist_pub_id,
  //                                           title: title,
  //                                           type: type,
  //                                           msg: msg1,
  //                                           created_at: (new Date()).valueOf().toString()
  //                                         }
  //                                         cm.insert('notification', parData, function (err, result) {
  //                                           if (err) {
  //                                             cm.responseMessage(constant.Zero, err, res);
  //                                           } else {
  //                                             fn.pushnotification(title, msg1, device_token, type);
  //                                             // cm.responseMessage(constant.One,constant.JOB_REJECTED,res);
  //                                             cm.responseMessage(constant.One, constant.makeMoney, res);
  //                                           }
  //                                         })
  //                                       }
  //                                     })
  //                                   }
  //                                 })
  //                               }).then(function (err) {
  //                                 console.log('addTransaction1')
  //                               })
  //                             }
  //                           }).then(function (err) {
  //                             console.log('erwwwr');
  //                           })
  //                         }
  //                       }).then(function (err) {
  //                         console.log('err');
  //                       });
  //                     }).then(function (err) {
  //                       console.log('addtransaction')
  //                     })
  //                   }
  //                 }).then(function (err) {
  //                   console.log('erwwwr');
  //                 })
  //               } else {
  //                 cm.responseMessage(constant.Zero, constant.insufficient, res);
  //               }
  //             }
  //           }).then(function (err) {
  //             console.log('err');
  //           });
  //         })
  //       }
  //     })
  //   } else {
  //     con.query('select * from booking_invoice1 where user_pub_id="' + req.body.user_pub_id + '" and invoice_id="' + req.body.invoice_id + '"', function (err, resultBooking) {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         var resultBooking = JSON.parse(JSON.stringify(resultBooking));
  //         // cm.checkCoupon(req.body.coupon_code,req.body.user_pub_id).then(function(coupon_id){
  //         //   if(coupon_id==0){
  //         //     cm.responseMessage(constant.Zero,constant.alreadyCouponUsed,res);
  //         //   }else{
  //         //     req.body.coupon_id=coupon_id;
  //         var booking_amount = resultBooking[0].final_amount;
  //         var job_id = resultBooking[0].job_id;
  //         var artist_pub_id = resultBooking[0].artist_pub_id;
  //         cm.couponCalculation(req.body.coupon_id, booking_amount).then(function (data) {
  //           var booking_amount = data.net_amount;
  //           var booking_amount = Math.round(booking_amount)

  //           cm.fannanConverter(booking_amount, "amount").then(function (final_point) {
  //             cm.getMyPoints(req.body.user_pub_id).then(function (data) {
  //               if (data) {
  //                 var user_point = data.point;
  //                 if (final_point <= user_point) {
  //                   var type = "minus";
  //                   cm.manageUserPoint(req.body.user_pub_id, user_point, final_point, type).then(function (data1) {
  //                     if (data1) {
  //                       var artist_pub_id = resultBooking[0].artist_pub_id;
  //                       req.body.created_at = (new Date()).valueOf().toString();
  //                       cm.addTransactionHistory(req.body.user_pub_id, final_point, "0", req.body.invoice_id, artist_pub_id, req.body.created_at).then(function (data1) {
  //                         cm.getMyPoints(artist_pub_id).then(function (data) {
  //                           if (data) {
  //                             var user_point = data.point;
  //                             var type = "add";
  //                             cm.manageUserPoint(artist_pub_id, user_point, final_point, type).then(function (data1) {
  //                               if (data1) {
  //                                 cm.addTransactionHistory(artist_pub_id, final_point, "1", req.body.invoice_id, req.body.user_pub_id, req.body.created_at).then(function (data1) {
  //                                   con.query('update booking_invoice1 set status="1",net_amount="' + booking_amount + '",coupon_id="' + req.body.coupon_id + '" where invoice_id="' + req.body.invoice_id + '"', function (err, result) {
  //                                     if (err) {
  //                                       console.log(err)
  //                                     } else {
  //                                       con.query('select * from coupon where id="' + req.body.coupon_id + '"', function (err, resultCoupon) {
  //                                         if (err) {
  //                                           console.log(err);
  //                                         } else {
  //                                           var resultCoupon = JSON.parse(JSON.stringify(resultCoupon));
  //                                           var counter = resultCoupon[0].counter;
  //                                           var final_counter = counter - 1;
  //                                           if (final_counter > 0) {
  //                                             con.query('update coupon set counter="' + final_counter + '" where id="' + req.body.coupon_id + '"', function (err, result) {
  //                                               if (err) {
  //                                                 console.log(err);
  //                                               } else {
  //                                                 con.query('insert into user_coupon set user_pub_id="' + req.body.user_pub_id + '",invoice_id="' + req.body.invoice_id + '",coupon_id="' + req.body.coupon_id + '" ', function (err, result) {
  //                                                   if (err) {
  //                                                     cm.responseMessage(constant.Zero, err, res);
  //                                                   } else {
  //                                                     con.query('select * from user where user_pub_id="' + artist_pub_id + '"', function (err, resultUser) {
  //                                                       if (err) {
  //                                                         cm.responseMessage(constant.Zero, err, res);
  //                                                       } else {
  //                                                         var resultUser = JSON.parse(JSON.stringify(resultUser));
  //                                                         var email = resultUser[0].email;
  //                                                         var name = resultUser[0].name;
  //                                                         var device_token = resultUser[0].device_token;
  //                                                         var msg = constant.HELLO + '<br><br/>' + name + ' ' + constant.Invoice_created + constant.SIGNATURE;
  //                                                         cm.sendmail(email, constant.Invoice_created, msg)
  //                                                         var title = constant.Invoice_created;
  //                                                         var type = constant.invoice_type;
  //                                                         var msg1 = constant.Invoice_created;
  //                                                         var parData = {
  //                                                           user_pub_id: artist_pub_id,
  //                                                           title: title,
  //                                                           type: type,
  //                                                           msg: msg1,
  //                                                           created_at: (new Date()).valueOf().toString()
  //                                                         }
  //                                                         cm.insert('notification', parData, function (err, result) {
  //                                                           if (err) {
  //                                                             cm.responseMessage(constant.Zero, err, res);
  //                                                           } else {
  //                                                             fn.pushnotification(title, msg1, device_token, type);
  //                                                             // cm.responseMessage(constant.One,constant.JOB_REJECTED,res);
  //                                                             cm.responseMessage(constant.One, constant.makeMoney, res);
  //                                                           }
  //                                                         })
  //                                                       }
  //                                                     })

  //                                                   }
  //                                                 })
  //                                               }
  //                                             })
  //                                           } else {
  //                                             con.query('update coupon set status="3",counter="' + final_counter + '" where id="' + req.body.coupon_id + '"', function (err, result) {
  //                                               if (err) {
  //                                                 console.log(err);
  //                                               } else {
  //                                                 con.query('insert into user_coupon set user_pub_id="' + req.body.user_pub_id + '",invoice_id="' + req.body.invoice_id + '",coupon_id="' + req.body.coupon_id + '" ', function (err, result) {
  //                                                   if (err) {
  //                                                     cm.responseMessage(constant.Zero, err, res);
  //                                                   } else {
  //                                                     con.query('select * from user where user_pub_id="' + artist_pub_id + '"', function (err, resultUser) {
  //                                                       if (err) {
  //                                                         cm.responseMessage(constant.Zero, err, res);
  //                                                       } else {
  //                                                         var resultUser = JSON.parse(JSON.stringify(resultUser));
  //                                                         var email = resultUser[0].email;
  //                                                         var name = resultUser[0].name;
  //                                                         var device_token = resultUser[0].device_token;
  //                                                         var msg = constant.HELLO + '<br><br/>' + name + ' ' + constant.Invoice_created + constant.SIGNATURE;
  //                                                         cm.sendmail(email, constant.Invoice_created, msg)
  //                                                         var title = constant.Invoice_created;
  //                                                         var type = constant.invoice_type;
  //                                                         var msg1 = constant.Invoice_created;
  //                                                         var parData = {
  //                                                           user_pub_id: artist_pub_id,
  //                                                           title: title,
  //                                                           type: type,
  //                                                           msg: msg1,
  //                                                           created_at: (new Date()).valueOf().toString()
  //                                                         }
  //                                                         cm.insert('notification', parData, function (err, result) {
  //                                                           if (err) {
  //                                                             cm.responseMessage(constant.Zero, err, res);
  //                                                           } else {
  //                                                             fn.pushnotification(title, msg1, device_token, type);
  //                                                             // cm.responseMessage(constant.One,constant.JOB_REJECTED,res);
  //                                                             cm.responseMessage(constant.One, constant.makeMoney, res);
  //                                                           }
  //                                                         })
  //                                                       }
  //                                                     })

  //                                                   }
  //                                                 })
  //                                               }
  //                                             })
  //                                           }
  //                                         }
  //                                       })
  //                                     }
  //                                   })
  //                                 }).then(function (err) {
  //                                   console.log('addTransaction1')
  //                                 })

  //                               }
  //                             }).then(function (err) {
  //                               console.log('erwwwr');
  //                             })
  //                           }
  //                         }).then(function (err) {
  //                           console.log('err');
  //                         });
  //                       }).then(function (err) {
  //                         console.log('addtransaction')
  //                       })
  //                     }
  //                   }).then(function (err) {
  //                     console.log('erwwwr');
  //                   })
  //                 } else {
  //                   cm.responseMessage(constant.Zero, constant.insufficient, res);
  //                 }

  //               }
  //             }).then(function (err) {
  //               console.log('err');
  //             });
  //           })
  //         }).catch(function (err) {
  //           cm.responseMessage(constant.Zero, err, res);
  //         })
  //         //   }
  //         // }).then(function(err){
  //         //   console.log("err");
  //         // })
  //       }
  //     })
  //   }
  //   // 	}
  //   // })
  // }
})

app.post('/makePayment', function (req, res) {
  if (!req.body.user_pub_id || !req.body.invoice_id || !req.body.payment_type) {
    res.send({
      "status": 0,
      "message": constant.chkfield
    })
  } else {
    con.query('select * from booking_invoice1 where invoice_id="' + req.body.invoice_id + '"', function (err, resultBooking) {
      if (err) {
        console.log(err)
      } else {
        if(resultBooking == null || resultBooking == '' || resultBooking == undefined || resultBooking == []){
          cm.responseMessage(constant.Zero, constant.invoice_not_found, res);
        }else{
          console.log('resultBooking',resultBooking[0].final_amount);
          if(req.body.coupon_code == null || req.body.coupon_code == '' || req.body.coupon_code == undefined)req.body.coupon_code = 0
          if(req.body.tax == null || req.body.tax == '' || req.body.tax == undefined)req.body.tax = 0
          con.query('select * from coupon where coupon_code="' + req.body.coupon_code + '"', function (err, resultCoupon) {
            var coupon_code, discount_type, discount_fig, discount_amt;
            resultBooking = JSON.parse(JSON.stringify(resultBooking));
            var invoice_id = req.body.invoice_id;
            var booking_amount = resultBooking[0].final_amount;
            var job_id = resultBooking[0].job_id
            var artist_pub_id = resultBooking[0].artist_pub_id;
            var user_pub_id = req.body.user_pub_id;
            var invoice_currency = resultBooking[0].currency_id;
            var payment_type = req.body.payment_type;
            var created_at = (new Date()).valueOf().toString();
            var updated_at = (new Date()).valueOf().toString();
            var tax = req.body.tax;
            if(resultCoupon == null || resultCoupon == '' || resultCoupon == undefined || resultCoupon == [] || req.body.coupon_code == null || req.body.coupon_code == '' || req.body.coupon_code == undefined){
              coupon_code = '';
              discount_type = 0;
              discount_fig = 0;
              discount_amt = 0;
            }else{
              coupon_code = req.body.coupon_code;
              discount_type = resultCoupon[0].discount_type;
              discount_fig = resultCoupon[0].discount;
              if(discount_type == 1){
                var dis_amt = booking_amount*discount_fig/100
                discount_amt = dis_amt;
              }
              if(discount_type == 2)discount_amt = discount_fig;
              booking_amount = parseFloat(booking_amount) - parseFloat(discount_amt);
            }
            con.query('select * from user where user_pub_id="' + artist_pub_id + '"', function (err, resultUser) {
              if(resultUser == null || resultUser == '' || resultUser == undefined || resultUser == []){
                cm.responseMessage(constant.Zero, constant.error_in_artist_data_found, res);
              }else{
                con.query('select * from user_current_balance where user_pub_id="' + artist_pub_id + '" AND currency_id="'+invoice_currency+'"', function (err, resultUserCurrentBal) {
                  if(err){
                    cm.responseMessage(constant.Zero, err, res);
                  }else{
                    console.log('booking_amount',booking_amount,'coupon_code',coupon_code,'discount_type',discount_type,'discount_fig',discount_fig);
                    console.log('discount_amt',discount_amt,'tax',tax,'invoice_id',invoice_id);
                    resultUser = JSON.parse(JSON.stringify(resultUser));
                    var sqlBookInvoice = "UPDATE booking_invoice1 SET status=?,final_amount=?,coupon_code=?,discount_type=?,discount_fig=?,discount_amt=?,tax=? WHERE invoice_id=?";
                    con.query(sqlBookInvoice, ['1', booking_amount, coupon_code, discount_type, discount_fig, discount_amt, tax, invoice_id], function (err) {
                      if (err) {
                        cm.responseMessage(constant.Zero, err, res);
                      } else {
                        var user_old_balance = 0;
                        console.log('resultUserCurrentBal',resultUserCurrentBal);
                        if(resultUserCurrentBal == '' || resultUserCurrentBal == null || resultUserCurrentBal == undefined || resultUserCurrentBal == [])user_old_balance=0;
                        else user_old_balance = resultUserCurrentBal[0].user_current_balance;
                        var Obj = {};
                        Obj.invoice_id = invoice_id;
                        Obj.job_id = job_id;
                        Obj.user_pub_id = user_pub_id;
                        Obj.artist_pub_id = artist_pub_id;
                        Obj.currency_id = invoice_currency;
                        Obj.invoice_amt = booking_amount;
                        Obj.comm_rate = resultUser[0].commission;
                        if(resultUser[0].commission == 0)Obj.comm_amt = 0;
                        else Obj.comm_amt = parseFloat(resultUser[0].commission)*booking_amount/100;
                        Obj.final_amt = parseFloat(booking_amount)-parseFloat(Obj.comm_amt);
                        Obj.old_balance = user_old_balance;

                        if(payment_type == 0)Obj.new_balance = parseFloat(user_old_balance)+parseFloat(Obj.final_amt);
                        if(payment_type == 1)Obj.new_balance = parseFloat(user_old_balance)-parseFloat(Obj.comm_amt);

                        Obj.payment_type = payment_type;
                        if(payment_type == 0)Obj.statement_type = 0;
                        if(payment_type == 1)Obj.statement_type = 1;
                        Obj.created_at = (new Date()).valueOf().toString()
                        console.log('Obj.comm_amt',Obj.comm_amt,'Obj.comm_rate ',Obj.comm_rate );
                        con.query('insert into user_balance set ?', [Obj], function (err) {
                          if (err) {
                            cm.responseMessage(constant.Zero, err, res);
                          } else {
                            var ObjUserCurrenctBal = {};
                            ObjUserCurrenctBal.user_pub_id = artist_pub_id;
                            ObjUserCurrenctBal.currency_id = invoice_currency;
                            ObjUserCurrenctBal.user_current_balance = Obj.new_balance;
                            ObjUserCurrenctBal.created_at = (new Date()).valueOf().toString();
                            var user_current_balance_qry = '';
                            if(resultUserCurrentBal == '' || resultUserCurrentBal == null || resultUserCurrentBal == undefined || resultUserCurrentBal == []){
                              // user_current_balance_qry = 'insert into user_balance set ?', [Obj]
                              user_current_balance_qry = 'INSERT INTO user_current_balance (user_pub_id, currency_id, user_current_balance, created_at) VALUES ("'+artist_pub_id+'", '+invoice_currency+', '+Obj.new_balance+', '+ObjUserCurrenctBal.created_at+')'
                            }else{
                              user_current_balance_qry = 'update user_current_balance set user_current_balance="'+Obj.new_balance+'", updated_at="'+(new Date()).valueOf().toString()+'" where user_pub_id="' + artist_pub_id + '" AND currency_id = "'+invoice_currency+'"';
                            }
                            con.query(user_current_balance_qry, function (err) {
                              if (err) {
                                cm.responseMessage(constant.Zero, err, res);
                              } else {
                                resultUser = JSON.parse(JSON.stringify(resultUser));
                                var email = resultUser[0].email;
                                var name = resultUser[0].name;
                                var device_token = resultUser[0].device_token;
                                var msg = constant.HELLO + '<br><br/>' + name + ' ' + constant.Invoice_created + constant.SIGNATURE;
                                cm.sendmail(email, constant.Invoice_created, msg)
                                var title = constant.Invoice_created;
                                var type = constant.invoice_type;
                                var msg1 = constant.Invoice_created;
                                var parData = {
                                  user_pub_id: artist_pub_id,
                                  title: title,
                                  type: type,
                                  msg: msg1,
                                  created_at: (new Date()).valueOf().toString()
                                }
                                cm.insert('notification', parData, function (err, result) {
                                  if (err) {
                                    cm.responseMessage(constant.Zero, err, res);
                                  } else {
                                    fn.pushnotification(title, msg1, device_token, type);
                                    // cm.responseMessage(constant.One,constant.JOB_REJECTED,res);
                                    cm.responseMessage(constant.One, constant.makeMoney, res);
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            });
          })
        }
      }
    })
  }
})

app.post('/checkCouponCode', function (req, res) {
  if (!req.body.coupon_code || !req.body.invoice_id || !req.body.user_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkfield, res);
  } else {
    con.query('select * from booking_invoice1 where user_pub_id="' + req.body.user_pub_id + '" and invoice_id="' + req.body.invoice_id + '"', function (err, resultBooking) {
      if (err) {
        console.log(err)
      } else {
        result = [];
        var resultBooking = JSON.parse(JSON.stringify(resultBooking));
        cm.checkCoupon(req.body.coupon_code, req.body.user_pub_id).then(function (coupon_id) {
          if (coupon_id == 0) {
            cm.responseMessage(constant.Zero, constant.alreadyCouponUsed, res);
          } else {
            req.body.coupon_id = coupon_id;
            var booking_amount = resultBooking[0].final_amount;
            // var job_id = resultBooking[0].job_id;
            cm.couponCalculation(req.body.coupon_id, booking_amount).then(function (data) {
              res.send({
                "status": 1,
                "message": constant.getAllData,
                "data": data
              })
            }).catch(function (err) {
              cm.responseMessage(constant.Zero, err, res);

            })
          }
        }).catch(function (err) {
          cm.responseMessage(constant.Zero, err, res);

        })
      }
    })
  }
})

app.post('/getProfileById', function (req, res) {
  if (!req.body.user_pub_id){

  } else {
    con.query('select u.*,concat("' + base_url + '",u.image) as image ,GROUP_CONCAT(cat.cat_name) as cat_name,GROUP_CONCAT(cat.id) as cat_id from user u JOIN `multiple_category` AS multcat ON multcat.user_pub_id = u.user_pub_id JOIN `categories` AS cat ON cat.id = multcat.cat_id where u.user_pub_id="' + req.body.user_pub_id + '"', function (err, resultUser) {
      if (err) {
        console.log('1',err);
      } else {
        var resultUser = JSON.parse(JSON.stringify(resultUser));
        con.query('select r.*,concat("' + base_url + '",u.image)as image,u.name from rating r join user u on u.user_pub_id=r.user_pub_id join user u1 on u1.user_pub_id=r.artist_pub_id where r.artist_pub_id="' + req.body.user_pub_id + '" and  u1.is_private="0"', function (err, resultRating) {
          if (err) {
            console.log('2',err)
            cm.responseMessage(constant.Zero, err, res);
          } else {
            var resultRating = JSON.parse(JSON.stringify(resultRating));
            console.log('resultRating',resultRating)
            resultUser[0].Rating = resultRating;
            con.query('select COALESCE(ROUND(AVG(rating),2),0) as Allrating from rating join user on rating.user_pub_id=user.user_pub_id join user as user1 on user1.user_pub_id=rating.artist_pub_id where rating.artist_pub_id="' + req.body.user_pub_id + '" and user1.is_private="0"', function (err, resultAllRating) {
              if (err) {
                console.log('3',err)
                cm.responseMessage(constant.Zero, err, res);
              } else {
                var resultAllRating = JSON.parse(JSON.stringify(resultAllRating));
                resultUser[0].Allrating = resultAllRating[0];
                var result_service = [];
                var count_service = 0;
                con.query('select s.* from service s join user u on s.user_pub_id=u.user_pub_id where s.user_pub_id="' + req.body.user_pub_id + '" and u.is_private="0"', function (err, resultService) {
                  if (err) {
                    console.log('4',err)
                    cm.responseMessage(constant.Zero, err, res);
                  } else {
                    if (resultService.length > 0) {
                      var resultService = JSON.parse(JSON.stringify(resultService));
                      var resultLength = resultService.length;
                      // for(var i=0;i<result.length;i++){
                      resultService.forEach(function (row_service) {
                        con.query('select concat("' + base_url + '",service_image) as service_image from service_images where service_id="' + row_service.service_id + '"', function (err, resultServiceImage) {
                          if (err) {
                            console.log('5',err)
                          } else {
                            var resultImage = JSON.parse(JSON.stringify(resultServiceImage));
                            // console.log(resultImage);
                            row_service.service_image = resultImage[0];
                            result_service.push(row_service);
                            resultUser[0].service = result_service;
                            count_service++;
                            if (count_service == resultLength) {
                              con.query('select a.* from apply_job a join user u on u.user_pub_id=a.artist_pub_id where a.artist_pub_id="' + req.body.user_pub_id + '" and a.status="2" and  u.is_private="0"', function (err, resultwork) {
                                if (err) {
                                  console.log('6',err)
                                  cm.responseMessage(constant.Zero, err, res);
                                } else {
                                  var result_work = [];
                                  var c = 0;
                                  var result = JSON.parse(JSON.stringify(resultwork));
                                  if (result.length > 0) {
                                    var resultLength1 = result.length;
                                    // console.log(resultLength2);
                                    resultwork.forEach(function (row) {
                                                // 'select p.*,p.cat_id as post_cat_id,u.*,GROUP_CONCAT(c1.cat_name,"") as post_cat_name ,concat("' + base_url + '",u.image) as image,c.currency_symbol ,r.* from post_job p JOIN user u on u.user_pub_id=p.user_pub_id JOIN currency_setting c Left JOIN categories c1 on FIND_IN_SET(c1.id,p.cat_id) JOIN booking_invoice1 b JOIN rating r on b.invoice_id=r.invoice_id  where p.job_id="' + row.job_id + '" and b.job_id="' + row.job_id + '" and c.status="1" and u.is_private="0"'
                                      con.query('select p.*,p.cat_id as post_cat_id,u.*,GROUP_CONCAT(c1.cat_name,"") as post_cat_name ,concat("' + base_url + '",u.image) as image,c.currency_symbol ,r.* from post_job p JOIN user u on u.user_pub_id=p.user_pub_id JOIN currency_setting c Left JOIN categories c1 on FIND_IN_SET(c1.id,p.cat_id) JOIN booking_invoice1 b JOIN rating r on b.invoice_id=r.invoice_id  where p.job_id="' + row.job_id + '" and b.job_id="' + row.job_id + '" and c.status="1" and u.is_private="0"', function (err, resultsWork) {
                                        if (err) {
                                          console.log('7',err)
                                          cm.responseMessage(constant.Zero, err, res);
                                        } else {
                                          var row = JSON.parse(JSON.stringify(resultsWork));
                                          if (row.length > 0) {
                                            result_work.push(row[0]);
                                          }
                                          resultUser[0].work = result_work;
                                          c++;
                                          if (c == resultLength1) {
                                            con.query('select count(j.job_id) as jobDone  from apply_job j join user u on j.artist_pub_id = u.user_pub_id where j.artist_pub_id="' + req.body.user_pub_id + '" and u.is_private="0" and j.status="2"', function (err, resultJob) {
                                              if (err) {
                                                console.log('8',err)
                                                cm.responseMessage(constant.Zero, err, res);
                                              } else {
                                                var resultJob = JSON.parse(JSON.stringify(resultJob))
                                                resultUser[0].jobDone = resultJob[0];
                                                con.query('select COALESCE(sum(p.price),0.0) as totalEarned from post_job p join apply_job a on a.job_id=p.job_id join user u on u.user_pub_id=a.artist_pub_id where a.artist_pub_id="' + req.body.user_pub_id + '" and u.is_private="0"  ', function (err, resultEarned) {
                                                  if (err) {
                                                    console.log('9',err)
                                                    cm.responseMessage(constant.Zero, err, res);
                                                  } else {
                                                    var resultEarned = JSON.parse(JSON.stringify(resultEarned));
                                                    resultUser[0].earnedMoney = resultEarned[0]
                                                    con.query('select *,concat("' + base_url + '",image) as image from gallery where user_pub_id="' + req.body.user_pub_id + '"', function (err, resultGallery) {
                                                      if (err) {
                                                        console.log('10',err)
                                                        cm.responseMessage(constant.Zero, err, res)
                                                      } else {
                                                        var resultGallery = JSON.parse(JSON.stringify(resultGallery));
                                                        resultUser[0].gallery = resultGallery;
                                                        res.send({
                                                          "status": 1,
                                                          "message": constant.GET_ARTIST_NEAR,
                                                          "data": resultUser[0]
                                                        })
                                                      }
                                                    })
                                                  }
                                                })
                                              }
                                            })
                                          }
                                        }
                                      })
                                    })
                                  } else {
                                    con.query('select count(j.job_id) as jobDone from apply_job j join user u on u.user_pub_id=j.artist_pub_id where j.artist_pub_id="' + req.body.user_pub_id + '" and u.is_private="0" and j.status="2"', function (err, resultJob) {
                                      if (err) {
                                        console.log('11',err)
                                        cm.responseMessage(constant.Zero, err, res);
                                      } else {
                                        var resultJob = JSON.parse(JSON.stringify(resultJob))
                                        resultUser[0].jobDone = resultJob[0];
                                        con.query('select COALESCE(sum(p.price),0.0) as totalEarned from post_job p join apply_job a on a.job_id=p.job_id join user u on u.user_pub_id=a.artist_pub_id where a.artist_pub_id="' + req.body.user_pub_id + '" and u.is_private="0"', function (err, resultEarned) {
                                          if (err) {
                                            console.log('12',err)
                                            cm.responseMessage(constant.Zero, err, res);
                                          } else {
                                            var resultEarned = JSON.parse(JSON.stringify(resultEarned));
                                            resultUser[0].earnedMoney = resultEarned[0]
                                            con.query('select *,concat("' + base_url + '",image) as image from gallery where user_pub_id="' + req.body.user_pub_id + '"', function (err, resultGallery) {
                                              if (err) {
                                                console.log('13',err)
                                                cm.responseMessage(constant.Zero, err, res)
                                              } else {
                                                var resultGallery = JSON.parse(JSON.stringify(resultGallery));
                                                resultUser[0].gallery = resultGallery;
                                                res.send({
                                                  "status": 1,
                                                  "message": constant.GET_ARTIST_NEAR,
                                                  "data": resultUser[0]
                                                })
                                              }
                                            })
                                          }
                                        })
                                      }
                                    })
                                  }
                                }
                              })
                            }
                          }
                        })
                      })
                    } else {

                      con.query('select j.* from apply_job j join user u on u.user_pub_id=j.artist_pub_id where j.artist_pub_id="' + req.body.user_pub_id + '" and j.status="2" and u.is_private="0"', function (err, resultwork) {
                        if (err) {
                          cm.responseMessage(constant.Zero, err, res);
                        } else {
                          var result_work = [];
                          var c = 0;
                          var result = JSON.parse(JSON.stringify(resultwork));
                          if (result.length > 0) {
                            var resultLength1 = result.length;
                            // console.log(resultLength2);
                            resultwork.forEach(function (row) {
                              con.query('select p.*,p.cat_id as post_cat_id,u.*,GROUP_CONCAT(c1.cat_name,"") as post_cat_name ,concat("' + base_url + '",u.image) as image,c.currency_symbol ,r.* from post_job p JOIN user u on u.user_pub_id=p.user_pub_id JOIN currency_setting c Left JOIN categories c1 on FIND_IN_SET(c1.id,p.cat_id) JOIN booking_invoice1 b JOIN rating r on b.invoice_id=r.invoice_id  where p.job_id="' + row.job_id + '" and b.job_id="' + row.job_id + '" and c.status="1" and u.is_private="0"', function (err, resultsWork) {
                                if (err) {
                                  console.log('14',err)
                                  cm.responseMessage(constant.Zero, err, res);
                                } else {

                                  var row = JSON.parse(JSON.stringify(resultsWork));
                                  if (row.length > 0) {
                                    result_work.push(row[0]);
                                  }
                                  resultUser[0].work = result_work;
                                  c++;
                                  if (c == resultLength1) {
                                    con.query('select count(j.job_id) as jobDone from apply_job j join user u on u.user_pub_id =j.artist_pub_id where j.artist_pub_id="' + req.body.user_pub_id + '" and j.status="2" and u.is_private="0"', function (err, resultJob) {
                                      if (err) {
                                        console.log('15',err)
                                        cm.responseMessage(constant.Zero, err, res);
                                      } else {
                                        var resultJob = JSON.parse(JSON.stringify(resultJob))
                                        resultUser[0].jobDone = resultJob[0];
                                        con.query('select COALESCE(sum(p.price),0.0) as totalEarned from post_job p join apply_job a on a.job_id=p.job_id join user u on u.user_pub_id=a.artist_pub_id where a.artist_pub_id="' + req.body.user_pub_id + '" and u.is_private="0"', function (err, resultEarned) {
                                          if (err) {
                                            console.log('16',err)
                                            cm.responseMessage(constant.Zero, err, res);
                                          } else {
                                            var resultEarned = JSON.parse(JSON.stringify(resultEarned));
                                            resultUser[0].earnedMoney = resultEarned[0]
                                            con.query('select *,concat("' + base_url + '",image) as image from gallery where user_pub_id="' + req.body.user_pub_id + '"', function (err, resultGallery) {
                                              if (err) {
                                                console.log('17',err)
                                                cm.responseMessage(constant.Zero, err, res)
                                              } else {
                                                var resultGallery = JSON.parse(JSON.stringify(resultGallery));
                                                resultUser[0].gallery = resultGallery;
                                                res.send({
                                                  "status": 1,
                                                  "message": constant.GET_ARTIST_NEAR,
                                                  "data": resultUser[0]
                                                })
                                              }
                                            })
                                          }
                                        })
                                      }
                                    })

                                  }

                                }
                              })
                            })
                          } else {
                            con.query('select count(j.job_id) as jobDone from apply_job j join user u on u.user_pub_id=j.artist_pub_id where j.artist_pub_id="' + req.body.user_pub_id + '" and j.status="2" and u.is_private="0"', function (err, resultJob) {
                              if (err) {
                                console.log('18',err)
                                cm.responseMessage(constant.Zero, err, res);
                              } else {
                                var resultJob = JSON.parse(JSON.stringify(resultJob))
                                resultUser[0].jobDone = resultJob[0];
                                con.query('select COALESCE(sum(p.price),0.0) as totalEarned from post_job p join apply_job a on a.job_id=p.job_id join user u on a.artist_pub_id=u.user_pub_id where a.artist_pub_id="' + req.body.user_pub_id + '" and u.is_private="0"', function (err, resultEarned) {
                                  if (err) {
                                    console.log('19',err)
                                    cm.responseMessage(constant.Zero, err, res);
                                  } else {
                                    var resultEarned = JSON.parse(JSON.stringify(resultEarned));
                                    resultUser[0].earnedMoney = resultEarned[0]
                                    con.query('select *,concat("' + base_url + '",image) as image from gallery where user_pub_id="' + req.body.user_pub_id + '"', function (err, resultGallery) {
                                      if (err) {
                                        console.log('20',err)
                                        cm.responseMessage(constant.Zero, err, res)
                                      } else {
                                        var resultGallery = JSON.parse(JSON.stringify(resultGallery));
                                        resultUser[0].gallery = resultGallery;
                                        res.send({
                                          "status": 1,
                                          "message": constant.GET_ARTIST_NEAR,
                                          "data": resultUser[0]
                                        })
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})

app.post('/rejectJobByArtist', function (req, res) {
  // con.query('select ')
  if (!req.body.job_id || !req.body.user_pub_id) {
    cm.responseMessage(constant.Zero, constant.chkField, res);
  }
  else {
    con.query('update post_job set status="0" where job_id ="' + req.body.job_id + '"', function (err, result) {
      if (err) {
        cm.responseMessage(constant.Zero, err, res);
      } else {
        con.query('update apply_job set status="3" where job_id="' + req.body.job_id + '" and artist_pub_id="' + req.body.user_pub_id + '"', function (err, result) {
          if (err) {
            cm.responseMessage(constant.Zero, err, res);
          } else {
            con.query('update apply_job set status="0" where job_id="' + req.body.job_id + '" and artist_pub_id!="' + req.body.user_pub_id + '"', function (err, result) {
              if (err) {
                cm.responseMessage(constant.Zero, err, res);
              } else {
                con.query('select * from post_job where job_id="' + req.body.job_id + '"', function (err, resultPost) {
                  if (err) {
                    cm.responseMessage(constant.Zero, err, res)
                  } else {
                    var resultPost = JSON.parse(JSON.stringify(resultPost));
                    var user_pub_id = resultPost[0].user_pub_id;
                    con.query('select * from user where user_pub_id="' + user_pub_id + '"', function (err, resultUser) {
                      if (err) {
                        cm.responseMessage(constant.Zero, err, res)
                      } else {
                        var resultUser = JSON.parse(JSON.stringify(resultUser));
                        var device_token = resultUser[0].device_token;
                        var title = constant.Reject_title;
                        var type = constant.reject_job_type;
                        var msg1 = constant.Job_reject_msg_artist;
                        var parData = {
                          user_pub_id: user_pub_id,
                          title: title,
                          type: type,
                          msg: msg1,
                          created_at: (new Date()).valueOf().toString()
                        }
                        cm.insert('notification', parData, function (err, result) {
                          if (err) {
                            cm.responseMessage(constant.Zero, err, res);
                          } else {
                            fn.pushnotification(title, msg1, device_token, type);
                            // cm.responseMessage(constant.One,constant.JOB_REJECTED,res);
                          }
                        })

                      }
                    })
                  }
                })
                cm.responseMessage(constant.One, constant.Reject_job, res)
              }
            })
          }
        })
      }

    }
    )
  }
})

app.post('/getPayout', function (req, res) {
  if (!req.body.user_pub_id) {
    res.send({
      "status": 0,
      "message": constant.chkfield
    })
  }else{
    con.query('select cs.currency_symbol,cs.currency_name,uc.* from user_current_balance uc join currency_setting cs on cs.id=uc.currency_id where uc.user_pub_id="' + req.body.user_pub_id + '"', function (err, resultUserCurrentBal) {
      if(err){
        cm.responseMessage(constant.Zero, err, res);
      }else{
        if(resultUserCurrentBal == null || resultUserCurrentBal == '' || resultUserCurrentBal == undefined || resultUserCurrentBal == []){
          cm.responseMessage(constant.Zero, constant.null_data, res);
        }else{
          var resultLength = resultUserCurrentBal.length;
          var counter = 0;
          var result_array = [];
          resultUserCurrentBal.forEach(function (result) {
            con.query('select cs.currency_symbol,cs.currency_name, po.* from payout po join currency_setting cs on cs.id=po.currency_id where po.user_pub_id="' + req.body.user_pub_id + '" AND currency_id="'+result.currency_id+'"', function (err, resultPayout) {
              if(resultPayout == null || resultPayout == '' || resultPayout == undefined || resultPayout == [])resultPayout = [];
              //   cm.responseMessage(constant.Zero, constant.null_data, res);
              // }else{
                resultPayout = JSON.parse(JSON.stringify(resultPayout));
                result.payout_history = resultPayout;
                result_array.push(result);
                counter++;
                if(counter == resultLength) {
                  cm.responseMessagedata(constant.One, constant.success, result_array, res)
                  console.log("counter" + counter);
                }
                  // res.send({
                  //   "status": 1,
                  //   "message": constant.success,
                  //   "data": resultPayout,
                  // })
              // }
            });
          })
        }
      }
    })
  }
})

app.post('/getLanguage', function (req, res) {
  // console.log('req.headers.language in api',req.headers.language);
  con.query('select * from language where status="1"', function (err, resultLanguage) {
    if(resultLanguage == null || resultLanguage == '' || resultLanguage == undefined || resultLanguage == []){
      cm.responseMessage(constant.Zero, constant.null_data, res);
    }else{
      resultLanguage = JSON.parse(JSON.stringify(resultLanguage));
      res.send({
        "status": 1,
        "message": constant.success,
        "data": resultLanguage
      })
    }
  });
})

app.post('/getCurrency', function (req, res) {
  // console.log('req.headers.language in api',req.headers.language);
  con.query('select * from currency_setting where status="1"', function (err, resultCurrency) {
    if(resultCurrency == null || resultCurrency == '' || resultCurrency == undefined || resultCurrency == []){
      cm.responseMessage(constant.Zero, constant.null_data, res);
    }else{
      resultCurrency = JSON.parse(JSON.stringify(resultCurrency));
      res.send({
        "status": 1,
        "message": constant.success,
        "data": resultCurrency
      })
    }
  });
})

app.post('/getPaymentGateway', function (req, res) {
  // console.log('req.headers.language in api',req.headers.language);
  console.log('req.body.currency_id',req.body.currency_id);
  if(req.body.currency_id){
    con.query('select pg.* from payment_gateway as pg WHERE (FIND_IN_SET("'+req.body.currency_id+'", pg.currency))', function (err, result) {
      console.log('err',err);
      // console.log('result',result);
      if(result == null || result == '' || result == undefined || result == []){
        cm.responseMessage(constant.Zero, constant.null_data, res);
      }else{
        result = JSON.parse(JSON.stringify(result));
        res.send({
          "status": 1,
          "message": constant.success,
          "data": result
        })
      }
    });
  }else{
    res.send({
      "status": 0,
      "message": constant.chkfield,
    })
  }
})

app.post('/getBalanceHistroy', function (req, res) {
  if (!req.body.user_pub_id) {
    res.send({
      "status": 0,
      "message": constant.chkfield
    })
  }else{
    con.query('select us.name,us.email_id,cs.currency_symbol,cs.currency_name, ub.* from user_balance ub join currency_setting cs on cs.id=ub.currency_id join user us on us.user_pub_id=ub.user_pub_id where ub.artist_pub_id="' + req.body.user_pub_id + '"', function (err, resultBalanceHistroy) {
      if(resultBalanceHistroy == null || resultBalanceHistroy == '' || resultBalanceHistroy == undefined || resultBalanceHistroy == []){
        cm.responseMessage(constant.Zero, constant.null_data, res);
      }else{
        resultBalanceHistroy = JSON.parse(JSON.stringify(resultBalanceHistroy));
        con.query('select cs.currency_symbol,cs.currency_name,uc.* from user_current_balance uc join currency_setting cs on cs.id=uc.currency_id where uc.user_pub_id="' + req.body.user_pub_id + '"', function (err, resultUserCurrentBal) {
          if(resultUserCurrentBal == null || resultUserCurrentBal == '' || resultUserCurrentBal == undefined || resultUserCurrentBal == [])resultUserCurrentBal = [];
          res.send({
            "status": 1,
            "message": constant.success,
            "data": resultBalanceHistroy,
            "UserBalance":resultUserCurrentBal
          })
        })
      }
    });
  }
})

module.exports = app