const express = require('express'),
  router = express.Router(),
  logisticsModel = require('../models/logisticsPofileModel'),
  notificationModel = require('../models/notificationModel'),
  logisticsUnitsModel = require('../models/logisticsUnitsModel'),
  logisticServiceType = require('../models/logisticServiceTypeModel'),
  logisticsTypeModel = require('../models/logisticsTypeModel'),
  logisticToken = require('../middleware/logisticToken'),
  logisticsUser = require('../models/logisticsPofileModel'),
  token = require('../middleware/token'),
  nodemailer = require('nodemailer'),
  transporter = require('../config/mailconfig'),
  bcrypt = require('bcrypt'),
  async = require('async'),
  crypto = require('crypto'),
  constants = require('../config/url'),
  clientUrl = constants.clientUrl,
  jwt = require('jsonwebtoken');

/* Logistic user Singup api post request. */
router.post('/logistics-registration', function (req, res, next) {
  function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  var rString = randomString(8, '0123456789abcdeXYZ');
  var LogistcType = req.body.logistics_type;
  if (LogistcType.length === 1) {
    logisticsType_multiple = false
  } else {
    logisticsType_multiple = true
  }

  crypto.randomBytes(48, function (err, buf) {
    var token = buf.toString('hex');
    let user = new logisticsModel({
      company_name: req.body.company_name,
      registration_name: req.body.registration_name,
      role: req.body.role,
      country_name: req.body.country_name,
      country: req.body.country,
      trader_type: req.body.trader_type,
      email: req.body.email,
      phone_number: req.body.phone_number,
      logistics_type: LogistcType,
      service: req.body.service,
      type: req.body.type,
      logistics_type_multiple: logisticsType_multiple,
      password: rString,
      verifyUserToken: token,
      status: false,
    })

    user.save(function (err, userInfo) {
      if (err) {
        if (err.code == 11000) {
          res.status(401).send({ message: "duplicateEmail" });
          return;
        }
        res.status(404).send(err);
        return;
      }
      else {
        var entry = new notificationModel({
          traderId: userInfo._id,
          message: 'Your account is created',
        });
        entry.save(function (err, doc) {
          if (err) res.status(404).send({ message: "error" })
          else {
            /*mail send to LogisticUser while creating account*/
          	nodemailer.createTestAccount((err, account) => {
              var mailOptions = {
                from: '"Nicoza " <rxzone@gmail.com>',
                to: req.body.email,
                subject: 'Confirmation for your account',
                attachments: [{
                  filename: 'logo.png',
                  path: clientUrl + '/assets/logo/logo.png',
                  cid: 'abcdse@gm.com' //same cid value as in the html img src
                }],
                html: `<div class="container" style="font-family: Montserrat;font-size: 17px;">
										<div class="row" style="margin-top:1em;width: calc(50% + 150px); margin: auto">
										   <div class="col-lg-2 col-sm-1 col-xs-1"></div>
										   <div class="col-lg-8 col-sm-10 col-xs-10" style="">
											 <center><img src="cid:abcdse@gm.com" style="width: 90px;margin-top:1em;"/></center>
											 <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
											 <div>
											   <p>Hello ${req.body.registration_name},</p>
											   <p style="line-height: 1.2">
											   You recently entered a new email address for the user.<br>
											   Please confirm your email by clicking on the button below:</p><br>
											   <center><a href= ${clientUrl}/#/confirmLogisticLogin?link=${token}><button style="background-color: orange;font-family: Montserrat;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: auto;border-radius: 4px;border: none;font-size: 17.5px; padding: 7px 15px;">
											   Confirm my email</button></a></center>
											   <p style="margin-top: 1em;">Thank you,</p>
											   <p>The Nicoza Team</p>
											 </div>
											 <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
											 <center style="margin-top:2em; line-height: 1.2;font-size:13px">
											 <p style="margin:0">
											 <span style="display:inline-flex;padding-right:140px;">Contact</span>
											 <span>Privacy Policy</span></p>
											 	<p>This message was sent by Nicoza</p>
												<img src="cid:abcdse@gm.com" style="width: 50px;">
											 </center>
										   </div>
										  <div class="col-lg-2 col-sm-1 col-xs-1"></div>
										  </div>
										 </div>`
              };
              transporter.sendMail(mailOptions, function (err, information) {
                if (err) { }
                res.status(200).send(userInfo);
              })
            });
          }
        });
      }
    })
  });
});
/*
after signup verfity email with token  
*/
router.post('/confirmLogisticLogin', function (req, res, next) {
  async.waterfall([
    function (done) {
      logisticsModel.findOne({ verifyUserToken: req.body.token }, function (err, user) {
        if (!user) {
          return res.status(401).send({ message: "not found" })
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(req.body.txtPassword, salt);
        user.password = hashPass;
        user.status = true;
        user.verifyUserToken = undefined;
        user.save(function (err) {
          return res.status(200).send({ message: "success" })
        });
      });
    },
  ], function (err) {
    res.redirect('/');
  });

})

/*
login api  for logistic user 
*/
router.post('/loginToken', function (req, res, next) {
  logisticsModel.find({ 'email': req.body.email, 'status': true }, function (err, doc) {
    if (!doc) {
      return res.status(400).send(err);
    }
    if (doc.length == 0) {
      return res.status(400).send({ message: "notfound" });
    }
    if (bcrypt.compareSync(req.body.password, doc[0].password)) {
      jwt.sign({ user: req.body }, 'secret1', { expiresIn: '24h' }, (eror, token) => {
        if (eror) {
          res.status(400).send(eror);
        }
        res.status(200).send({ email: req.body.email, token: token });
      })
    }
    else {
      res.status(401).send({ message: "Please Enter Valid Password" })
    }
  });
});

/*
user information 
*/
router.get('/logisticData', logisticToken, function (req, res, next) {
  logisticsModel.find({ '_id': req.body.logisticsId }, function (err, doc) {
    if (err) {
      return res.status(404).send(err)
    }
    res.status(200).send(doc)
  })
})



router.post('/checkTokenExpireLogistic', function (req, res, next) {
  async.waterfall([
    function (done) {
      logisticsModel.findOne({ resetPasswordToken: req.body.id }, function (err, user) {
        if (!user) {
          return res.status(401).send({ message: "not found" })
        }
        else {
          return res.status(200).send({ message: "Password token has not expired" });
        }
      });
    },
  ], function (err) {
    res.redirect('/');
  });
})
/*
sert password after forgate mail send  
*/
router.post('/setPassword', function (req, res, next) {
  async.waterfall([function (done) {
    logisticsModel.findOne({ resetPasswordToken: req.body.logisticsId, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
      if (!user) {
        return res.status(401).send({ message: "not found" })
      }
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(req.body.txtPassword, salt);
      user.password = hashPass;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.save(function (err) {
        return res.status(200).send({ message: "success" })
      });
    });
  },
  ], function (err) {
    res.redirect('/');
  });
})
/*
forgate  passwrod  
*/
router.post('/forgotPasswordLogistic', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(48, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      logisticsModel.findOne({ 'email': req.body.txtEmail }, function (err, user) {
        if (!user) {
          return res.status(404).send(err)
        }
        if (user.length == 0) {
          res.status(404).send({ message: "NotFound" })
          return;
        }
        user.resetPasswordToken = token;

        user.resetPasswordExpires = Date.now() + 1800000; // 30 min
        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      nodemailer.createTestAccount((err, account) => {
        var mailOptions = {
          from: '"Nicoza " <rxzone@gmail.com>',
          to: req.body.txtEmail,
          subject: 'Reset Password',
          attachments: [{
            filename: 'logo.png',
            path: clientUrl + '/assets/logo/logo.png',
            cid: 'abcdse@gm.com' //same cid value as in the html img src
          }],
          html: `<div class="container" style="font-family: Montserrat;font-size: 17px;">
                <div class="row" style="margin-top:1em;width: calc(50% + 150px); margin: auto">
                   <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                   <div class="col-lg-8 col-sm-10 col-xs-10" style="">
                   <center><img src="cid:abcdse@gm.com" style="width: 90px;margin-top:1em;"/></center>
                   <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                   <div>
                     <p>Hello ${req.body.txtEmail},</p>
                     <p style="line-height: 1.2">We have received a request to reset the password.<br><br>
                     Your Password recreation request has been approved.<br>
                       Kindly set your password by clicking on the button below:</p><br>
                     <center><a href= ${clientUrl}/#/setPasswordLogistics?link=${token}><button style="background-color: orange;font-family: Montserrat;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: auto;border-radius: 4px;border: none;font-size: 17.5px; padding: 7px 15px;">
                     Restore Password</button></a></center>
                     <p style="margin-top: 1em;">Thank you,</p>
                     <p>The Nicoza Team</p>
                   </div>
                   <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                   <center style="margin-top:2em; line-height: 1.2;font-size:13px">
                   <p style="margin:0">
                   <span style="display:inline-flex;padding-right:140px;">Contact</span>
                   <span>Privacy Policy</span></p>
                     <p>This message was sent by Nicoza</p>
                    <img src="cid:abcdse@gm.com" style="width: 50px;">
                   </center>
                   </div>
                  <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                  </div>
                 </div>`
        };
        transporter.sendMail(mailOptions, function (err, information) {
          if (err) { }
          res.status(200).send({ email: req.body.email });
        })
      });
    }]
  )
})



