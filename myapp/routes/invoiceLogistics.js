var express = require('express');
var router = express.Router();
const token = require('../middleware/token');
const logisticToken = require('../middleware/logisticToken');
const invoiceLogisticsModel = require('../models/invoiceLogisticsModel');
const invoiceLogisticsDetailsModel = require('../models/invoiceLogisticsDetailsModel');
const invoiceLogisticsPaymentModel = require('../models/invoiceLogisticsPaymentModel');
const nodemailer = require("nodemailer");
const transporter = require('../config/mailconfig');

router.get('/getAllLogisticsInvoices', token, function (req, res, next) {
    invoiceLogisticsModel.find({ 'traderId': req.body.traderId, 'status': 'unpaid' }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'logisticsId',
            model: 'logisticsUser',
        },

    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    })
})
router.get('/getSettlementsInvoice', token, function (req, res, next) {
    invoiceLogisticsModel.find({ 'traderId': req.body.traderId, 'status': 'paid' }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'logisticsId',
            model: 'logisticsUser',
        },

    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    })
})
router.post('/getLogisticsInvoicesDetails', token, function (req, res, next) {
    invoiceLogisticsDetailsModel.find({ 'invoiceLogisticsId': req.body._id }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'logisticsId',
            model: 'logisticsUser',
        },

    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    })
})

router.post('/getPartialPayment', token, function (req, res, next) {
    invoiceLogisticsPaymentModel.find({ 'invoiceLogisticsId': req.body._id }).sort({ 'createdAt': 'asc' }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'logisticsId',
            model: 'logisticsUser',
        },
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    })
})
router.post('/postPaymentStatusBuyer', token, function (req, res, next) {
    invoiceLogisticsModel.update({ '_id': req.body._id },
        { $set: { "status": "paid" } }, function (err, statusDoc) {
            if (err) {
                res.status(404).send({ message: "error" })
            }
            else {
                res.status(200).send(statusDoc)
            }
        })
})
router.post('/makePayment', token, function (req, res, next) {
    invoiceLogisticsModel.find({ '_id': req.body._id }).populate([
        {
            path: 'traderId',
            model: 'trader'
        },
        {
            path: 'logisticsId',
            model: 'logisticsUser'
        }
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            var entry = new invoiceLogisticsPaymentModel({
                orderNumber: doc[0].orderNumber,
                invoiceNumber: doc[0].invoiceNumber,
                paymentTerms: req.body.paymentTerms,
                totalAmount: req.body.totalAmount,
                paidAmount: req.body.paidAmount,
                dueAmount: req.body.dueAmount,
                paymentDate: req.body.paymentDate,
                refrenceNo: req.body.refrenceNo,
                status: "unpaid",
                invoiceLogisticsId: req.body._id,
                issuePoId: doc[0].issuePoId,
                traderId: doc[0].traderId,
                logisticsId: doc[0].logisticsId,
            })
            entry.save(function (err, result) {
                if (err) {
                    return res.status(404).send(err);
                }
                else {
                    res.status(200).send(result);
                }
            })

            //mail to buyer/supplier for Invoice Partial Payment
            nodemailer.createTestAccount((err, account) => {
                var mailOptions = {
                    from: '"Nicoza " <rxzone@gmail.com>',
                    to: req.body.TraderEmail,
                    subject: 'Invoice Payment',
                    css: `a{text-decoration: none;},
                        button{    background: rgba(0, 0, 255, 0.78);
                        border: none;
                        padding: 10px;}`,
                    html: `<h3 style="color:blue;">Invoice Payment</h3>
							<div>Hello ${doc[0].traderId.registration_name},<br><br>
							Payment of Amount ${req.body.paidAmount} is done to Logistics provider <b>${doc[0].logisticsId.registration_name}</b> in regard of <b>${doc[0].orderNumber}</b>.<br>
							Please check your account.<br><br>
							Thanks,<br>
							The Nicoza team.<br><br>
							<p align="center">This message was sent by Nicoza.<p>
							</div>`
                };
                transporter.sendMail(mailOptions, function (err, information) {
                    if (err) { }
                    else res.status(200).send({ email: mailIds });
                })
            })
            //mail to Logistics Provider for Invoice Partial Payment
            nodemailer.createTestAccount((err, account) => {
                var mailOptions = {
                    from: '"Nicoza " <rxzone@gmail.com>',
                    to: req.body.LogisticsEmail,
                    subject: 'Invoice Payment',
                    css: `a{text-decoration: none;},
                        button{    background: rgba(0, 0, 255, 0.78);
                        border: none;
                        padding: 10px;}`,
                    html: `<h3 style="color:blue;">Invoice Payment</h3>
							<div>Hello ${doc[0].logisticsId.registration_name},<br><br>
							Payment of Amount ${req.body.paidAmount} is done by trader <b>${doc[0].traderId.registration_name}</b> in regard of <b>${doc[0].orderNumber}</b>.<br>
							Please check your account.<br><br>
							Thanks,<br>
							The Nicoza team.<br><br>
							<p align="center">This message was sent by Nicoza.<p>
							</div>`
                };
                transporter.sendMail(mailOptions, function (err, information) {
                    if (err) { }
                    else res.status(200).send({ email: mailIds });
                })
            })
        }
    })
})

module.exports = router;
