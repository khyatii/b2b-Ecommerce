const express = require('express'),
    router = express.Router(),
    token = require('../middleware/token'),
    nodemailer = require('nodemailer'),
    transporter = require('../config/mailconfig'),
    traderModel = require('../models/traderModel'),
    teamMemberModel = require('../models/teamMemberModel'),
    userModel = require('../models/userModel'),
    async = require('async'),
    crypto = require('crypto'),
    md5 = require('md5'),
    multer = require('multer'),
    obj = require('./module');
    const constants = require('../config/url');
var clientUrl=constants.clientUrl;

var DIR = './uploads/';
var upload = multer({ dest: DIR }).single('photo');
var serverUrl = require('../config/url').serverUrl;


router.post('/add', token, function (req, res) {
    traderModel.find({ '_id': req.body.traderId }, function (err, result) {
        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }
        var rString = randomString(8, '0123456789abcdeXYZ');
        crypto.randomBytes(48, function (err, buf) {
            var token = buf.toString('hex');
            let user = new userModel({
                email: req.body.email,
                password: rString,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                traderId: req.body.traderId,
                admin: req.body.admin,
                verifyUserToken: token,
                status: false
            })
            user.save(function (err, doc) {
                if (err) {
                    res.status(404).send(err);
                    return;
                }
                //mail send to trader while creating account
                nodemailer.createTestAccount((err, account) => {
                    var mailOptions = {
                        from: '"Nicoza " <rxzone@gmail.com>',
                        to: req.body.email,

                        subject: 'Invitation Instructions',
                        css: `a{text-decoration: none;},
                                        button{    background: rgba(0, 0, 255, 0.78);
                                        border: none;
                                        padding: 10px;}`,
                        html: `<h3 style="color:blue;">You have been invited</h3>
                                <div>Hello <b>${req.body.firstName}</b>,<br><br>
                                    You've been invited by ${result[0].registration_name} to join the Nicoza account for ${result[0].company_name}.<br>
                                    Nicoza is an online inventory and sales management platform that helps companies streamline their backend operations.<br><br>
                                    <a style="display:block" href= ${clientUrl}/#/login/confirmLogin?link=${token}><button style="background-color: #0052CC;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: 30px;border: none;font-size: 17.5px; padding: 5px 10px;-webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);">
                                    Join your Team</button></a><br><br>
                                    Thanks,<br>
                                    The Nicoza team.<br><br>
                                    <p align="center">This message was sent by Nicoza.<p>
                                </div>`
                    };
                    transporter.sendMail(mailOptions, function (err, information) {
                        if (err) {
                        }
                        res.status(200).send({ message: "success" });
                    })
                });
            })
        })
    })
})

router.get('/getTeamMember', token, function (req, res, next) {
    userModel.find({ $and: [{ 'traderId': req.body.traderId }, { 'admin': { $ne: true } }] }, function (err, doc) {

        if (err) {
            res.status(404).send(err)
            return
        }
        if (doc.length == 0) {
            res.status(404).send({ message: "not found" })
            return
        }
        res.status(200).send(doc)
    })
})

router.post('/getOne', token, function (req, res, next) {
    userModel.find({ '_id': req.body._id }, function (err, doc) {
        if (err) {
            res.status(404).send(err)
            return
        }
        if (doc.length == 0) {
            res.status(404).send({ message: "not found" })
            return
        }
        res.status(200).send({ doc })
    })
})

router.post('/updateOne', token, function (req, res, next) {

    userModel.updateMany({ '_id': req.body._id }, {
        $set: {
            txtPhone: req.body.txtPhone,
            txtFax: req.body.txtFax,
            txtPostalAddress: req.body.txtPostalAddress,
            txtPhysicalAddress: req.body.txtPhysicalAddress,
            txtPaymentDetails: req.body.txtPaymentDetails,
            txtID: req.body.txtID,
            txtTaxNumber: req.body.txtTaxNumber,
            txtDob: req.body.txtDob,
            txtUsername: req.body.txtUsername,
            txtInventoryPermission: req.body.txtInventoryPermission,
            txtCustomerManagement: req.body.txtCustomerManagement,
            VendorsPermission: req.body.VendorsPermission,
            PurchaseOrderPermission: req.body.PurchaseOrderPermission,
            SalesOrderPermission: req.body.SalesOrderPermission,
            txtStockPermission: req.body.txtStockPermission,
            txtReportsPermission: req.body.txtReportsPermission,
            txtSettingsPermission: req.body.txtSettingsPermission,
            txtLogisticsPermission: req.body.txtLogisticsPermission,
        }
    }, function (err, doc) {
        if (err) {
            res.status(404).send(err)
            return
        }
        if (doc.length == 0) {
            res.status(404).send({ message: "not found" })
            return
        }

        res.status(200).send({ doc })

    })
})

router.post('/updatePhoto', token, function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            res.status(404).send("an Error occured")
            return
        }
        // No error occured.
        var sampleFile = req.files.photo;
        if (sampleFile.length == undefined) {
            sampleFile = [sampleFile]
        }
        var isdefault;
        sampleFile.forEach((element, index) => {

            element.mv(`uploads/${element.name}`, function (err) {
                if (err) {
                    res.status(404).send("an Error occured")
                    return

                }
                userModel.update({ '_id': req.query.id },
                    { "photo": `${serverUrl}/uploads/${element.name}` }, function (err, docs) {
                        if (err) {
                            res.status(404).send("err")
                            return
                        }
                        res.status(200).send({ message: "success" })
                    })
            });
        })
    });
})
module.exports = router;