// https://vikas2221@bitbucket.org/amit_ujj/kevin_backend.git // cZNwpwFCfSZwJUnKPw7w
var express = require('express');
var app = express();
var router = express.Router();
var db = require('../config/database');
var constant = require('../constant/constant');
var firebase = require('../firebase/firebase');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var flash = require('express-flash');
var session = require('express-session');
var multer = require('multer');
var dateFormat = require('dateformat');
var moment = require('moment');

var uniqid=require('uniqid');
// var uniqid
router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
router.use(flash());
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, '../../../../../../var/www/html/Bakvebul/images')
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});

var upload = multer({ storage: storage });
// Dashboard
// router.get('/', function (req, res) {
//    res.render('Dashboard/dashboard');
// })
router.get('/index', function (req, res) {
  if (req.session.email) {
    var myDate = new Date();
    myDate = (myDate).valueOf().toString();
    var SQL = "SELECT count(user_id) as id FROM user WHERE status='1';"+
    "SELECT count(id) as id FROM categories WHERE status='1';"+
    "SELECT count(id) as id FROM post_job WHERE status='2';"+
    "SELECT sum(amount) as earn FROM subscription_transactions WHERE payment_status='1';"+
    "SELECT currency_symbol FROM currency_setting WHERE status='1';"+
    "SELECT count(user_id) as id FROM user WHERE status='1' AND (sub_end_date IS NOT NULL AND sub_end_date >= '"+myDate+"');"+
    "SELECT count(user_id) as id FROM user WHERE status='1' AND (sub_end_date IS NULL OR sub_end_date < '"+myDate+"') ";
    // "Select t.*,u.* ,concat('" + constant.base_url + "',u.image) as image from transaction_history as t "+
    // "join user u on u.user_pub_id = t.user_id order by t.created_at limit 6 ;"+
    // "select t.*,u.* ,t.description as support_description from ticket t "+
    // "join user u on u.user_pub_id=t.user_pub_id order by t.created_at limit 6";
    db.query(SQL, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        var result_user = JSON.parse(JSON.stringify(result[0]));
        var result_cat = JSON.parse(JSON.stringify(result[1]));
        var result_job = JSON.parse(JSON.stringify(result[2]));
        var result_earn = JSON.parse(JSON.stringify(result[3]));
        var result_currency = JSON.parse(JSON.stringify(result[4]));
        var result_subscribed = JSON.parse(JSON.stringify(result[5]));
        var result_unsubscribed = JSON.parse(JSON.stringify(result[6]));
        // var result_trans = JSON.parse(JSON.stringify(result[4]));
        // var result_ticket = JSON.parse(JSON.stringify(result[5]));
        // console.log(result_trans);
        if(result_earn[0].earn == null || result_earn[0].earn == undefined)result_earn[0].earn = 0;
        res.render('Dashboard/dashboard', { 
          result: result_user, 
          cat: result_cat, 
          job: result_job, 
          earn: result_earn,
          currency: result_currency,
          subscribed: result_subscribed[0].id,
          unsubscribed: result_unsubscribed[0].id
        });
      }
    })
  } else {
    res.redirect('/login')
  }
})

router.post("/adminLogin", function (req, res) {
  var email = req.body.email;
  db.query("SELECT * FROM admin WHERE email=?", [email], function (error, result, fields) {
    if (result.length == 0) {
      req.flash("msg1", "Email is incorrect");
      res.redirect("/login");
    }
    else {
      var result = JSON.parse(JSON.stringify(result[0]));
      if (result.password == req.body.password) {
        req.session.email = result.email;
        req.session.is_user_logged_in = true;
        res.redirect("/index");
      }
      else {
        req.flash("msg2", "Password is incorrect");
        res.redirect("/login");
      }
    }
  });
});

//logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/login');
  });
});

// Calendar
router.get('/calendar', function (req, res) {
  res.render('Calendar/calendar');
})

// Email
router.get('/email-inbox', function (req, res) {
  res.render('Email/email_inbox');
})
router.get('/email-compose', function (req, res) {
  res.render('Email/email_compose');
})
router.get('/email-read', function (req, res) {
  res.render('Email/email_read');
})
router.get('/email-template-Alert', function (req, res) {
  res.render('Email/email_template_Alert');
})
router.get('/email-template-basic', function (req, res) {
  res.render('Email/email_template_basic');
})
router.get('/email-template-Billing', function (req, res) {
  res.render('Email/email_template_Billing');
})

// UI Elements
router.get('/ui-alerts', function (req, res) {
  res.render('UiElements/ui_alerts');
})
router.get('/ui-buttons', function (req, res) {
  res.render('UiElements/ui_buttons');
})
router.get('/ui-cards', function (req, res) {
  res.render('UiElements/ui_cards');
})
router.get('/ui-carousel', function (req, res) {
  res.render('UiElements/ui_carousel');
})
router.get('/ui-dropdowns', function (req, res) {
  res.locals = { title: 'UI Dropdowns' };
  res.render('UiElements/ui_dropdowns');
})
router.get('/ui-grid', function (req, res) {
  res.render('UiElements/ui_grid');
})
router.get('/ui-images', function (req, res) {
  res.render('UiElements/ui_images');
})
router.get('/ui-lightbox', function (req, res) {
  res.render('UiElements/ui_lightbox');
})
router.get('/ui-modals', function (req, res) {

  res.render('UiElements/ui_modals');
})
router.get('/ui-pagination', function (req, res) {
  res.render('UiElements/ui_pagination');
})
router.get('/ui-popover-tooltips', function (req, res) {
  res.render('UiElements/ui_popover_tooltips');
})
router.get('/ui-rangeslider', function (req, res) {
  res.render('UiElements/ui_rangeslider');
})
router.get('/ui-session-timeout', function (req, res) {
  res.locals = { title: 'UI Session Timeout' };
  res.render('UiElements/ui_session_timeout');
})
router.get('/ui-progressbars', function (req, res) {
  res.render('UiElements/ui_progressbars');
})
router.get('/ui-sweet-alert', function (req, res) {
  res.render('UiElements/ui_sweet_alert');
})
router.get('/ui-tabs-accordions', function (req, res) {
  res.render('UiElements/ui_tabs_accordions');
})
router.get('/ui-typography', function (req, res) {
  res.render('UiElements/ui_typography');
})
router.get('/ui-video', function (req, res) {
  res.render('UiElements/ui_video');
})
router.get('/ui-colors', function (req, res) {
  res.render('UiElements/ui_colors');
})
router.get('/ui-general', function (req, res) {
  res.render('UiElements/ui_general');
})
router.get('/ui-rating', function (req, res) {
  res.render('UiElements/ui_rating');
})

// Form Elements
router.get("/edit_user", function (req, res) {
  if (req.session.email) {
    // var id = req.params.user_pub_id;

    db.query("SELECT * FROM user ", function (err, result) {
      if (err) {
        console.log("Finding error", err);
        return;
      }
      result = JSON.parse(JSON.stringify(result[0]));
      res.render("Forms/form_elements", { result: result });
    });
  } else {
    res.redirect("/login");
  }
});

router.get('/form-validation', function (req, res) {
  res.render('Forms/form_validation');
})
router.get('/form-advanced', function (req, res) {
  res.render('Forms/form_advanced');
})
router.get('/form-editors', function (req, res) {
  res.render('Forms/form_editors');
})
router.get('/form-uploads', function (req, res) {
  res.render('Forms/form_uploads');
})
router.get('/form-xeditable', function (req, res) {
  res.render('Forms/form_xeditable');
})
router.get('/form-mask', function (req, res) {
  res.render('Forms/form_mask');
})
router.get('/form-repeater', function (req, res) {
  res.render('Forms/form_repeater');
})
router.get('/form-wizard', function (req, res) {
  res.render('Forms/form_wizard');
})

// Charts
router.get('/charts-morris', function (req, res) {
  res.render('Charts/charts_morris');
})
router.get('/charts-chartist', function (req, res) {
  res.render('Charts/charts_chartist');
})
router.get('/charts-chartjs', function (req, res) {
  res.render('Charts/charts_chartjs');
})
router.get('/charts-flot', function (req, res) {
  res.render('Charts/charts_flot');
})
router.get('/charts-echart', function (req, res) {
  res.render('Charts/charts_echart');
})
router.get('/charts-sparkline', function (req, res) {
  res.render('Charts/charts_sparkline');
})
router.get('/charts-knob', function (req, res) {
  res.render('Charts/charts_knob');
})
router.get('/charts-echart', function (req, res) {
  res.render('Charts/charts_echart');
})

//Home Banner
router.get('/banner', function (req, res) {
  if (req.session.email) {
    db.query("select *,CONCAT('" + constant.base_url + "',image) as image from home_slider  ", function (err, result) {
      db.query("select * from language where status='1'", function (err, language_data) {
        if(language_data == null || language_data == '' || language_data == undefined)language_data=[];
        if (result.length == 0) {
          console.log(err)
          res.render('banner/banner', { result: '',language_data:language_data});
        } else {
          var result_user = JSON.parse(JSON.stringify(result));
          res.render('banner/banner', { result: result_user,language_data:language_data});
        }
      })
    })
  }
  else {
    res.redirect("/login");
  }
})
router.post('/changeBannerStatus', function (req, res) {
  if (req.session.email) {

    db.query("select * from home_slider WHERE id='" + req.body.id + "'", function (err, Cat) {
      if (err) {
        console.log(err);
      } else {
        var Cat = JSON.parse(JSON.stringify(Cat));
        var status = Cat[0].status;
        if (status == '1') {
          db.query('update home_slider set status="2" WHERE id="' + req.body.id + '"', function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log('updated ');
            }
          })
        } else {
          db.query('update  home_slider set status="1" WHERE id="' + req.body.id + '"', function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log('updated ');
            }
          })
        }
      }
    })
  } else {
    res.redirect("/login");
  }
})
router.post("/addbanner", upload.single('image'), function (req, res) {
  if (req.session.email) {

    var today = new Date();
    req.body.image = "Bakvebul/images/" + req.file.filename;
    var data = {
      "language": req.body.language,
      "title": req.body.title,
      "heading": req.body.heading,
      "description": req.body.description,
      "web_url": req.body.web_url,
      "image": req.body.image,
    }
    db.query("INSERT INTO home_slider SET ?", data, function (err, results, fields) {
      if (!err) {
        res.redirect("/banner")
      }
      else {

        res.redirect("/banner");
      }
    });
  } else {
    res.redirect("/login");
  }
});

