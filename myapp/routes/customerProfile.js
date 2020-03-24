var express = require('express');
var router = express.Router();
var traderModel = require('../models/traderModel')
var userModel = require('../models/userModel')
var customerModel = require('../models/customerModel')
var customerGroupModel = require('../models/customerGroupModel')
var productModel = require('../models/productModel')
var productSellerModel = require('../models/productSellerModel')
var mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const transporter = require('../config/mailconfig');
const constants = require('../config/url');
var clientUrl = constants.clientUrl;
var token = require('../middleware/token');
const crypto = require('crypto');

/* GET users listing. */
router.post('/save', token, function (req, res, next) {
    // var link="http://ec2-13-127-188-236.ap-south-1.compute.amazonaws.com:8080"

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
        company_name: req.body.txtBusinessName,
        registration_name: req.body.txtBusinessName,
        role: 'CEO',
        country_name: req.body.country_name,
        trader_type: req.body.txtTraderType,
        email: req.body.txtBuisnessEmail,
        phone_number: req.body.phone_number,
        register_type: 'trader',
    })
    entry.save(function (err, result) {
        if (err) {
            if (err.code == 11000) {
                res.status(401).send({ message: "duplicateEmail" });
            }
            res.status(404).send(err);
        }
        crypto.randomBytes(48, function (err, buf) {
            var verifytoken = buf.toString('hex');
            let user = new userModel({
                email: result.email,
                password: rString,
                traderId: result._id,
                admin: req.body.admin,
                verifyUserToken: verifytoken,
                status: false,
                referEmail: req.body.traderEmail
            })
            user.save(function (err, userInfo) {
                if (err) {
                    res.status(404).send(err)
                }
                var entry = new customerModel({
                    txtBusinessName: req.body.txtBusinessName,
                    txtBuisnessEmail: req.body.txtBuisnessEmail,
                    txtTraderType: req.body.txtTraderType,
                    txtBuisnessPhone: req.body.phone_number,
                    txtContactName: req.body.txtContactName,
                    txtContactEmail: req.body.txtContactEmail,
                    txtPostalAdress: req.body.txtPostalAdress,
                    txtPhysicalAddress: req.body.txtPhysicalAddress,
                    txtWebsite: req.body.txtWebsite,
                    txtPhone: req.body.txtPhone,
                    traderId: result._id,
                    sellerId: req.body.traderId
                })

                entry.save(function (err, doc) {
                    if (err) {
                        res.status(404).send(err);
                    }
                    else {
                        if (req.body.txtCustomerGroup == '' || req.body.txtCustomerGroup == undefined) {
                            nodemailer.createTestAccount((err, account) => {
                                var mailOptions = {
                                    from: '"Nicoza " <rxzone@gmail.com>',
                                    to: result.email,
                                    subject: 'Confirmation for your account',
                                    css: `a{text-decoration: none;},
										button{    background: rgba(0, 0, 255, 0.78);
										border: none;
										padding: 10px;}`,
                                    html: `<h3 style="color:blue;">Confirm your email address</h3>
            								<div>Hello <b>${req.body.txtBusinessName}</b>,<br><br>
                      							You recently entered a new email address for the user.<br>
                      							Please confirm your email by clicking on the button below.<br><br>
                     							<a style="display:block" href= ${clientUrl}/#/confirmLogin?link=${verifytoken}><button style="background-color: #0052CC;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: 30px;border: none;font-size: 17.5px; padding: 5px 10px;-webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);">
                      							Confirm this email address</button></a><br><br>
  												Thanks,<br>
                      							The Nicoza team.<br><br>
  												<p align="center">This message was sent by Nicoza.<p>
                							</div>`
                                };

                                transporter.sendMail(mailOptions, function (err, information) {
                                    if (err) { }
                                    res.status(200).send(result);
                                })
                            });
                        }
                        else {
                            var length = req.body.txtCustomerGroup.length;
                            var groupArray = req.body.txtCustomerGroup;

                            if (length == 0) {
                                res.status(404).send({ message: "notFound" });
                            }
                            else {
                                groupArray.forEach(function (element, index) {
                                    customerModel.update({ '_id': doc._id },
                                        { $push: { 'txtCustomerGroup': { groupId: element } } }, function (err, docs) {
                                            if (err) {
                                                res.status(500).send("err")
                                            }
                                            if (index != groupArray.length - 1) {
                                                nodemailer.createTestAccount((err, account) => {
                                                    var mailOptions = {
                                                        from: '"Nicoza " <rxzone@gmail.com>',
                                                        to: result.email,
                                                        subject: 'Confirmation for your account',
                                                        css: `a{text-decoration: none;},
                                                            button{    background: rgba(0, 0, 255, 0.78);
                                                            border: none;
                                                            padding: 10px;}`,
                                                        html: `<h3 style="color:blue;">Confirm your email address</h3>
                                                                <div>Hello <b>${req.body.txtBusinessName}</b>,<br><br>
                                                                      You recently entered a new email address for the user.<br>
                                                                      Please confirm your email by clicking on the button below.<br><br>
                                                                     <a style="display:block" href= ${clientUrl}/#/confirmLogin?link=${verifytoken}><button style="background-color: #0052CC;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: 30px;border: none;font-size: 17.5px; padding: 5px 10px;-webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);">
                                                                      Confirm this email address</button></a><br><br>
                                                                      Thanks,<br>
                                                                      The Nicoza team.<br><br>
                                                                      <p align="center">This message was sent by Nicoza.<p>
                                                                </div>`
                                                    };

                                                    transporter.sendMail(mailOptions, function (err, information) {
                                                        if (err) {
                                                        }

                                                    })

                                                });
                                            }
                                            if (index == groupArray.length - 1) {
                                                nodemailer.createTestAccount((err, account) => {
                                                    var mailOptions = {
                                                        from: '"Nicoza " <rxzone@gmail.com>',
                                                        to: result.email,
                                                        subject: 'Confirmation for your account',
                                                        css: `a{text-decoration: none;},
                                                            button{    background: rgba(0, 0, 255, 0.78);
                                                            border: none;
                                                            padding: 10px;}`,
                                                        html: `<h3 style="color:blue;">Confirm your email address</h3>
                                                                <div>Hello <b>${req.body.txtBusinessName}</b>,<br><br>
                                                                      You recently entered a new email address for the user.<br>
                                                                      Please confirm your email by clicking on the button below.<br><br>
                                                                     <a style="display:block" href= ${clientUrl}/#/confirmLogin?link=${verifytoken}><button style="background-color: #0052CC;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: 30px;border: none;font-size: 17.5px; padding: 5px 10px;-webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);">
                                                                      Confirm this email address</button></a><br><br>
                                                                      Thanks,<br>
                                                                      The Nicoza team.<br><br>
                                                                      <p align="center">This message was sent by Nicoza.<p>
                                                                </div>`
                                                    };
                                                    transporter.sendMail(mailOptions, function (err, information) {
                                                        if (err) {
                                                        }
                                                        res.status(200).send(result);
                                                    })
                                                });
                                            }
                                        })
                                }, this);
                            }
                        }
                    }
                })
            });
        });
    });
})
router.post('/saveExisting', token, function (req, res, next) {
    customerModel.find({ "txtBuisnessEmail": req.body.txtBuisnessEmail }, function (err, doc) {
        if (err) {
            res.status(404).send(err);
        }
        else {
            customerGroupModel.findOne({ '_id': req.body.txtCustomerGroup }, function (err, docs) {
                if (err) {
                    res.status(404).send(err)
                } else {
                    const value = doc[0]._id;
                    if ((docs.member.some(item => item.CustomerId == value)) === false) {
                        docs.member.push({ "CustomerId": value });
                        docs.save(function (err) {
                            return res.status(200).send(docs)
                        });
                    }
                }
            })
        }
    })
})

