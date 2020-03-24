var express = require('express');
var router = express.Router();
var traderModel = require('../models/traderModel')
var userModel = require('../models/userModel')
var customerModel = require('../models/customerModel')
var notificationModel = require('../models/notificationModel')
const nodemailer = require('nodemailer');
const transporter = require('../config/mailconfig');
const constants = require('../config/url');
var clientUrl = constants.clientUrl;
var token = require('../middleware/token');
var templateModel = require('../models/templateModel');
const bcrypt = require('bcrypt');
const async = require('async');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cacheMiddleware = require('../middleware/cache')
const Profile = require('../models/profileModel');

/*  
 users registation api post.
 */
router.post('/trader-registration', function (req, res, next) {
	// host=req.get('host');
	// var link = "http://ec2-13-127-188-236.ap-south-1.compute.amazonaws.com:8080"
	function randomString(length, chars) {
		var result = '';
		for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}
	if (req.body.admin == undefined || req.body.admin == null) {
		req.body.admin = false;
	}
	var rString = randomString(8, '0123456789abcdeXYZ');
	var entry = new traderModel({
		company_name: req.body.company_name,
		registration_name: req.body.registration_name,
		role: req.body.role,
		country_name: req.body.country_name,
		trader_type: req.body.trader_type,
		email: req.body.email,
		phone_number: req.body.phone_number,
		shippingStatus: req.body.shippingStatus,
		register_type: req.body.register_type,
		admin: req.body.admin,

	})
	entry.save(function (err, result) {
		if (err) {
			if (err.code == 11000) {
				res.status(401).send({ message: "duplicateEmail" });
				return;
			}
			res.status(404).send(err);
			return;
		}
		crypto.randomBytes(48, function (err, buf) {
			var cryptotoken = buf.toString('hex');
			let user = new userModel({
				email: result.email,
				password: rString,
				traderId: result._id,
				admin: req.body.admin,
				verifyUserToken: cryptotoken,
				status: false
			})
			user.save(function (err, userInfo) {
				if (err) {
					res.status(404).send(err)
					return;
				}
				else {
					const userProfile = new Profile({
						userName: req.body.registration_name,
						userEmail: req.body.email,
						phone_number: req.body.phone_number,
						userLocation: req.body.country_name,
						trader: result._id,
					})

					userProfile.save()
						.then(() => userProfile.findOne({ userEmail: userProfile.email }))
						.then(() => {

							jwt.sign({ user: userInfo }, 'secret', { expiresIn: '1h' }, (err, token) => {
								if (err) res.sendStatus(400);
								userInfo.userToken = token;
								//Account creating notification
								var entry = new notificationModel({
									traderId: result._id,
									message: 'Your account is created',
									// route : '',
									// read : ,
								});

								entry.save(function (err, doc) {
									if (err) res.status(404).send({ message: "error" })
									else {
										//mail send to trader while creating account
										nodemailer.createTestAccount((err, account) => {
											var mailOptions = {
												from: '"Nicoza " <rxzone@gmail.com>',
												to: req.body.email,
												subject: 'Confirmation for your account',
												css: `a{text-decoration: none;},
										button{    background: rgba(0, 0, 255, 0.78);
										border: none;
										padding: 10px;}`,
												html: `<h3 style="color:blue;">Confirm your email address</h3>
            								<div>Hello <b>${req.body.registration_name}</b>,<br><br>
                      							You recently entered a new email address for the user.<br>
                      							Please confirm your email by clicking on the button below.<br><br>
                     							<a style="display:block" href= ${clientUrl}/#/confirmLogin?link=${cryptotoken}><button style="background-color: #0052CC;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: 30px;border: none;font-size: 17.5px; padding: 5px 10px;-webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);">
                      							Confirm this email address</button></a><br><br>
  												Thanks,<br>
                      							The Nicoza team.<br><br>
  												<p align="center">This message was sent by Nicoza.<p>
                							</div>`
											};
											transporter.sendMail(mailOptions, function (err, information) {
												if (err) {
												}
												let dataobj = {}
												dataobj.userToken = token;
												dataobj.userData = userInfo;
												res.status(200).send(dataobj);
											})
										});
									}
								});
							})
						})

				}
			})
		});
	});
})