//Edit Banner
router.post("/updatebanner", upload.single('image'), function (req, res) {
  var sql = "UPDATE home_slider SET language =?,title =?,heading =?,description =?,web_url =? WHERE id = ?";
  var data = [req.body.language,req.body.title,req.body.heading,req.body.description,req.body.web_url, req.body.id];
  if(req.file != undefined){
    sql = "UPDATE home_slider SET language =?,title =?,heading =?,description =?,web_url =?,image=? WHERE id = ?";
    req.body.image = "Bakvebul/images/" + req.file.filename;
    data = [req.body.language,req.body.title,req.body.heading,req.body.description,req.body.web_url, req.body.image, req.body.id];
  }
  var query = db.query(sql, data, function (err, result) {
    if (err) {
      console.log(err);
      res.redirect("/banner");
    }
    else {
      res.redirect("/banner");
    }
  });
})

router.get("/edit_banner/:id", function (req, res) {
  if (req.session.email) {
    var banner_id = req.params.id;
    db.query("SELECT *,concat('" + constant.base_url + "',image) as image FROM home_slider WHERE id=?", [banner_id], function (err, result) {
      if (err) {
        console.log(err);
      }
      db.query("select * from language where status='1'", function (err, language_data) {
        if(language_data == null || language_data == '' || language_data == undefined)language_data=[];
        result = JSON.parse(JSON.stringify(result[0]));
        res.render("banner/edit_banner_test", { result: result,language_data:language_data });
      });
    });
  }
  else {
    res.redirect('/login');
  }
});

router.get("/editbanner", function (req, res) {
  var banner_id = req.body.banner_id;
  db.query("SELECT *,CONCAT('" + constant.base_url + "',image) as image FROM home_slider WHERE id=?", [banner_id], function (err, result) {
    if (err) {
      console.log(err);
    }
    result = JSON.parse(JSON.stringify(result[0]));
    res.render("banner/edit_banner", { result: result });
  });
});


//tables
router.get('/Customer', function (req, res) {
  if (req.session.email) {
    db.query("select u.*,u1.point from user as u join user_point  as u1 on u.user_pub_id = u1.user_id", function (err, result) {
      if (result.length == 0) {
        console.log(err)
        res.render('User/customer', { result: '' });
      } else {
        var result_user = JSON.parse(JSON.stringify(result));
        res.render('User/customer', { result: result_user });
      }
    })
  }
  else {
    res.redirect("/login");
  }
});
router.get('/getCustomerList', function (req, res) {
  if (req.session.email) {
    var skip = req.query.start;
    var limit = req.query.length;
    var val = req.query.search.value;
    console.log('skip',skip, 'limit',limit);
    // where first_name like
    var search = '';
    if(val){
      search = "WHERE (name LIKE CONCAT('%"+val+"%')) OR (email_id LIKE CONCAT('%"+val+"%')) OR (mobile_no LIKE CONCAT('%"+val+"%'))"
    }
    var qry = '';
    if(val){
      qry = "SELECT * FROM user as u join user_point as u1 on u.user_pub_id = u1.user_id "+search+" LIMIT "+limit+" OFFSET "+skip+""
    }else{
      qry = "SELECT * FROM user as u join user_point  as u1 on u.user_pub_id = u1.user_id LIMIT "+limit+" OFFSET "+skip+""
    }
    db.query(qry, function (err, result) {
        if (result.length == 0) {
          console.log(err)
        } else {
          var data = JSON.stringify({
            "draw": req.query.draw,
            "recordsFiltered": result.length,
            "recordsTotal": result.length,
            "data": result
          });
          res.send(data);
        }
    })
  }
  else {
    res.redirect("/login");
  }
});

router.get('/Customer_bank_details/:id', function (req, res) {
  if (req.session.email) {
    var id = req.params.id;
    var result_user ={};
    db.query("select * from bank_details where user_pub_id='"+id+"'", function (err, result) {
      if(result == null || result == '' || result == undefined){
        result_user = {user_pub_id:'',name:'',t_c_id_no:'',handy_phone:'',iban:'',address:''};
      }else{
        result_user = JSON.parse(JSON.stringify(result));
        result_user = result_user[0];
      }
      // console.log('result_user',result_user);
      res.render('User/Customer_bank_details', { result: result_user, tab:'bank_detail', user : id  });
    });
  }
  else {
    res.redirect("/login");
  }
});