router.post('/searchSupplier', token, function (req, res) {
    productModel.find({ 'txtProductName': req.body.txtProductName }, function (err, docs) {
        if (err) {
            res.status(404).send({ message: "error" })
        } else {
            var productIdArray = docs.map(function (item) {
                return item._id;
            });
            let query = {
                'productId': { $in: productIdArray }
            };
            if (req.body.txtCurrency != '' && req.body.txtCurrency != undefined && req.body.txtCurrency != null) query['txtCurrency'] = req.body.txtCurrency;
            if (req.body.txtMinPriceRange != 0)
                query['txtPrice'] = { $gte: req.body.txtMinPriceRange, $lte: req.body.txtMaxPriceRange }
            productSellerModel.find(query).populate([
                {
                    path: 'productId',
                    model: 'product'
                },
                {
                    path: 'traderId',
                    model: 'trader'
                },
                {
                    path: 'txtStorageLocation',
                    model: 'inventoryLocation',
                    match: {
                        country: req.body.txtCountry,
                    }
                },
            ]).exec(function (err, doc) {
                if (err) {
                    res.status(404).send({ message: "error" })
                }
                else {
                    result = doc.filter(function (user) {
                        return user.productId;
                    });
                    res.status(200).send(result);
                }
            })
        }
    })
})

router.get('/getAll', token, function (req, res, next) {
    customerModel.find({ 'sellerId': req.body.traderId }).exec(function (err, doc) {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).send(doc);
    })
})
router.get('/getActiveCustomer', token, function (req, res, next) {
    customerModel.find({ 'sellerId': req.body.traderId, 'active': true }, function (err, doc) {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).send(doc);
    })
})
router.post('/getCustomerDetails', token, function (req, res, next) {
    customerModel.find({ '_id': req.body.buyerId }).exec(function (err, doc) {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).send(doc);
    })
})


router.post('/getAllFromGroup', token, function (req, res, next) {
    customerGroupModel.find({ '_id': req.body.groupId }).populate('member.CustomerId').exec(function (err, doc) {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).send(doc);
    })
})

router.post('/getOne', token, function (req, res, next) {
    customerModel.find({ '_id': req.body._id }, function (err, doc) {
        if (err) {
            res.status(404).send(err);
            return;
        }
        res.status(200).send(doc);
    })
})

router.post('/modify', token, function (req, res, next) {
    customerModel.update({ '_id': req.body._id }, {
        '$set': {
            txtBusinessName: req.body.txtBusinessName,
            txtBuisnessEmail: req.body.txtBuisnessEmail,
            txtTraderType: req.body.txtTraderType,
            txtBuisnessPhone: req.body.txtBuisnessPhone,
            txtContactName: req.body.txtContactName,
            // txtCustomerGroup:req.body.txtCustomerGroup,
            txtContactEmail: req.body.txtContactEmail,
            txtPostalAdress: req.body.txtPostalAdress,
            txtPhysicalAddress: req.body.txtPhysicalAddress,
            txtWebsite: req.body.txtWebsite,
            txtPhone: req.body.txtPhone,
        }
    }, function (err, doc) {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).send({ message: "success" })
    })
})

router.post('/addToGroup', token, function (req, res, next) {

    customerGroupModel.update({ '_id': req.body._id }, {
        '$set': {
            name: req.body.name,
            member: req.body.member,
            status: req.body.status,
            traderId: req.body.traderId,
        }
    }, function (err, doc) {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).send({ message: "success" })
    })

})

module.exports = router;