/*
check token expire information 
*/
router.post('/checkTokenExpireSignUp', function (req, res, next) {
  async.waterfall([
    function (done) {
      logisticsModel.findOne({ verifyUserToken: req.body.id }, function (err, user) {
        if (!user) {
          return res.status(401).send({ message: "not found" })
        }
        else {
          return res.status(200).send({ message: "Password token has not expired" });
        }
      });
    },
  ], function (err) {
    res.redirect('/');
  });

})
function logUnit(req, res) {
  var items = req.body.items;
  var unitArray = items.map(function (item) {
    return item.unit;
  });
  if (unitArray.length >= 1) {
    unitArray.forEach(function (element, index) {
      if (index != unitArray.length - 1) {
        let entry = new logisticsUnitsModel({
          logistics_type: req.body.type,
          unit: element,
          traderId: req.body.traderId,
        })
        entry.save(function (err, doc) {
          if (err) {
            return res.status(404).send(err);
          }
          else { }
        })
      }
      if (index == unitArray.length - 1) {
        let entry = new logisticsUnitsModel({
          logistics_type: req.body.type,
          unit: element,
          traderId: req.body.traderId,
        })
        entry.save(function (err, doc) {
          if (err) {
            return res.status(404).send(err);
          }
          else {
            return res.status(200).send(doc);
          }
        })
      }
    })
  }
}