router.post('/add_update_bank_details', function(req, res)
{ 
	var data = {};
	if (!req.body.user_pub_id) {
		cm.responseMessage(constant.Zero, constant.chkfield, res);
	} else {
		db.query("select * from bank_details where user_pub_id='"+req.body.user_pub_id+"'", function (err, result) {
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
					db.query('insert into bank_details set ?', [Obj], function (err) {
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
					// if(req.body.name == null || req.body.name == undefined || req.body.name == '')req.body.name = result.name;
					// if(req.body.bank_name == null || req.body.bank_name == undefined || req.body.bank_name == '')req.body.bank_name = result.bank_name;
					// if(req.body.branch_name == null || req.body.branch_name == undefined || req.body.branch_name == '')req.body.branch_name = result.branch_name;
					// if(req.body.account_number == null || req.body.account_number == undefined || req.body.account_number == '')req.body.account_number = result.account_number;
					// if(req.body.ifsc_code == null || req.body.ifsc_code == undefined || req.body.ifsc_code == '')req.body.ifsc_code = result.ifsc_code;
					// if(req.body.swift_code == null || req.body.swift_code == undefined || req.body.swift_code == '')req.body.swift_code = result.swift_code;
					req.body.updated_at = (new Date()).valueOf().toString()
					var sql = "UPDATE bank_details SET name=?,t_c_id_no=?,handy_phone=?,iban=?,address=?,updated_at=? WHERE user_pub_id=?";
					db.query(sql, [req.body.name, req.body.t_c_id_no,req.body.handy_phone,req.body.iban,req.body.address,req.body.updated_at, req.body.user_pub_id], function (err, result) {
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
router.get('/Commision_histroy/:id', function (req, res) {
  if (req.session.email) {
        var id = req.params.id;
        db.query('select us.name,us.email_id,cs.currency_symbol,cs.currency_name, ub.* from user_balance ub join currency_setting cs on cs.id=ub.currency_id join user us on us.user_pub_id=ub.user_pub_id where ub.artist_pub_id="' + id + '"', function (err, resultBalanceHistroy) {
          // console.log('resultBalanceHistroy',resultBalanceHistroy);
          res.render('User/commision_histroy', { tab:'commision_histroy', user : id ,resultBalanceHistroy:resultBalanceHistroy});
        })
  }else {
    res.redirect("/login");
  }
});
router.get('/Customer_payout/:id', function (req, res) {
  if (req.session.email) {
        var id = req.params.id;
        db.query('select * from user where user_pub_id="' + id + '"', function (err, resultUser) {
          if(resultUser == '' || resultUser == null || resultUser == undefined || resultUser == [])resultUser = '';
          else resultUser = resultUser[0];
          db.query('select cs.currency_symbol,cs.currency_name,uc.* from user_current_balance uc join currency_setting cs on cs.id=uc.currency_id where uc.user_pub_id="' + id + '"', function (err, resultUserCurrentBal) {
            db.query('select cs.currency_symbol,cs.currency_name,po.* from payout po join currency_setting cs on cs.id=po.currency_id where po.user_pub_id="' + id + '"', function (err, resultUserPayout) {
              // db.query('select us.name,us.email_id,cs.currency_symbol,cs.currency_name, ub.* from user_balance ub join currency_setting cs on cs.id=ub.currency_id join user us on us.user_pub_id=ub.user_pub_id where ub.artist_pub_id="' + id + '"', function (err, resultBalanceHistroy) {
              //   console.log('resultBalanceHistroy',resultBalanceHistroy);
                res.render('User/customer_payout', { user_data:resultUser,tab:'customer_payout', user : id ,resultUserCurrentBal:resultUserCurrentBal,resultUserPayout:resultUserPayout});
              // })
            })
          })
        });
  }else {
    res.redirect("/login");
  }
});
router.post('/add_payout',upload.single('image'), function(req, res)
{ 
    var data = {};
    if(req.session.email){
        var Obj = {};
        Obj.user_pub_id = req.body.user_pub_id;
        Obj.title	 = req.body.title;
        Obj.description	 = req.body.description;
        Obj.amount	 = req.body.amount;
        Obj.remaining_balance	 = req.body.remaining_balance;
        if(req.body.reference_id)Obj.reference_id	 = req.body.reference_id;
        Obj.payment_type = req.body.payment_type;
        Obj.currency_id = req.body.currency_id;
        if(req.file){
          Obj.image = req.file.filename;
        }
        Obj.datetime = moment(new Date()).format('DD MMM YYYY HH:MM');
        Obj.created_at = (new Date()).valueOf().toString();
        // console.log(Obj);
        db.query('insert into payout set ?', [Obj], function (err) {
          if (err) {
            // console.log('1830',err);
            res.json({
              status:0,
              message:err
            })
          } else {
            db.query('update user_current_balance set user_current_balance="'+req.body.remaining_balance+'", updated_at="'+(new Date()).valueOf().toString()+'" where user_pub_id="' + req.body.user_pub_id + '" AND currency_id = "'+req.body.currency_id+'"', function (err) {
              res.json({
                status:1,
                message:'Success'
              })
            })
          }
        })
    }else{
      res.redirect("/login");
    }
});

router.get('/Customer_view/:id', function (req, res) {
  if (req.session.email) {
    var id = req.params.id;
    db.query("select c.cat_name as cat_name,u.*,u1.point from user as u "+
    "join user_point  as u1 on u.user_pub_id = u1.user_id "+
    "left join categories  as c on u.cat_id = c.id "+
    "WHERE u.user_pub_id='"+id+"' ", function (err, result) {
      if (result.length == 0) {
        res.redirect("/Customer");
      } else {
        var result_user = JSON.parse(JSON.stringify(result));
        db.query('select u.*,c.cat_name from multiple_category u join categories c on c.id=u.cat_id where u.user_pub_id="' + result_user[0].user_pub_id + '"', function (err, resultCat) {
          if(resultCat == '' || resultCat == null || resultCat == undefined || resultCat == [])resultCat = [];
          else resultCat = resultCat;
          db.query('select cs.currency_symbol,cs.currency_name,uc.* from user_current_balance uc join currency_setting cs on cs.id=uc.currency_id where uc.user_pub_id="' + id + '"', function (err, resultUserCurrentBal) {
            res.render('User/customer_view', { result: result_user[0], tab:'view', user : id ,resultCat:resultCat,resultUserCurrentBal:resultUserCurrentBal,base_url_image:constant.base_url_image });
          })
        })
      }
    });
  }
  else {
    res.redirect("/login");
  }
});

router.get('/Customer_job/:id', function (req, res) {
  if (req.session.email) {
    var id = req.params.id;
    db.query('SELECT p.*,u.name FROM post_job p '+
    'join user u on p.user_pub_id=u.user_pub_id '+
    'join apply_job a on p.user_pub_id=a.artist_pub_id where p.user_pub_id="'+id+'" ', function (err, postJob) {
      if (err) {
        res.redirect("/Customer");
      } else {
        var postJob = JSON.parse(JSON.stringify(postJob));
        res.render('User/customer_job', { result: postJob, tab:'job', user : id });
      }
    });
  }
  else {
    res.redirect("/login");
  }
});

router.get('/Customer_invoice_received/:id', function (req, res) {
  if (req.session.email) {
    var id = req.params.id;
    db.query('SELECT i.*,u.name,p.job_title FROM booking_invoice1 i '+
    'LEFT JOIN user u on i.user_pub_id=u.user_pub_id '+
    'LEFT JOIN post_job p on i.job_id=p.job_id '+
    'where i.artist_pub_id="'+id+'" ', function (err, invoices) {
      if (err) {
        res.redirect("/Customer");
      } else {
        // console.log(invoices);
        invoices = JSON.parse(JSON.stringify(invoices));
        res.render('User/customer_invoice_received', { result: invoices, tab:'inv_received', user : id });
      }
    });
  }
  else {
    res.redirect("/login");
  }
});

router.get('/Customer_invoice_send/:id', function (req, res) {
  if (req.session.email) {
    var id = req.params.id;
    db.query('SELECT i.*,u.name,p.job_title FROM booking_invoice1 i '+
    'LEFT JOIN user u on i.artist_pub_id=u.user_pub_id '+
    'LEFT JOIN post_job p on i.job_id=p.job_id '+
    'where i.user_pub_id="'+id+'" ', function (err, invoices) {
      if (err) {
        res.redirect("/Customer");
      } else {
        var invoices = JSON.parse(JSON.stringify(invoices));
        res.render('User/customer_invoice_send', { result: invoices, tab:'inv_send', user : id });
      }
    });
  }
  else {
    res.redirect("/login");
  }
});

router.get('/Customer_edit/:id', function (req, res) {
  if (req.session.email) {
    var id = req.params.id;
    db.query("select u.*,u1.point from user as u join user_point  as u1 on u.user_pub_id = u1.user_id WHERE u.user_pub_id='"+id+"' ", function (err, result) {
      if (result.length == 0) {
        res.redirect("/Customer");
      } else {
        var result_user = JSON.parse(JSON.stringify(result));
        res.render('User/customer_edit', { result: result_user[0] });
      }
    });
  }
  else {
    res.redirect("/login");
  }
});

router.post('/Customer_update', function (req, res) {
  if (req.session.email) {
    var id = req.body.id;
    var mobile_no = req.body.mobile_no;
    var gender = req.body.gender;
    var name = req.body.name;
    var description = req.body.description;
    var address = req.body.address;
    var qualification = req.body.qualification;
    var country = req.body.country;
    var city = req.body.city;
    var bio = req.body.bio;
    var commission = req.body.commission;
    var sql = "UPDATE user SET mobile_no =?, gender =?, name =?, description =?, address =?, qualification =?, country =?, city =?, bio =?, commission=? WHERE user_pub_id = ?";
    var data = [mobile_no, gender, name, description, address, qualification, country, city, bio,commission, id];
    var query = db.query(sql, data, function (err, result) {
      res.redirect("/Customer");
    });
  }
  else {
    res.redirect("/login");
  }
});

router.get('/Customer_add', function (req, res) {
  if (req.session.email) {
        res.render('User/customer_add', { result: [] });
  }
  else {
    res.redirect("/login");
  }
});

router.post('/Customer_store',async function (req, res) {
  console.log('Save')
  if (!req.body.email_id || !req.body.mobile_no || !req.body.gender || !req.body.name || !req.body.description || 
      !req.body.address || !req.body.qualification || !req.body.country || !req.body.city || !req.body.bio ||
      !req.body.password || !req.body.confirm_password) {
        return res.send({"status":"false","message":"All Fields Required"});
	} else {
    db.query("SELECT * FROM `user` WHERE `email_id`='"+req.body.email_id+"'", function (err, result) {
      if (result.length > 0) {
        return res.send({"status":"false","message":"Email Already Exist"});
      } else {
        if(req.body.password != req.body.confirm_password){
          return res.send({"status":"false","message":"Password and confirm password does not match"});
        } else {
          bcrypt.hash(req.body.password, 5, function (err, bcryptedPassword) {
            if (bcryptedPassword.length > 0) {
							var password = bcryptedPassword
						}
            var user_pub_id = uniqid();
            db.query('SELECT * FROM package WHERE is_default="1" ', function (err, packageData) {
							if (err) {
								return res.send({"status":"false","message":"Server error 1"});
							} else {
                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                var referral_code='';
                for(var i=6; i>0;--i){
                  referral_code +=chars[Math.floor(Math.random()*chars.length)];
                }
              
                var sql = 'insert into user set user_pub_id="'+user_pub_id.toUpperCase()+'", referral_code="'+referral_code+'", '+
                'email_id="'+req.body.email_id+'", mobile_no="'+req.body.mobile_no+'", gender="'+req.body.gender+'", '+
                'name="'+req.body.name+'", description="'+req.body.description+'", address="'+req.body.address+'", '+
                'qualification="'+req.body.qualification+'", country="'+req.body.country+'", city="'+req.body.city+'", '+
                'bio="'+req.body.bio+'",commission="'+req.body.commission+'", password="'+password+'", email_verified="1", status="1", '+
                'created_at="'+(new Date()).valueOf().toString()+'", updated_at="'+(new Date()).valueOf().toString()+'" ';

                if(packageData.length > 0){
									var packageData = JSON.parse(JSON.stringify(packageData));
									packageData = packageData[0];
									var myDate = new Date();
									myDate.setDate(myDate.getDate() + packageData.days);
									var subs_end_date = (myDate).valueOf().toString();
                  sql = sql + ' , sub_end_date="'+subs_end_date+'" ';
                }
                db.query(sql,function(err,result){
                  if(err){
                    console.log(err)
                    return res.send({"status":"false","message":"Server error 2"});
                  }else{
                    db.query('select * from user where email_id="' + req.body.email_id + '"', function (err, re) {
											if (err) {
												console.log(err);
											} else {
												var re = JSON.parse(JSON.stringify(re));
												var user_pub_id = re[0].user_pub_id;
												var point = "0"
												var created_at = (new Date()).valueOf().toString()
												var updated_at = (new Date()).valueOf().toString()
												db.query('insert into user_point set user_id="' + user_pub_id + '",point="' + point + '",created_at="' + created_at + '" and updated_at="' + updated_at + '"', function (err, result) {
													if (err) {
														console.log(err);
													} else {
                            return res.send({"status":"true","message":"Added user successfully"});
													}
												})
											}
										})
                  }
                })                              
              }
            });
          });
        }
      }
    });
  }
});

router.get('/Payout', function (req, res) {
  if (req.session.email) {
    db.query("select u.name as name,t1.* from user as u join transaction  as t1 on u.user_pub_id = t1.user_pub_id where trans_type='0'", function (err, resultTrans) {
      if (err) {
        console.log(err)
      } else {
        var resultTrans = JSON.parse(JSON.stringify(resultTrans));
        res.render('Payout/payout', { resultTrans: resultTrans });
      }
    })
  }
  else {
    res.redirect("/login");
  }
})

router.get('/transHistory', function (req, res) {
  if (req.session.email) {
    db.query("select u.name as name,t1.* from user as u join transaction_history  as t1 on u.user_pub_id = t1.user_id ", function (err, resultTrans) {
      if (err) {
        console.log(err)
      } else {
        var resultTrans = JSON.parse(JSON.stringify(resultTrans));
        res.render('Payout/trans_history', { resultTrans: resultTrans });
      }
    })
  }
  else {
    res.redirect("/login");
  }

});


router.post('/changePayoutRequest', function (req, res) {
  if (req.session.email) {
    var user_id = req.body.user_pub_id;
    db.query("update transaction set trans_status='1' where user_pub_id='" + user_id + "'", function (err, resultTrans) {
      if (err) {
        console.log(err)
      } else {
        res.redirect('/Payout');
      }

    })
  }
  else {
    res.redirect("/login");
  }

})


router.get('/Purchase', function (req, res) {
  if (req.session.email) {
    db.query("select u.name as name,t1.* ,t.* from user as u left join transaction  as t1 on u.user_pub_id = t1.user_pub_id left join transaction_history t on t1.trans_id=t.invoice_id where t1.trans_type='1'", function (err, resultTrans) {
      console.log(resultTrans);
      if (resultTrans.length == 0) {
        console.log(err)
        res.render('Payout/purchase', { resultTrans: '' });
      } else {
        var resultTrans = JSON.parse(JSON.stringify(resultTrans));
        res.render('Payout/purchase', { resultTrans: resultTrans });
      }

    })
  }
  else {
    res.redirect("/login");
  }
})
//View Profile
router.get('/ViewProfile', function (req, res) {
  res.render('User/userProfile');
})

router.post('/changeUserStatus', function (req, res) {
  if (req.session.email) {
    console.log("changesttus")
    db.query("select * from user WHERE user_pub_id='" + req.body.user_pub_id + "'", function (err, resultUser) {
      if (err) {
        console.log(err);
      } else {
        var resultUser = JSON.parse(JSON.stringify(resultUser));
        var status = resultUser[0].status;
        console.log()
        if (status == '1') {
          db.query('update user set status="2" WHERE user_pub_id="' + req.body.user_pub_id + '"', function (err, result) {
            if (err) {
              res.json('success');
            } else {
              res.json('success');
            }
          })
        } else {
          db.query('update  user set status="1" WHERE user_pub_id="' + req.body.user_pub_id + '"', function (err, result) {
            if (err) {
              res.json('success');
            } else {
              res.json('success');
            }
          })
        }
      }
    })
  } else {
    res.redirect("/login");
  }
})

//category

router.get('/category', function (req, res) {
  if (req.session.email) {
    db.query("select * from language where status='1'", function (err, language_data) {
      if(language_data == null || language_data == '' || language_data == undefined)language_data=[];
      db.query("select *,concat('" + constant.base_url + "',image) as image from categories  ", function (err, result) {
        if (result.length == 0) {
          console.log(err)
          res.render('category/category', { result: '',language_data:language_data });
        } else {
          var result_user = JSON.parse(JSON.stringify(result));
          res.render('category/category', { result: result_user,language_data:language_data });
        }
      })
    });
  }
  else {
    res.redirect("/login");
  }
})
router.post('/changeCatStatus', function (req, res) {
  if (req.session.email) {

    db.query("select * from categories WHERE id='" + req.body.id + "'", function (err, Cat) {
      if (err) {
        console.log(err);
      } else {
        var Cat = JSON.parse(JSON.stringify(Cat));
        var status = Cat[0].status;
        console.log()
        if (status == '1') {
          db.query('update categories set status="2" WHERE id="' + req.body.id + '"', function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log('updated ');
            }
          })
        } else {
          db.query('update  categories set status="1" WHERE id="' + req.body.id + '"', function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log('updated ');
            }
          })
        }
      }
    })
  } else {
    res.redirect("/login");
  }
})
router.post("/addcat", upload.single('image'), function (req, res) {
  if (req.session.email) {
    console.log(req.file);
    var today = new Date();
    req.body.image = "Bakvebul/images/" + req.file.filename;
    var data = {
      "language": req.body.language,
      "cat_name": req.body.cat_name,
      "image": req.body.image,
    }
    db.query("INSERT INTO categories SET ?", data, function (err, results, fields) {
      if (!err) {
        //res.flash("msg","Error in adding auction");
        console.log(req.body);
        res.redirect("/category")
      }
      else {
        //res.flash("msg","Error in adding auction");
        console.log(err);
        res.redirect("/category");
      }
    });
  } else {
    res.redirect("/login");
  }
});

//Edit Category 
router.get("/editcat", function (req, res) {
  console.log(req.body.catId);
  var cat_id = req.body.catId;
  db.query("SELECT *,CONCAT('" + constant.base_url + "',image) as image FROM categories WHERE id=?", [cat_id], function (err, result) {
    if (err) {
      console.log(err);
    }
    db.query("select * from language where status='1'", function (err, language_data) {
      if(language_data == null || language_data == '' || language_data == undefined)language_data=[];
      result = JSON.parse(JSON.stringify(result[0]));
      res.render("category/edit_cat", { result: result,language_data:language_data });
    });
  });
});

//Jobs
router.get('/job_list', function (req, res) {
  if (req.session.email) {
        res.render('Jobs/job_list', { result: '' });
  }
  else {
    res.redirect("/login");
  }
})
router.get('/job_datatable_list', function (req, res) {
  if (req.session.email) {
    var skip = req.query.start;
    var limit = req.query.length;
    var val = req.query.search.value;
    var status = '';
    if(req.query.status == 'Pending')status = "where (p.status='0' OR p.status='1')";
    if(req.query.status == 'Running')status = "where p.status='5'";
    if(req.query.status == 'Cancelled')status = "where p.status='3'";
    if(req.query.status == 'Complete')status = "where p.status='2'";
    
    // where first_name like
    var search = '';
    if(val){
      search = "AND ((u.name LIKE CONCAT('%"+val+"%')) OR (p.job_title LIKE CONCAT('%"+val+"%')))"
    }
    var qry = '';
    if(val){
      qry = "SELECT p.*,u.name FROM post_job p join user u on p.user_pub_id=u.user_pub_id "+status+" "+search+" LIMIT "+limit+" OFFSET "+skip+""
    }else{
      qry = "SELECT p.*,u.name FROM post_job p join user u on p.user_pub_id=u.user_pub_id "+status+" LIMIT "+limit+" OFFSET "+skip+""
    }
    var qryFilter = '';
    if(val){
      qryFilter = "SELECT p.*,u.name FROM post_job p join user u on p.user_pub_id=u.user_pub_id "+status+" "+search+""
    }else{
      qryFilter = "SELECT p.*,u.name FROM post_job p join user u on p.user_pub_id=u.user_pub_id "+status+""
    }
    db.query(qryFilter, function (err, resultFilter) {
      if(resultFilter == null || resultFilter == '' || resultFilter == undefined || resultFilter == 'null')resultFilter = 0;
      else resultFilter = resultFilter.length;
      db.query(qry, function (err, result) {
            if(result == null || result == '' || result == undefined || result == 'null')result = [];
            // console.log('resultFilter',resultFilter);
            var data = JSON.stringify({
              "draw": req.query.draw,
              "recordsFiltered": resultFilter,
              "recordsTotal": resultFilter,
              "data": result
            });
            res.send(data);
      })
    })
  }
  else {
    res.redirect("/login");
  }
});
router.get('/job_view', function (req, res) {
  if (req.session.email) {
        res.render('Jobs/view', { result: '' });
  }
  else {
    res.redirect("/login");
  }
})

router.get('/invoice_list', function (req, res) {
  if (req.session.email) {
        res.render('invoice/invoice_list', { result: '' });
  }
  else {
    res.redirect("/login");
  }
})
router.get('/invoice_view', function (req, res) {
  if (req.session.email) {
        res.render('invoice/view', { result: '' });
  }
  else {
    res.redirect("/login");
  }
})
// db.query('SELECT i.*,u.name,p.job_title FROM booking_invoice1 i '+
//     'LEFT JOIN user u on i.user_pub_id=u.user_pub_id '+
//     'LEFT JOIN post_job p on i.job_id=p.job_id '+
//     'where i.artist_pub_id="'+id+'" ', function (err, invoices) {
router.get('/invoice_datatable_list', function (req, res) {
  if (req.session.email) {
    var skip = req.query.start;
    var limit = req.query.length;
    var val = req.query.search.value;
    // where first_name like
    var search = '';
    if(val){
      search = "WHERE (u.name LIKE CONCAT('%"+val+"%')) OR (p.job_id LIKE CONCAT('%"+val+"%'))"
    }
    "SELECT i.*,u.name,p.job_title FROM booking_invoice1 i "+
    "LEFT JOIN user u on i.user_pub_id=u.user_pub_id "+
    "LEFT JOIN post_job p on i.job_id=p.job_id"
    var qry = '';
    if(val){
      qry = "SELECT i.*,u.name,p.job_title FROM booking_invoice1 i LEFT JOIN user u on i.user_pub_id=u.user_pub_id LEFT JOIN post_job p on i.job_id=p.job_id "+search+" LIMIT "+limit+" OFFSET "+skip+""
    }else{
      qry = "SELECT i.*,u.name,p.job_title FROM booking_invoice1 i LEFT JOIN user u on i.user_pub_id=u.user_pub_id LEFT JOIN post_job p on i.job_id=p.job_id LIMIT "+limit+" OFFSET "+skip+""
    }
    var qryFilter = '';
    if(val){
      qryFilter = "SELECT i.*,u.name,p.job_title FROM booking_invoice1 i LEFT JOIN user u on i.user_pub_id=u.user_pub_id LEFT JOIN post_job p on i.job_id=p.job_id "+search+""
    }else{
      qryFilter = "SELECT i.*,u.name,p.job_title FROM booking_invoice1 i LEFT JOIN user u on i.user_pub_id=u.user_pub_id LEFT JOIN post_job p on i.job_id=p.job_id"
    }
    db.query(qryFilter, function (err, resultFilter) {
      console.log('err',err);
      if(resultFilter == null || resultFilter == '' || resultFilter == undefined || resultFilter == 'null')resultFilter = 0;
      else resultFilter = resultFilter.length;
      db.query(qry, function (err, result) {
        if(result == null || result == '' || result == undefined || result == [])result = [];
        // console.log('result',result);
        // console.log('resultFilter',resultFilter);
        var data = JSON.stringify({
          "draw": req.query.draw,
          "recordsFiltered": resultFilter,
          "recordsTotal": resultFilter,
          "data": result
        });
        res.send(data);
      })
    })
  }
  else {
    res.redirect("/login");
  }
});

router.get('/invoice_rec_list/:user_id', function (req, res) {
  if (req.session.email) {
    var skip = req.query.start;
    var limit = req.query.length;
    var val = req.query.search.value;
    var id = req.params.user_id
    var search = '';
    if(val){
      search = "(u.name LIKE CONCAT('%"+val+"%')) OR (p.job_id LIKE CONCAT('%"+val+"%'))"
    }
    "SELECT i.*,u.name,p.job_title FROM booking_invoice1 i "+
    "LEFT JOIN user u on i.user_pub_id=u.user_pub_id "+
    "LEFT JOIN post_job p on i.job_id=p.job_id"
    var qry = '';
    if(val){
      qry = "SELECT i.*,u.name,u.email_id,u.mobile_no,u.country_code,cs.currency_symbol,p.job_title FROM booking_invoice1 i LEFT JOIN user u on u.user_pub_id=i.artist_pub_id JOIN currency_setting cs on cs.id=i.currency_id LEFT JOIN post_job p on i.job_id=p.job_id WHERE i.user_pub_id='"+id+"' AND "+search+" LIMIT "+limit+" OFFSET "+skip+""
    }else{
      qry = "SELECT i.*,u.name,u.email_id,u.mobile_no,u.country_code,cs.currency_symbol,p.job_title FROM booking_invoice1 i LEFT JOIN user u on u.user_pub_id=i.artist_pub_id JOIN currency_setting cs on cs.id=i.currency_id LEFT JOIN post_job p on i.job_id=p.job_id WHERE i.user_pub_id='"+id+"' LIMIT "+limit+" OFFSET "+skip+""
    }
    var qryFilter = '';
    if(val){
      qryFilter = "SELECT i.*,u.name,u.email_id,u.mobile_no,u.country_code,cs.currency_symbol,p.job_title FROM booking_invoice1 i LEFT JOIN user u on u.user_pub_id=i.artist_pub_id JOIN currency_setting cs on cs.id=i.currency_id LEFT JOIN post_job p on i.job_id=p.job_id WHERE i.user_pub_id='"+id+"' AND "+search+""
    }else{
      qryFilter = "SELECT i.*,u.name,u.email_id,u.mobile_no,u.country_code,cs.currency_symbol,p.job_title FROM booking_invoice1 i LEFT JOIN user u on u.user_pub_id=i.artist_pub_id JOIN currency_setting cs on cs.id=i.currency_id LEFT JOIN post_job p on i.job_id=p.job_id WHERE i.user_pub_id='"+id+"'"
    }
    db.query(qryFilter, function (err, resultFilter) {
      console.log('err',err);
      if(resultFilter == null || resultFilter == '' || resultFilter == undefined || resultFilter == 'null')resultFilter = 0;
      else resultFilter = resultFilter.length;
      db.query(qry, function (err, result) {
        if(result == null || result == '' || result == undefined || result == [])result = [];
        // console.log('result',result);
        // console.log('resultFilter',resultFilter);
        var data = JSON.stringify({
          "draw": req.query.draw,
          "recordsFiltered": resultFilter,
          "recordsTotal": resultFilter,
          "data": result
        });
        res.send(data);
      })
    })
  }
  else {
    res.redirect("/login");
  }
});

router.get('/invoice_send_list/:user_id', function (req, res) {
  if (req.session.email) {
    var skip = req.query.start;
    var limit = req.query.length;
    var val = req.query.search.value;
    var id = req.params.user_id;
    var search = '';
    if(val){
      search = "(u.name LIKE CONCAT('%"+val+"%')) OR (p.job_id LIKE CONCAT('%"+val+"%'))"
    }
    "SELECT i.*,u.name,p.job_title FROM booking_invoice1 i "+
    "LEFT JOIN user u on i.user_pub_id=u.user_pub_id "+
    "LEFT JOIN post_job p on i.job_id=p.job_id"
    var qry = '';
    if(val){
      qry = "SELECT i.*,u.name,u.email_id,u.mobile_no,u.country_code,cs.currency_symbol,p.job_title FROM booking_invoice1 i LEFT JOIN user u on i.user_pub_id=u.user_pub_id JOIN currency_setting cs on cs.id=i.currency_id LEFT JOIN post_job p on i.job_id=p.job_id WHERE i.artist_pub_id='"+id+"' AND "+search+" LIMIT "+limit+" OFFSET "+skip+""
    }else{
      qry = "SELECT i.*,u.name,u.email_id,u.mobile_no,u.country_code,cs.currency_symbol,p.job_title FROM booking_invoice1 i LEFT JOIN user u on i.user_pub_id=u.user_pub_id JOIN currency_setting cs on cs.id=i.currency_id LEFT JOIN post_job p on i.job_id=p.job_id WHERE i.artist_pub_id='"+id+"' LIMIT "+limit+" OFFSET "+skip+""
    }
    var qryFilter = '';
    if(val){
      qryFilter = "SELECT i.*,u.name,u.email_id,u.mobile_no,u.country_code,cs.currency_symbol,p.job_title FROM booking_invoice1 i LEFT JOIN user u on i.user_pub_id=u.user_pub_id JOIN currency_setting cs on cs.id=i.currency_id LEFT JOIN post_job p on i.job_id=p.job_id WHERE i.artist_pub_id='"+id+"' AND "+search+""
    }else{
      qryFilter = "SELECT i.*,u.name,u.email_id,u.mobile_no,u.country_code,cs.currency_symbol,p.job_title FROM booking_invoice1 i LEFT JOIN user u on i.user_pub_id=u.user_pub_id JOIN currency_setting cs on cs.id=i.currency_id LEFT JOIN post_job p on i.job_id=p.job_id WHERE i.artist_pub_id='"+id+"'"
    }
    db.query(qryFilter, function (err, resultFilter) {
      console.log('err',err);
      if(resultFilter == null || resultFilter == '' || resultFilter == undefined || resultFilter == 'null')resultFilter = 0;
      else resultFilter = resultFilter.length;
      db.query(qry, function (err, result) {
        if(result == null || result == '' || result == undefined || result == [])result = [];
        console.log('result',result);
        // console.log('resultFilter',resultFilter);
        var data = JSON.stringify({
          "draw": req.query.draw,
          "recordsFiltered": resultFilter,
          "recordsTotal": resultFilter,
          "data": result
        });
        res.send(data);
      })
    })
  }
  else {
    res.redirect("/login");
  }
});

router.get('/pending', function (req, res) {
  if (req.session.email) {
    db.query('SELECT p.*,u.name FROM post_job p join user u on p.user_pub_id=u.user_pub_id where p.status="0" || p.status="1"', function (err, postJob) {
      // console.log(postJob)
      if (err) {
        console.log(err)
      } else {
        var postJob = JSON.parse(JSON.stringify(postJob));
        res.render('Jobs/pending_jobs', { result: postJob });
      }
    })
  }
  else {
    res.redirect("/login");
  }
})
router.get('/running', function (req, res) {
  if (req.session.email) {
    db.query('SELECT p.*,u.name FROM post_job p join user u on p.user_pub_id=u.user_pub_id  join apply_job a on p.user_pub_id=a.artist_pub_id where p.status=5', function (err, postJob) {
      console.log(postJob)
      if (err) {
        console.log(err)
      } else {
        var postJob = JSON.parse(JSON.stringify(postJob));
        res.render('Jobs/Running_jobs', { result: postJob });

      }
    })
  }
  else {
    res.redirect("/login");
  }
})
router.get('/cancle', function (req, res) {
  if (req.session.email) {
    db.query('SELECT p.*,u.name FROM post_job p join user u on p.user_pub_id=u.user_pub_id  join apply_job a on p.user_pub_id=a.artist_pub_id where p.status=3', function (err, postJob) {
      console.log(postJob)
      if (err) {
        console.log(err)
      } else {
        var postJob = JSON.parse(JSON.stringify(postJob));
        res.render('Jobs/cancled_job', { result: postJob });

      }
    })
  }
  else {
    res.redirect("/login");
  }
})

router.get('/complete', function (req, res) {
  if (req.session.email) {
    db.query('SELECT p.*,u.name FROM post_job p join user u on p.user_pub_id=u.user_pub_id  join apply_job a on p.user_pub_id=a.artist_pub_id where p.status=2', function (err, postJob) {
      console.log(postJob)
      if (err) {
        console.log(err)
      } else {
        var postJob = JSON.parse(JSON.stringify(postJob));
        res.render('Jobs/completed_job', { result: postJob });
      }
    })
  }
  else {
    res.redirect("/login");
  }
})

//Notification
router.get('/notification', function (req, res) {
  if (req.session.email) {
    db.query("select *,concat('" + constant.base_url + "',image) as image from user WHERE status='1' ", function (err, result) {
      if (err) {
        console.log(err)
        res.render('Notification/notification', { result: '' });
      } else {
        result = JSON.parse(JSON.stringify(result));
        res.render('Notification/notification', { result: result });
      }
    })
  } else {
    res.redirect("/login");
  }
})

router.get('/point', function (req, res) {
  if (req.session.email) {
    db.query('select * from setting where def_key="fannan_point"', function (err, result) {
        if (err) {
          res.redirect('/login')
        } else {
        if(result[0] == null || result[0] == undefined){
          res.render('Payout/point', { result1: {'point':'','price':'','currency_symbol':'',} });
        }else{
          var resutlt = result[0].def_value;
          var result = JSON.parse(resutlt);
          res.render('Payout/point', { result1: result });
        }
      }
    })
  } else {
    res.redirect('/login')
  }
})

router.post("/updatePoint", function (req, res) {
  if (req.session.email) {
    var data = { point: "", price: "", currency_symbol: "" };
    // console.log(req.body);
    data.price = req.body.price;
    data.point = req.body.point;
    data.currency_symbol = req.body.currency_symbol;
    var result = JSON.stringify(data);
    var query = db.query("update setting set def_value='" + result + "' where def_key='fannan_point'", function (err, result) {
      if (err) {
        //req.flash("msg", "Error In User update");
        res.redirect("/point");
      }
      else {
        //req.flash("msg", "Successfully User UPDATE");
        res.redirect("/point");
      }
    });
  } else {
    res.redirect('/login');
  }
});

router.get("/edit_cat/:id", function (req, res) {
  // if (req.session.email) {
    var cat_id = req.params.id;
    db.query("SELECT *,concat('" + constant.base_url + "',image) as image FROM categories WHERE id=?", [cat_id], function (err, result) {
      if (err) {
        console.log(err);
      }
      db.query("select * from language where status in(0,1)", function (err, language_data) {
        if(language_data == null || language_data == '' || language_data == undefined)language_data=[];
          result = JSON.parse(JSON.stringify(result[0]));
          res.render("category/edit_cat_test", { result: result,language_data:language_data });
      });
    });
});

router.post("/updatecat", upload.single('image'), function (req, res) {
  var sql = "UPDATE categories SET language=?, cat_name =? WHERE id = ?";
  var data = [req.body.language,req.body.cat_name, req.body.id];
  if(req.file != undefined){
    sql = "UPDATE categories SET language=?,cat_name =?,image=? WHERE id = ?";
    req.body.image = "Bakvebul/images/" + req.file.filename;
    data = [req.body.language,req.body.cat_name, req.body.image, req.body.id];
  }
  var query = db.query(sql, data, function (err, result) {
    if (err) {
      //req.flash("msg", "Error In User update");
      console.log(err);
      res.redirect("/category");
    }
    else {
      //req.flash("msg", "Successfully User UPDATE");
      res.redirect("/category");
    }

  });
})

//send-notification
router.post('/send-notification', function (req, res) {
  if (req.session.email) {
    // console.log('req.body',req.body);
    if(req.body.uid == 'All'){
      db.query('select * from user',async function (err, result) {
        if (err) {
          console.log('1048',err);
          res.json({
            status:0,
            message:err
          })
        }
        else{
          if(result == null || result == '' || result == undefined || result == []){
            res.json({
              status:0,
              message:constant.NOT_FOUND_DATA
            })
          }else{
            var result = JSON.parse(JSON.stringify(result));
            // console.log('result',result.length);
            var user_pub_id = result[0].user_pub_id;
            var data = {
              user_pub_id: user_pub_id,
              title: req.body.title,
              msg: req.body.msg,
              type: constant.Broadcast_Notification,
              created_at: (new Date()).valueOf().toString()
            }
            db.query('insert into notification set ?', [data], function (err) {
              if (err) {
                console.log('1073',err);
                res.json({
                  status:0,
                  message:err
                })
              } else {
                console.log('sssss');
                for(let i=0; i<result.length; i++){
                  var device_token = result[i].device_token;
                  if(device_token)firebase.pushnotification(req.body.title, req.body.msg, device_token, constant.Broadcast_Notification);
                  if(i == result.length-1)res.json({status:1,message:'Success'})
                }
              }
            })
          }
        }
      })
    }else{
      db.query('select * from user WHERE user_pub_id="' + req.body.uid + '"', function (err, result) {
        if (!err) {
          var result = JSON.parse(JSON.stringify(result));
          // console.log(result)
          var device_token = result[0].device_token;
          var user_pub_id = result[0].user_pub_id;
          firebase.pushnotification(req.body.title, req.body.msg, device_token, constant.Notification_type);
          var data = {
            // id:uniqid(),
            user_pub_id: user_pub_id,
            title: req.body.title,
            msg: req.body.msg,
            type: constant.Notification_type,
            created_at: (new Date()).valueOf().toString()
          }
          db.query('insert into notification set ?', [data], function (err, result) {
            if (err) {
              res.json({
                status:0,
                message:err
              })
            } else {
              res.json({
                status:1,
                message:'Success'
              })
            }
          })
        }
      })
    }
    // res.redirect('/notification')
  }
  else {
    res.redirect('/login');
  }
});

//Ticket
router.get('/ticket', function (req, res) {
  if (req.session.email) {
    db.query('select t.*,u.name,u.email_id,u.mobile_no from ticket t join user u on u.user_pub_id=t.user_pub_id where u.status="1"', function (err, result) {
      if (err) {
        console.log(err)
      } else {
        var result = JSON.parse(JSON.stringify(result))
        // for (var i = 0; i < result.length; i++) {
        //   var date1 = result[i].created_at;
        //   let ts = Date.now(date1);
        //   console.log(ts)
        //   let date_ob = new Date(ts);
        //   let date = date_ob.getDate();
        //   let month = date_ob.getMonth() + 1;
        //   let year = date_ob.getFullYear();
        //   let hours = date_ob.getHours();

        //   // current minutes
        //   let minutes = date_ob.getMinutes();

        //   // current seconds
        //   let seconds = date_ob.getSeconds();
        //   let time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        //   // prints date & time in YYYY-MM-DD format
        //   console.log(year + "-" + month + "-" + date);

        //   result[i].created_at = time;
        // }
        res.render('Ticket/ticket', { result: result,moment:moment });
      }
    })
  } else {
    res.redirect('/login');
  }
})

router.get('/ticket_comment', function (req, res) {
  if (req.session.email) {
        res.render('Ticket/ticket_comment', { ticket_id:req.query.ticket_id });
  } else {
    res.redirect('/login');
  }
})

router.post('/send_ticket_comment', function (req, res) {
  var data = {};
  if(req.body.ticket_id && req.body.ticket_comment_text){
    var parData = {
      ticket_id: req.body.ticket_id,
      comment: req.body.ticket_comment_text,
      role: 0,
      user_pub_id:'',
      created_at: (new Date()).valueOf().toString(),
      date_time: moment(new Date()).format('DD MMM YYYY HH:MM')
    }
    db.query('INSERT INTO ticket_comments SET ?', parData,async function(err, results) {
        if(err){
            data.message = 'Save Error';
            data.err = err;
            data.status = '0';
            res.status(200).send(JSON.stringify(data));
        }else{
          console.log('device_token',req.body.divice_token)
          await saveAndSendNotificationTicket( req.body.user_pub_id, constant.ticket_confirmation_title, req.body.ticket_comment_text, constant.ticket_comment_notification_type,req.body.divice_token, req.body.ticket_id);
          // CommonHelper.saveAndSendNotificationOfTicket( Ticket_data.user_id, constant_english.ticket_comment_title, role, req.body.ticket_comment_text, constant_english.ticket_comment_msg,Ticket_data._id);
            data.message = 'success';
            data.status = '1';
            res.status(200).send(data);
        }
    })
  }else{
      data.message = constant.chkfield;
      data.status = "0";
      res.status(200).json(data);
  }
});

async function saveAndSendNotificationTicket(to_user_id,title,message,type,device_token,ticket_id){
  var data = {
    // id:uniqid(),
    user_pub_id: to_user_id,
    title: title,
    msg: message,
    type: type,
    created_at: (new Date()).valueOf().toString()
  }
  // firebase.pushnotification(req.body.title, req.body.msg, device_token, constant.Notification_type);
  firebase.pushnotificationticket(title, message, device_token, type, ticket_id);
  db.query('insert into notification set ?', [data], function (err, result) {
    if (err) {
      console.log(err);
    } else {
        // if(device_token)firebase.pushnotificationticket(title, message, device_token, type, ticket_id);
        // return;
    }
  })
}
async function saveAndSendNotification(to_user_id,title,message,type,device_token){
  var data = {
    // id:uniqid(),
    user_pub_id: to_user_id,
    title: title,
    msg: message,
    type: type,
    created_at: (new Date()).valueOf().toString()
  }
  db.query('insert into notification set ?', [data], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      // firebase.pushnotification(req.body.title, req.body.msg, device_token, constant.Notification_type);
      if(device_token)firebase.pushnotification(title, message, device_token, type);
      // return;
    }
  })
}

router.post('/get_ticket_comment', function (req, res) {
  var data = {};
  if(req.body.ticket_id){
    // console.log(req.body.ticket_id);
    db.query('select * from ticket_comments where ticket_id="'+req.body.ticket_id+'"', function (err, result) {
    // db.query('INSERT INTO ticket_comments SET ?', parData, function(err, results) {
        if(err){
            data.message = 'Error';
            data.err = err;
            data.status = '0';
            res.status(200).send(JSON.stringify(data));
        }else{
          db.query('select t.*,u.name,u.email_id,u.device_token,u.image from ticket t join user u on u.user_pub_id=t.user_pub_id where t.id="'+req.body.ticket_id+'"', function (err, user_data) {
              // console.log('result',user_data);
              data.message = 'success';
              data.status = '1';
              data.ticket_comment = result;
              data.user_data = user_data;
              res.status(200).send(data);
          })
        }
    })
  }else{
      data.message = constant.chkfield;
      data.status = "0";
      res.status(200).json(data);
  }
});

router.post('/ticketStatusUpdate',async function (req, res) {
  if (req.session.email) {
    db.query('select t.*,u.name,u.email_id,u.device_token,u.country_code,u.mobile_no from ticket t join user u on u.user_pub_id=t.user_pub_id where t.id="'+req.body.ticket_id+'"', function (err, user_data) {
      if (err) {
        console.log(err)
      } else {
        var user_data = JSON.parse(JSON.stringify(user_data))
        user_data = user_data[0];
        console.log('user_data',user_data);
        var sql = "UPDATE ticket SET status =? WHERE id = ?";
        var data = [req.body.status, req.body.ticket_id];
        var query = db.query(sql, data,async function (err, result) {
          if(err){
            var data = {}
            data.message = 'Update Error';
            data.err = err;
            data.status = '0';
            res.status(200).send(JSON.stringify(data));
          }else{
            var msg = '';
            msg += '<div class="container">';
            // msg += '<img src="'+constant.Mail_Small_logo_url+'"><br><br>';
            msg += '<b>'+constant.HELLO+' '+user_data.name+'</b><br>';
            // msg += '<span>'+constant.ticket_successfully_send_to_admin+'</span><br>';
            msg += '<h6>'+constant.ticket_title+'</h6>';
            msg += '<span>'+user_data.title+'</span><br>';
            msg += '<h6>'+constant.ticket_desc+'</h6>';
            msg += '<span>'+user_data.description+'</span><br><br><br>';
            if(req.body.status == 1)msg += '<span>'+constant.User_Ticket_Resolved+'</span><br><br>'
            if(req.body.status == 2)msg += '<span>'+constant.User_Ticket_cancelled+'</span><br><br>'
            // msg += '<img src="'+constant.Mail_logo_url+'" width="100"><br>';
            // msg += '<b>'+constant.Thanks+'</b><br>';
            msg += '<b>'+constant.SIGNATURE+'</b>';
            msg += '</div>';
            var text = ''
            if(req.body.status == 1)text = constant.User_Ticket_Resolved;
            if(req.body.status == 2)text = constant.User_Ticket_cancelled;
            sendmail(user_data.email_id,constant.ticket_close_subject, msg);

            
            await saveAndSendNotification( user_data.user_pub_id, constant.ticket_close_subject, text, constant.ticket_add_notification_type,user_data.device_token);
            // var ticket_close_not = constant.ticket_title+" - "+Ticket_data.ticket_title+", "+constant.ticket_desc+" - "+Ticket_data.ticket_desc+". "+constant.User_Ticket_Closed
            // CommonHelper.saveAndSendNotification( Ticket_data.user_id, constant.ticket_close_title, role, ticket_close_not, constant.ticket_close_msg);
        
            var msg_admin = '';
            msg_admin += '<div class="container">'
            // msg_admin += '<img src="'+constant.Mail_Small_logo_url+'"><br><br>'
            msg_admin += '<h6>'+constant.ticket_title+'</h6>'
            msg_admin += '<span>'+user_data.title+'</span><br>'
            msg_admin += '<h6>'+constant.ticket_desc+'</h6>'
            msg_admin += '<span>'+user_data.description+'</span><br><br><br>'
            if(req.body.status == 1)msg_admin += '<span>'+constant.User_Ticket_Resolved+'</span><br><br>'
            if(req.body.status == 2)msg_admin += '<span>'+constant.User_Ticket_cancelled+'</span><br><br>'
            msg_admin += '<b>'+constant.Thanks+'</b><br><br>'
            msg_admin += '<b>'+constant.User_name+' '+user_data.name+'</b><br>'
            msg_admin += '<b>'+constant.User_mobile+' '+user_data.country_code+' '+user_data.mobile_no+'</b><br>'
            // if(user.role == 2)msg_admin += '<b>'+constant.User_add+' '+user.address+', '+city+', '+state+', '+country+'</b><br>'
            // if(user.role == 3)msg_admin += '<b>'+constant.User_add+' '+user.house_number+', '+user.street_name+', '+city+', '+state+', '+country+'</b><br>'
            msg_admin += '<b>'+constant.User_email+' '+user_data.email_id+'</b><br>'
            // msg_admin += '<b>'+constant.SIGNATURE+'</b>'
            msg_admin += '</div>'
            sendmail(constant.admin_support_mail,constant.ticket_close_subject, msg_admin);
            var data = {}
            if(req.body.status == 1)data.message = 'Resolved';
            if(req.body.status == 2)data.message = 'Cancelled';
            data.status = '1';
            res.status(200).send(JSON.stringify(data));
          }
        });
      }
    })
  } else {
    res.redirect('/login');
  }
})


router.post('/updatedSupport', function (req, res) {
  if (req.session.email) {
    var id = req.body.id;
    var status = req.body.status;
    console.log(req.body);
    db.query('update ticket set status="' + req.body.status + '" WHERE id="' + id + '"', function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('updated ');
      }
    })
  } else {
    res.redirect('/login')
  }
})
//Coupon

router.post('/addcoupon', function (req, res) {
  if (req.session.email) {
    var today = new Date();
    // req.body.image="fannan2/images/"+req.file.filename;
    var data = {
      language:req.body.language,
      coupon_code: req.body.coupon_code,
      description: req.body.description,
      discount_type: req.body.discount_type,
      discount: req.body.discount,
      created_at: (new Date().valueOf().toString()),
      updated_at: (new Date().valueOf().toString())
    }
    db.query("INSERT INTO coupon SET ?", data, function (err, results) {
      if (!err) {
        //res.flash("msg","Error in adding auction");
        res.redirect("/coupon")
      }
      else {
        //res.flash("msg","Error in adding auction");
        res.redirect("/coupon");
      }
    });
    // res.render('Coupon/coupon')
  } else {
    res.redirect('/login')
  }
});

router.get('/coupon', function (req, res) {
  if (req.session.email) {
    db.query("select * from language where status='1'", function (err, language_data) {
      if(language_data == null || language_data == '' || language_data == undefined)language_data=[];
      db.query('SELECT * from coupon', function (err, result) {
        if (err) {
          console.log(err)
        }
        else {
          
            var result = JSON.parse(JSON.stringify(result));
            res.render('Coupon/coupon', { result: result,language_data:language_data })
          
        }
      })
    })
  } else {
    res.redirect('/login');
  }
})

router.get("/edit_coupon/:id", function (req, res) {
  if (req.session.email) {
    var id = req.params.id;
    db.query("SELECT * FROM coupon WHERE id=?", [id], function (err, result) {
      if (err) {
        console.log(err);
      }
      db.query("select * from language where status='1'", function (err, language_data) {
        if(language_data == null || language_data == '' || language_data == undefined)language_data=[];
        result = JSON.parse(JSON.stringify(result[0]));
        res.render('Coupon/coupon_edit', { result: result,language_data:language_data });
      });
    });
  }
  else {
    res.redirect('/login');
  }
});

//Edit Banner
router.post("/update_coupon", function (req, res) {
  if (req.session.email) {
    var sql = "UPDATE coupon SET language=?,coupon_code =?,description =?,discount_type =?,discount =? WHERE id = ?";
    var query = db.query(sql, [req.body.language,req.body.coupon_code,req.body.description,req.body.discount_type,req.body.discount,req.body.id], function (err, result) {
      res.send({
        "status":"success",
          "message":"Coupon update successfully"  
      })
    });
  } else {
    res.send({
      "status":"false"
    })
  }
});

router.post("/update_coupon_status", function (req, res) {
  if (req.session.email) {
    var sql = "UPDATE coupon SET status =? WHERE id = ?";
    var query = db.query(sql, [req.body.status,req.body.id], function (err, result) {
      res.send({
        "status":"success",
          "message":"Coupon update successfully"  
      })
    });
  } else {
    res.send({
      "status":"false"
    })
  }
})

router.post("/delete_coupon", function (req, res) {
  if (req.session.email) {
    var coupon = req.body.coupon;
    db.query("DELETE FROM coupon WHERE id='"+ coupon +"'", function (err, rseult) {
      res.send({
        "status":"success",
          "message":"Coupon deleted successfully"  
      })
    });
  }
  else {
    res.send({
      "status":"false"
    })
  }
});



//Icons  
router.get('/icons-material', function (req, res) {
  res.render('Icons/icons_material');
})
router.get('/icons-ion', function (req, res) {
  res.render('Icons/icons_ion');
})
router.get('/icons-fontawesome', function (req, res) {
  res.render('Icons/icons_fontawesome');
})
router.get('/icons-themify', function (req, res) {
  res.render('Icons/icons_themify');
})
router.get('/icons-dripicons', function (req, res) {
  res.render('Icons/icons_dripicons');
})
router.get('/icons-typicons', function (req, res) {
  res.render('Icons/icons_typicons');
})


//Google Maps
router.get('/maps-google', function (req, res) {
  res.render('Maps/maps_google');
})
router.get('/maps-vector', function (req, res) {
  res.render('Maps/maps_vector');
})

//Extra pages
router.get('/pages-directory', function (req, res) {
  res.render('Pages/pages_directory');
})
router.get('/pages-faq', function (req, res) {
  res.render('Pages/pages_faq');
})
router.get('/pages-gallery', function (req, res) {
  res.render('Pages/pages_gallery');
})
router.get('/pages-invoice', function (req, res) {
  res.render('Pages/pages_invoice');
})
router.get('/pages-blank', function (req, res) {
  res.render('Pages/pages_blank');
})
router.get('/pages-timeline', function (req, res) {
  res.render('Pages/pages_timeline');
})
router.get('/pages-pricing', function (req, res) {
  res.render('Pages/pages_pricing');
})

// Currency Setting Module ##########################
router.get('/currency_setting', function (req, res) {
  if (req.session.email) {
    db.query("SELECT * FROM currency_setting", function (err, result) {
      if (result.length == 0) {
        console.log(err)
        res.render('CurrencySetting/currency_setting', { result: '' });
      } else {
        var result = JSON.parse(JSON.stringify(result));
        res.render('CurrencySetting/currency_setting', { result: result });
      }
    })
  }
  else {
    res.redirect("/login");
  }
});
router.post("/addCurrencySetting", function (req, res) {
  if (req.session.email) {
    var today = new Date();
    var package_data = {
      // "id":uniqid(),
      "currency_symbol": req.body.currency_symbol,
      "currency_name": req.body.currency_name,
      "code": req.body.code,
      "country_code": req.body.country_code,
      "status":1
    }
    db.query("INSERT INTO currency_setting SET ?", package_data, function (err, results, fields) {
      if (!err) {
        res.redirect("/currency_setting")
      }
      else {
        console.log(err);
        res.redirect("/currency_setting");
      }
    });
  } else {
    res.redirect("/login");
  }
});
router.post('/changecurrencyStatus', function (req, res) {
  if (req.session.email) {
    db.query("select * from currency_setting WHERE id='" + req.body.id + "'", function (err, packageObjData) {
      if (err) {
        console.log(err);
      } else {
        var packageObjData = JSON.parse(JSON.stringify(packageObjData));
        var status = packageObjData[0].status;
        if (status == '1') {
          db.query('update currency_setting set status="0" WHERE id="' + req.body.id + '"', function (err, result) {
            if (err) {
              console.log(err);
            } else {
              res.send({"status":1,"message":"success"});
            }
          })
        } else {
          db.query('update currency_setting set status="1" WHERE id="' + req.body.id + '"', function (err, result) {
            if (err) {
              console.log(err);
            } else {
              res.send({"status":1,"message":"success"});
            }
          })
        }
      }
    })
  } else {
    res.redirect("/login");
  }
});
router.get("/currency/edit/:id", function (req, res) {
  if (req.session.email) {
    var id = req.params.id;
    db.query("SELECT * FROM currency_setting WHERE id=?", [id], function (err, result) {
      if (err) {
        console.log(err);
      }
      result = JSON.parse(JSON.stringify(result[0]));
      res.render("CurrencySetting/edit_currency_setting", { result: result });
    });
  }
  else {
    res.redirect('/login');
  }
});
router.post("/updateCurrency", function (req, res) {
  var sql = "UPDATE currency_setting SET currency_symbol=?,currency_name=?,code=?,country_code=? WHERE id=?";
  var query = db.query(sql, [req.body.currency_symbol, req.body.currency_name, req.body.code, req.body.country_code, req.body.id], function (err, result) {
    if (err) {
      res.redirect("/currency_setting");
    }
    else {
      res.redirect("/currency_setting");
    }
  });
})


// Package Module #################################
router.get('/package', function (req, res) {
  if (req.session.email) {
    db.query("select * from language where status='1'", function (err, language_data) {
      if(language_data == null || language_data == '' || language_data == undefined)language_data=[];
      db.query("SELECT * FROM package", function (err, result) {
        if (result.length == 0) {
          console.log(err)
          res.render('Package/package', { result: '',language_data:language_data });
        } else {
          var result = JSON.parse(JSON.stringify(result));
          res.render('Package/package', { result: result,language_data:language_data });
        }
      })
    });
  }
  else {
    res.redirect("/login");
  }
});
router.get("/package/edit/:id", function (req, res) {
  if (req.session.email) {
    var package_pub_id = req.params.id;
    db.query("SELECT * FROM package WHERE package_pub_id=?", [package_pub_id], function (err, result) {
      if (err) {
        console.log(err);
      }
      db.query("select * from language where status='1'", function (err, language_data) {
        if(language_data == null || language_data == '' || language_data == undefined)language_data=[];
        result = JSON.parse(JSON.stringify(result[0]));
        res.render("Package/edit_package", { result: result,language_data:language_data });
      });
    });
  }
  else {
    res.redirect('/login');
  }
});
router.post("/updatePackage", function (req, res) {
  var sql = "UPDATE package SET language=?,title=?,description=?,days=?,amount=? WHERE package_pub_id=?";
  var query = db.query(sql, [req.body.language,req.body.title, req.body.description, req.body.days, req.body.amount, req.body.package], function (err, result) {
    if (err) {
      res.redirect("/package");
    }
    else {
      res.redirect("/package");
    }
  });
})
router.post("/addPackage", function (req, res) {
  if (req.session.email) {
    var today = new Date();
    var package_data = {
      "package_pub_id":uniqid(),
      "language": req.body.language,
      "title": req.body.title,
      "description": req.body.description,
      "days": req.body.days,
      "amount": req.body.amount,
      "status":1
    }
    db.query("INSERT INTO package SET ?", package_data, function (err, results, fields) {
      if (!err) {
        //res.flash("msg","Error in adding auction");
        res.redirect("/package")
      }
      else {
        //res.flash("msg","Error in adding auction");
        console.log(err);
        res.redirect("/package");
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.post('/changePackageStatus', function (req, res) {
  if (req.session.email) {
    db.query("select * from package WHERE package_pub_id='" + req.body.id + "'", function (err, packageObjData) {
      if (err) {
        console.log(err);
      } else {
        var packageObjData = JSON.parse(JSON.stringify(packageObjData));
        var status = packageObjData[0].status;
        if (status == '1') {
          db.query('update package set status="0" WHERE package_pub_id="' + req.body.id + '"', function (err, result) {
            if (err) {
              console.log(err);
            } else {
              res.send({"status":1,"message":"success"});
            }
          })
        } else {
          db.query('update package set status="1" WHERE package_pub_id="' + req.body.id + '"', function (err, result) {
            if (err) {
              console.log(err);
            } else {
              res.send({"status":1,"message":"success"});
            }
          })
        }
      }
    })
  } else {
    res.redirect("/login");
  }
});

router.get('/subscription', function (req, res) {
  if (req.session.email) {
    db.query("SELECT sh.*,u.name as user_name,p.title as package FROM subscription_history as sh join user u on u.user_pub_id=sh.user_pub_id join package p on p.package_pub_id=sh.package_pub_id", function (err, result) {
      if (result.length == 0) {
        console.log(err)
        res.render('Subscription/subscription', { result: '' });
      } else {
        var result = JSON.parse(JSON.stringify(result));
        res.render('Subscription/subscription', { result: result });
      }
    })
  }
  else {
    res.redirect("/login");
  }
});

router.get('/subscriptionTransHistory', function (req, res) {
  if (req.session.email) {
    db.query("SELECT st.*,u.name as user_name,p.title as package FROM subscription_transactions as st join user u on u.user_pub_id=st.user_pub_id join package p on p.package_pub_id=st.package_pub_id", function (err, result) {
      if (result.length == 0) {
        console.log(err)
        res.render('Subscription/transaction', { result: '' });
      } else {
        var result = JSON.parse(JSON.stringify(result));
        res.render('Subscription/transaction', { result: result });
      }
    })
  }
  else {
    res.redirect("/login");
  }
});


/**Api Keys */
router.get('/api_keys',async function(req, res)
{ 
    if(req.session.email){
      db.query("select * from api_keys where api_name='Firebase'", function (err, firebase) {
        db.query("select * from api_keys where api_name='Mailgun'", function (err, Mailgun) {
          if(firebase == null || firebase == '' || firebase == {} || firebase == undefined){
            firebase = {api_name:'',api_key_1:'',api_key_2:''};
          }else{
            firebase = firebase[0]
          }
          // console.log('Mailgun',Mailgun);
          if(Mailgun == null || Mailgun == '' || Mailgun == {} || Mailgun == undefined){
            Mailgun = {api_name:'',api_key_1:'',api_key_2:''};
          }else{
            Mailgun = Mailgun[0]
          }
          // console.log('Mailgun',Mailgun);
          res.render('api_keys/view',{pageTitle:'Api keys',Mailgun:Mailgun,firebase:firebase});
        });
      });
    }else{
      res.redirect("/login");
    }
});
router.post('/add_update_api_keys', function(req, res)
{ 
    var data = {};
    if(req.session.email){
        // Api_Key.findOne({api_name:req.body.api_name},function(err,result){
        db.query("select * from api_keys where api_name='"+req.body.api_name+"'", function (err, result) {
          if(err){
              data.message = constant.Error_In_Find;
              data.err = err;
              data.status = '0';
              res.status(200).send(JSON.stringify(data));
          }else{
              if(result == null || result == '' || result == undefined || result == []){
                  var Obj = {};
                  Obj.api_name = req.body.api_name;
                  if(req.body.api_key_1)Obj.api_key_1 = req.body.api_key_1;
                  else Obj.api_key_1 = 'NA';
                  if(req.body.api_key_2)Obj.api_key_2 = req.body.api_key_2;
                  else Obj.api_key_2 = 'NA';
                  if(req.body.api_key_3)Obj.api_key_3 = req.body.api_key_3;
                  else Obj.api_key_3 = 'NA';
                  if(req.body.api_key_4)Obj.api_key_4 = req.body.api_key_4;
                  else Obj.api_key_4 = 'NA';
                  // var data = {
                  //   user_pub_id: user_pub_id,
                  //   title: req.body.title,
                  //   msg: req.body.msg,
                  //   type: constant.Broadcast_Notification,
                  //   created_at: (new Date()).valueOf().toString()
                  // }
                  db.query('insert into api_keys set ?', [Obj], function (err) {
                    if (err) {
                      console.log('1830',err);
                      res.json({
                        status:0,
                        message:err
                      })
                    } else {
                      res.json({
                        status:1,
                        message:'Success'
                      })
                    }
                  })
              }else{
                  var Obj = {};
                  Obj.api_name = req.body.api_name;
                  if(req.body.api_key_1)Obj.api_key_1 = req.body.api_key_1;
                  else Obj.api_key_1 = 'NA';
                  if(req.body.api_key_2)Obj.api_key_2 = req.body.api_key_2;
                  else Obj.api_key_2 = 'NA';
                  if(req.body.api_key_3)Obj.api_key_3 = req.body.api_key_3;
                  else Obj.api_key_3 = 'NA';
                  if(req.body.api_key_4)Obj.api_key_4 = req.body.api_key_4;
                  else Obj.api_key_4 = 'NA';
                  var sql = "UPDATE api_keys SET api_key_1=?,api_key_2=?,api_key_3=?,api_key_4=? WHERE api_name=?";
                  var query = db.query(sql, [Obj.api_key_1, Obj.api_key_2, Obj.api_key_3, Obj.api_key_4, Obj.api_name], function (err, result) {
                    if (err) {
                      res.json({
                        status:0,
                        message:err
                      })
                    }
                    else {
                      res.json({
                        status:1,
                        message:'Success'
                      })
                    }
                  });
              }
          }
      })
    }else{
      res.redirect("/login");
    }
});

router.get('/web_services', function(req, res)
{ 
  if(req.session.email){
      res.render('web_service/web_service_list',{pageTitle:'Web Service'});
    }else{
      res.redirect("/login");
    }
});

router.get('/add_language', function(req, res)
{ 
  if(req.session.email){
      db.query("select * from language where status in(0,1)", function (err, result) {
        if(result == null || result == '' || result == undefined)result=[];
        res.render('language/add_language',{result:result});
      })
    }else{
      res.redirect("/login");
    }
});
router.post('/add_update_language', function(req, res)
{ 
    var data = {};
    if(req.session.email){
      if(req.body._id == null || req.body._id == '' || req.body._id == undefined){
          var Obj = {};
          if(req.body.language)Obj.language = req.body.language;
          else Obj.language = 'NA';
          if(req.body.language_code)Obj.language_code = req.body.language_code;
          else Obj.language_code = 'NA';
          Obj.created_at = (new Date()).valueOf().toString()
          db.query('insert into language set ?', [Obj], function (err) {
            if (err) {
              console.log('1830',err);
              res.json({
                status:0,
                message:err
              })
            } else {
              res.json({
                status:1,
                message:'Success'
              })
            }
          })
      }else{
        var Obj = {};
        if(req.body.language)Obj.language = req.body.language;
        else Obj.language = 'NA';
        if(req.body.language_code)Obj.language_code = req.body.language_code;
        else Obj.language_code = 'NA';
          var sql = "UPDATE language SET language=?,language_code=? WHERE id=?";
          var query = db.query(sql, [Obj.language, Obj.language_code, req.body._id], function (err, result) {
            if (err) {
              res.json({
                status:0,
                message:err
              })
            }
            else {
              res.json({
                status:1,
                message:'Success'
              })
            }
          });
      }
    }else{
      res.redirect("/login");
    }
});
router.get('/edit_language', function(req, res)
{ 
  if(req.session.email){
      db.query("select * from language where status in(0,1)", function (err, result) {
        if(result == null || result == '' || result == undefined)result=[];
        db.query("select * from language where id='"+req.query._id+"'", function (err, data) {
          res.render('language/edit_language',{result:result,data:data});
        });
      })
    }else{
      res.redirect("/login");
    }
});
router.post('/update_language_status', function(req, res)
{ 
    if(req.session.email){
          var sql = "UPDATE language SET status=? WHERE id=?";
          db.query(sql, [req.body.status, req.body._id], function (err, result) {
            if (err) {
              res.json({
                status:0,
                message:err
              })
            }
            else {
              res.json({
                status:1,
                message:'Success'
              })
            }
          });
    }else{
      res.redirect("/login");
    }
});

router.get('/payment_gateway', function(req, res)
{ 
  if(req.session.email){
      db.query("select * from payment_gateway where status in(0,1)", function (err, result) {
        db.query("select * from currency_setting where status in(0,1)", function (err, currency) {
        if(currency == null || currency == '' || currency == undefined)currency=[];
        if(result == null || result == '' || result == undefined)result=[];
        res.render('payment_gateway/add',{result:result,currency:currency});
        })
      })
    }else{
      res.redirect("/login");
    }
});

router.post('/get_payment_gateway', function(req, res)
{ 
  if(req.session.email){
      db.query("select * from payment_gateway where title='"+req.body.title+"'", function (err, result) {
        if(result == null || result == '' || result == undefined)result=[];
        res.json({status:'1',result:result});
      })
    }else{
      res.redirect("/login");
    }
});
router.post('/add_update_payment_gateway', function(req, res)
{ 
    var data = {};
    if(req.session.email){
      var currency_id = '';
      for(let i=0; i<req.body.currency.length; i++){
        if(i+1 == req.body.currency.length){
          currency_id +=  ''+req.body.currency[i]+''
        }else{
          currency_id +=  ''+req.body.currency[i]+','
        }
      }
      console.log('currency_id',req.body.currency,currency_id);
      db.query("select * from payment_gateway where title='"+req.body.title+"'", function (err, result) {
        if(result == null || result == '' || result == undefined || result == []){
            var Obj = {};
            Obj.title = req.body.title;
            Obj.description = req.body.description;
            Obj.currency = currency_id;
            if(req.body.api_key_1)Obj.api_key_1 = req.body.api_key_1;
            if(req.body.api_key_2)Obj.api_key_2 = req.body.api_key_2;
            if(req.body.api_key_3)Obj.api_key_3 = req.body.api_key_3;
            if(req.body.api_key_4)Obj.api_key_4 = req.body.api_key_4;
            if(req.body.api_key_5)Obj.api_key_5 = req.body.api_key_5;
            Obj.created_at = (new Date()).valueOf().toString()
            db.query('insert into payment_gateway set ?', [Obj], function (err) {
              if (err) {
                console.log('2330',err);
                res.json({
                  status:0,
                  message:err
                })
              } else {
                res.json({
                  status:1,
                  message:'Success'
                })
              }
            })
        }else{
            var Obj = {};
            Obj.title = req.body.title;
            Obj.description = req.body.description;
            Obj.currency = currency_id;
            if(req.body.api_key_1)Obj.api_key_1 = req.body.api_key_1;
            else Obj.api_key_1 = '';
            if(req.body.api_key_2)Obj.api_key_2 = req.body.api_key_2;
            else Obj.api_key_2 = '';
            if(req.body.api_key_3)Obj.api_key_3 = req.body.api_key_3;
            else Obj.api_key_3 = '';
            if(req.body.api_key_4)Obj.api_key_4 = req.body.api_key_4;
            else Obj.api_key_4 = '';
            if(req.body.api_key_5)Obj.api_key_5 = req.body.api_key_5;
            else Obj.api_key_5 = '';
            Obj.updated_at = (new Date()).valueOf().toString()
            var sql = "UPDATE payment_gateway SET description=?,currency=?,api_key_1=?,api_key_2=?,api_key_3=?,api_key_4=?,api_key_5=?,updated_at=? WHERE title=?";
            db.query(sql, [Obj.description, Obj.currency, Obj.api_key_1, Obj.api_key_2, Obj.api_key_3, Obj.api_key_4, Obj.api_key_5, Obj.updated_at, req.body.title], function (err, result) {
              if (err) {
                res.json({
                  status:0,
                  message:err
                })
              }
              else {
                res.json({
                  status:1,
                  message:'Success'
                })
              }
            });
        }
      })
    }else{
      res.redirect("/login");
    }
});

function sendmail(user_email,subject,msg,next = false)
{
  db.query("select * from api_keys where api_name='Mailgun'", function (err, Mailgun) {
    var api_key = constant.mailgun_api_key;
    var domain = constant.mailgun_domain;
    if(Mailgun == null || Mailgun == '' || Mailgun == {} || Mailgun == undefined){
      api_key = constant.mailgun_api_key//'ef5924af46ea9c61c8e31f5c006ada8b-65b08458-d9013671';
      domain = constant.mailgun_domain //'mg.live2talks.com';
    }else{
      Mailgun = Mailgun[0]
      api_key = Mailgun.api_key_1
      domain = Mailgun.api_key_2
    }
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
    console.log(user_email)
    var data = {
        from: 'info@bakvebul.com', //Fannan <no-reply@fannanapp.com>
        to: user_email,
        subject: subject,
        // text : msg,
        html: msg
        };
        
    mailgun.messages().send(data, function (error, body) {
        if(!error && next){
            console.log(body);
            next(body);
        }else{
            console.log(error);
        }
    });
  })
}
module.exports = router;