router.post('/token', function (req, res, next) {
	let user = req.body;
	userModel.find({ 'email': req.body.email, 'status': true }, function (err, doc) {
		if (err) {
			return res.status(400).send(err);
		}
		if (doc.length == 0) {
			return res.status(400).send({ message: "not found" });
		}
		if (bcrypt.compareSync(req.body.password, doc[0].password)) {
			//creating token for other things
			jwt.sign({ user: user }, 'secret', { expiresIn: '24h' }, (err, token) => {
				res.status(200).send({ email: req.body.email, token: token })
				// res.json({
				//   token:token
				// })
			})


		} else {
			res.status(401).send({ message: "Please Enter Valid Password" })
		}
	});
})
router.post('/checkTokenExpire', function (req, res, next) {
	async.waterfall([
		function (done) {
			userModel.findOne({ resetPasswordToken: req.body.id }, function (err, user) {
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

router.post('/setPassword', function (req, res, next) {
	async.waterfall([function (done) {
		userModel.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
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

router.post('/forgotPasswordEmail', function (req, res) {
	var emailTemplate = '';
	var templateDetails;
	templateModel.find({ txtSubject: 'Reset Password ' }, function (err, template) {
		if (err) { }
		else {
			async.waterfall([
				function (done) {
					crypto.randomBytes(48, function (err, buf) {
						var token = buf.toString('hex');
						done(err, token);
					});
				},
				function (token, done) {
					userModel.findOne({ 'email': req.body.txtEmail }, function (err, user) {
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

					emailTemplate = template[0].txtTemplateText
					templateDetails = template[0];

					nodemailer.createTestAccount((err, account) => {
						// if (emailTemplate != '') {
						emailTemplate = emailTemplate.replace('{{user}}', req.body.txtEmail)
						emailTemplate = emailTemplate.replace('{{clientUrl}}', `<a href= ${clientUrl}/#/setPassword?link=${token}>Set Password</a>`)
						emailTemplate = emailTemplate.replace(/\{|\}/gi, '');
						var mailOptions = {
							from: '"Nicoza " <rxzone@gmail.com>',
							to: req.body.txtEmail,
							subject: templateDetails.txtSubject,
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
											   <center><a href= ${clientUrl}/#/setPassword?link=${token}><button style="background-color: orange;font-family: Montserrat;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: auto;border-radius: 4px;border: none;font-size: 17.5px; padding: 7px 15px;">
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
						// }
						// else {
						// var mailOptions = {
						// 	from: '"Nicoza " <rxzone@gmail.com>',
						// 	to: req.body.txtEmail,
						// 	subject: 'Reset Password',
						// 	css: `a{text-decoration: none;},
						// 		button{    background: rgba(0, 0, 255, 0.78);
						// 		border: none;
						// 		padding: 10px;}`,
						// 	html: `<h3 style="color:blue;">Reset Password</h3>
						// 			<div>Hello ${req.body.txtEmail},<br><br>
						// 				Your Password recreation request has been approved.<br>
						// 				  Kindly set your password by clicking on the button below.<br><br>
						// 				 <a style="display:block" href= ${clientUrl}/#/login/setPassword?link=${token}><button style="background-color: orange;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: 30px;border: none;font-size: 17.5px; padding: 5px 10px;-webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);">
						// 				 Reset Password</button></a><br><br>
						// 				  Thanks,<br>
						// 				  The Nicoza team.<br><br>
						// 				  <p align="center">This message was sent by Nicoza.<p>
						// 			</div>`
						// };
						// }
						transporter.sendMail(mailOptions, function (err, information) {
							if (err) {
							}
							res.status(200).send({ email: req.body.email });
						})
					});
				}])
		}
	})
})

router.get('/getAllBuyer', token, cacheMiddleware(100), function (req, res, next) {
	traderModel.find({ $or: [{ 'trader_type': 'Both' }, { 'trader_type': 'Buyer' }] }).exec(function (err, doc) {
		if (err) {
			res.status(404).send(err);
			return;
		}
		res.status(200).send(doc);
	})
})
router.post('/getBuyerDetails', token, cacheMiddleware(100), function (req, res, next) {
	traderModel.find({ '_id': req.body.buyerId }).exec(function (err, doc) {
		if (err) {
			res.status(404).send(err);
			return;
		}
		res.status(200).send(doc);
	})
})

/*
get user information 
*/
router.get('/userData', token, function (req, res, next) {
	async.parallel([
		function (callback) {
			traderModel.find({ '_id': req.body.traderId }, function (err, doc) {
				if (err) {
					callback(err);
					return
				}
				callback(null, doc);
			})
		},
		function (callback) {
			userModel.find({ '_id': req.body.userId }, function (err, doc) {
				if (err) {
					callback(err);
					return
				}
				callback(null, doc);
			})
		}
	],
		// optional callback
		function (err, results) {
			var obj
			doc = results[0];
			doc.push(results[1][0]);
			res.status(200).send({ doc });
		});
})

/*
after singup 
verify email and set password  1st time using token 
*/
router.post('/confirmLogin', function (req, res, next) {
	async.waterfall([
		function (done) {
			userModel.findOne({ verifyUserToken: req.body.token }, function (err, user) {
				if (!user) {
					return res.status(401).send({ message: "not found" })
				}
				customerModel.find({ 'traderId': user.traderId }).populate([
					{
						path: 'sellerId',
						model: 'trader'
					}
				]).exec((err, customerdata) => {
					if (customerdata.length > 0) {
						customerdata[0].active = true;
						customerdata[0].save(function (err) {
							const salt = bcrypt.genSaltSync(10);
							const hashPass = bcrypt.hashSync(req.body.txtPassword, salt);
							user.password = hashPass;
							user.status = true;
							user.verifyUserToken = undefined;
							user.save(function (err) {
								return res.status(200).send({ message: "success" })
							});
							sendMail(customerdata);
						});
					}
					else {
						const salt = bcrypt.genSaltSync(10);
						const hashPass = bcrypt.hashSync(req.body.txtPassword, salt);
						user.password = hashPass;
						user.status = true;
						user.verifyUserToken = undefined;
						user.save(function (err) {
							return res.status(200).send({ message: "success" })
						});
					}
				})
			});

		},


	], function (err) {
		res.redirect('/');
	});

})
router.post('/checkTokenExpireSignUp', function (req, res, next) {
	async.waterfall([
		function (done) {
			userModel.findOne({ verifyUserToken: req.body.id }, function (err, user) {
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

function sendMail(customerdata) {
	//mail send to trader while customer accept invitation of seller
	nodemailer.createTestAccount((err, account) => {
		var mailOptions = {
			from: '"Nicoza " <rxzone@gmail.com>',
			to: customerdata[0].sellerId.email,
			subject: 'Invitation accepted by Customer',
			css: `a{text-decoration: none;},
			button{    background: rgba(0, 0, 255, 0.78);
			border: none;
			padding: 10px;}`,
			html: `<h3 style="color:blue;">Invitation accepted by Customer</h3>
				<div>Hello <b>${customerdata[0].sellerId.registration_name}</b>,<br><br>
					  The customer <b>${customerdata[0].txtBusinessName}</b> has accepted your invitation.<br>
					  Customer(${customerdata[0].txtBuisnessEmail}) is active to use account on Nicoza.<br><br>
					  Thanks,<br>
					  The Nicoza team.<br><br>
					  <p align="center">This message was sent by Nicoza.<p>
				</div>`
		};
		transporter.sendMail(mailOptions, function (err, information) {
		})
	});
}

router.post('/update-profile',(req, res, next)=>{
	console.log('req body of update', req.body);


})

module.exports = router;