router.post('/addLogisticsUnits', token, function (req, res, next) {
  var items = req.body.items;
  var units = items.map(function (item) { return item.unit; });
  logisticsUnitsModel.find({ "unit": { $in: units } }, function (err, data) {
    if (data.length != 0) {
      return res.status(400).send("errro");
    } else {
      return logUnit(req, res);
    }
  });
});


router.post('/getLogisticsUnit', token, function (req, res, next) {
  logisticsUnitsModel.find({ 'logistics_type': req.body.type }, function (err, doc) {
    if (err) {
      return res.status(404).send(err);
    }
    res.status(200).send(doc)
  })
})

router.post('/deleteUnits', token, function (req, res) {
  logisticsUnitsModel.deleteOne({ '_id': req.body.id }, function (err, cat) {
    if (err) {
      res.status(404).send("something went wrong");
    } else {
      res.status(200).send(cat)
    }
  })
})

//Logsitic Service Type Api To post data from root admin
router.post('/addServiceType', token, (req, res) => {
  var serviceType = req.body.service_type.trim();
  var serviceName = req.body.service_name.trim();
  logisticServiceType.find({ 'service_type': serviceType, 'service_name': serviceName, 'logistics_type': req.body.logistics_type }, (err, data) => {
    if (err) {
      res.status(401).send("Logistic Type Error");
    } else if (data.length !== 0) {
      res.status(409).send("Already Logistic Type exist");

    } else {
      let entry = new logisticServiceType({
        service_type: serviceType,
        service_name: serviceName,
        logistics_type: req.body.logistics_type,
        traderId: req.body.traderId,
      });
      entry.save((err, data) => {
        if (err) {
          res.status(401).send("data is not valid");
        }
        res.status(200).send(data);
      })
    }
  })
});

//Logsitic Service Type Api To GET  data from root admin
router.get('/getService', token, (req, res) => {
  logisticServiceType.find({ "traderId": req.body.traderId }, (err, data) => {
    if (err) {
      res.status(404).send("error");
    } else {
      res.status(200).send(data)
    }
  });
});

//to get on bases of logistics type selected
router.post('/getServiceType', (req, res) => {
  var logisticsType = {};
  logisticServiceType.find({ 'logistics_type': req.body.logistics_type }, (err, data) => {
    if (err) {
      res.status(404).send("error");
    } else {
      array = data.filter(function (currentObject) {
        if (currentObject.service_type in logisticsType) {
          return false;
        } else {
          logisticsType[currentObject.service_type] = true;
          return true;
        }
      });
      res.status(200).send(array);
    }
  });
});

//Logsitic Service Type Api To GET by id
router.post('/getOneServiceType', function (req, res) {
  logisticServiceType.find({ '_id': req.body._id }, function (err, doc) {
    if (err) {
      res.status(404).send({ message: "error" });
    } else {
      res.status(200).send(doc)
    }
  })
})

//Logsitic Service Type Api To Update
router.post('/logisticTypeUpdate', token, (req, res) => {
  var serviceType = req.body.service_type.trim();
  var serviceName = req.body.service_name.trim();
  logisticServiceType.find({ 'service_type': serviceType, 'service_name': serviceName, 'logistics_type': req.body.logistics_type }, function (err, doc) {
    if (doc.length != 0) {
      res.status(409).send("already Available")
    } else {
      logisticServiceType.update({ '_id': req.body._id }, {
        '$set': {
          'service_type': serviceType,
          'service_name': serviceName,
          'logistics_type': req.body.logistics_type
        }
      }, function (err, doc) {
        if (err) {
          res.status(404).send("something went to wrong");
        } else {
          res.status(200).send({ message: "Successfully Update Service Type" })
        }
      })
    }
  })
});

router.post('/deleteServiceType', token, function (req, res) {
  logisticServiceType.deleteOne({ '_id': req.body.id }, function (err, cat) {
    if (err) {
      res.status(404).send("something went wrong");
    } else {
      res.status(200).send(cat)
    }
  })
})

router.post('/getMultipleType', (req, res) => {
  var seenNames = {};
  logisticServiceType.find({ 'logistics_type': { $in: req.body } }, (err, data) => {
    if (err) {
      res.status(401).send("data not found")
    }
    var Logisticdata = data;
    array = Logisticdata.filter(function (currentObject) {
      if (currentObject.service_type in seenNames) {
        return false;
      } else {
        seenNames[currentObject.service_type] = true;
        return true;
      }
    });
    res.status(200).send(array)
  })
})

router.post('/getName', (req, res) => {
  var seenNames = {};
  logisticServiceType.find({ 'service_type': req.body }, (err, data) => {
    if (err) {
      res.status(401).send("data not found")
    } else {
      var Logisticdata = data;
      array = Logisticdata.filter(function (currentObject) {
        if (currentObject.service_name in seenNames) {
          return false;
        } else {
          seenNames[currentObject.service_name] = true;
          return true;
        }
      });
      res.status(200).send(array)
    }
  })
});

router.get('/getTypes', (req, res) => {
  logisticsTypeModel.find({}, function (err, Logidoc) {
    if (err) {
      return res.status(404).send(err)
    }
    else {
      res.status(200).send(Logidoc)
    }
  })

});
//Logistics types when login
router.get('/getLogisticTypes', logisticToken, (req, res) => {
  logisticsModel.find({ '_id': req.body.logisticsId }, function (err, Logidoc) {
    if (err) {
      return res.status(404).send(err)
    }
    else {
      res.status(200).send(Logidoc)
    }
  })
});

//Logistics Types Apis for add/view/modify/delete
router.post('/addLogisticType', token, (req, res) => {
  var logisticsType = req.body.logistics_type.trim();
  logisticsTypeModel.find({ 'logistics_type': logisticsType }, (err, data) => {
    if (err) {
      res.status(401).send("Logistic Type Error");
    } else if (data.length !== 0) {
      res.status(409).send("Already Logistic Type exist");

    } else {
      let entry = new logisticsTypeModel({
        logistics_type: logisticsType,
        traderId: req.body.traderId,
      });
      entry.save((err, data) => {
        if (err) {
          res.status(401).send("data is not valid");
        }
        res.status(200).send(data);
      })
    }
  })
});

router.get('/getLogisticsTypes', token, (req, res) => {
  logisticsTypeModel.find({ "traderId": req.body.traderId }, (err, data) => {
    if (err) {
      res.status(404).send("error");
    } else {
      res.status(200).send(data)
    }
  });
});

router.post('/deleteLogisticsType', token, function (req, res) {
  logisticsTypeModel.deleteOne({ '_id': req.body.id }, function (err, cat) {
    if (err) {
      res.status(404).send("something went wrong");
    } else {
      res.status(200).send(cat)
    }
  })
})

router.post('/getOneLogisticsType', function (req, res) {
  logisticsTypeModel.find({ '_id': req.body._id }, function (err, doc) {
    if (err) {
      res.status(404).send({ message: "error" });
    } else {
      res.status(200).send(doc)
    }
  })
})

//Logsitic Service Type Api To Update
router.post('/modifyLogisticsType', token, (req, res) => {
  var logisticsType = req.body.logistics_type.trim();
  logisticsTypeModel.find({ 'logistics_type': logisticsType }, function (err, doc) {
    if (doc.length != 0) {
      res.status(409).send("already Available")
    } else {
      logisticsTypeModel.update({ '_id': req.body._id }, {
        '$set': {
          'logistics_type': logisticsType
        }
      }, function (err, doc) {
        if (err) {
          res.status(404).send("something went to wrong");
        } else {
          res.status(200).send({ message: "Successfully Update Service Type" })
        }
      })
    }
  })
});

//gets multiple logistic services based on names
router.post('/getMultipleServices', (req, res) => {
  let logisticTypes = req.body
  logisticServiceType.find({ logistics_type: { $in: logisticTypes } }).exec()
    .then(services => {
      res.status(200).json({
        message: 'fond services',
        services: services,
      })
    })
    .catch(err => {
      res.status(400).json({
        message: 'could not find services',
        errmsz: err,
      })
    })
})

//logistic serch based on user input
router.post('/searchLogistic', (req, res) => {
  let serviceNames = req.body.txtServiceName;
  let country = req.body.txtCountry;
  let logisticName = req.body.txtLogisticsService;

  logisticsUser.find({ service: { $in: serviceNames }, country_name: country, logistics_type: logisticName }).exec()
    .then(resp => {
      res.status(200).json({
        message: 'found logistic users',
        data: resp
      })
    }).catch(err => {
      res.status(400).json({
        message: 'some error occured',
        error: err
      })
    })
})

module.exports = router;
