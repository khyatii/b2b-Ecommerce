var express = require('express');
var router = express.Router();
var invoiceModel = require('../models/invoiceModel');
var invoiceProductModel = require('../models/invoiceProductModel');
var invoicePaymentModel = require('../models/invoicePaymentModel');
var notificationModel = require('../models/notificationModel');
var invoicePaymentSupplierModel = require('../models/invoicePaymentSupplierModel');
var returnPoModel = require('../models/returnPoModel');
var token = require('../middleware/token');
const nodemailer = require('nodemailer');
const transporter = require('../config/mailconfig');

router.get('/getAllInvoices', token, function (req, res, next) {
    invoiceModel.find({ 'buyerId': req.body.traderId }).populate([
        {
            path: 'buyerId',
            model: 'trader',
        },
        {
            path: 'supplierId',
            model: 'trader',
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

router.post('/getAllInvoiceProduct', token, function (req, res, next) {
    invoiceProductModel.find({ 'invoiceId': req.body._id }).populate([
        {
            path: 'productId',
            model: 'productSeller',
            populate: {
                path: 'productId',
                model: 'product',
            }
        },
        {
            path: 'productId',
            model: 'productSeller',
            populate: {
                path: 'txtCurrency',
                model: 'currency'
            }
        },
        {
            path: 'buyerId',
            model: 'trader',
        },
        {
            path: 'supplierId',
            model: 'trader',
        },
        {
            path: 'invoiceId',
            model: 'invoice',
        },
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    });

})

router.post('/getPartialPayment', token, function (req, res, next) {
    invoicePaymentModel.find({ 'invoiceId': req.body._id }).sort({ 'createdAt': 'asc' }).populate([
        {
            path: 'buyerId',
            model: 'trader',
        },
        {
            path: 'supplierId',
            model: 'trader',
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

router.post('/makePayment', token, function (req, res, next) {
    invoiceModel.find({ '_id': req.body._id }).populate([
        {
            path: 'buyerId',
            model: 'trader'
        },
        {
            path: 'supplierId',
            model: 'trader'
        }
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            var entry = new invoicePaymentModel({
                orderNumber: doc[0].orderNumber,
                invoiceNumber: doc[0].invoiceNumber,
                paymentTerms: req.body.paymentTerms,
                totalAmount: req.body.totalAmount,
                paidAmount: req.body.paidAmount,
                dueAmount: req.body.dueAmount,
                paymentDate: req.body.paymentDate,
                refrenceNo: req.body.refrenceNo,
                status: "unpaid",
                invoiceId: req.body._id,
                issuePOId: doc[0].issuePOId,
                supplierId: doc[0].supplierId,
                buyerId: doc[0].buyerId,
                requestQuotationId: doc[0].requestQuotationId,
            })

            entry.save(function (err, doc) {
                if (err) {
                    res.status(404).send(err);
                    return;
                }
                else {
                    //Make Payment notification
                    var entry = new notificationModel({
                        traderId: req.body.traderId,
                        message: 'You make payemnt of ' + req.body.paidAmount,
                        // route : '',
                        // read : ,
                    });
                    entry.save(function (err, docs) {
                        if (err) res.status(404).send({ message: "error" })
                        else {
                            res.status(200).send(doc);
                        }
                    });
                }
            })

            //mail to buyer for Invoice Partial Payment
            nodemailer.createTestAccount((err, account) => {
                var mailOptions = {
                    from: '"Nicoza " <rxzone@gmail.com>',
                    to: req.body.BuyerEmail,
                    subject: 'Invoice Payment',
                    css: `a{text-decoration: none;},
                  button{    background: rgba(0, 0, 255, 0.78);
                    border: none;
                    padding: 10px;}`,
                    html: `<h3 style="color:blue;">Invoice Payment</h3>
                    <div>Hello ${doc[0].buyerId.registration_name},<br><br>
                    Payment of Amount ${req.body.paidAmount} is done to Seller <b> ${doc[0].supplierId.registration_name}</b> in regard of <b>${doc[0].orderNumber}</b>.<br>
                    Please check your account.<br><br>
                    Thanks,<br>
                    The Nicoza team.<br><br>
                    <p align="center">This message was sent by Nicoza.<p>
                    </div>`
                };

                transporter.sendMail(mailOptions, function (err, information) {
                    if (err) {
                    }
                })
            })
            //mail to supplier for Invoice Partial Payment
            nodemailer.createTestAccount((err, account) => {
                var mailOptions = {
                    from: '"Nicoza " <rxzone@gmail.com>',
                    to: req.body.SupplierEmail,
                    subject: 'Invoice Payment',
                    css: `a{text-decoration: none;},
                  button{    background: rgba(0, 0, 255, 0.78);
                    border: none;
                    padding: 10px;}`,
                    html: `<h3 style="color:blue;">Invoice Payment</h3>
                    <div>Hello ${doc[0].supplierId.registration_name},<br><br>
                    Payment of Amount ${req.body.paidAmount} is done by Buyer <b>${doc[0].buyerId.registration_name}</b> in regard of <b>${doc[0].orderNumber}</b>.<br>
                    Please check your account.<br><br>
                    Thanks,<br>
                    The Nicoza team.<br><br>
                    <p align="center">This message was sent by Nicoza.<p>
                    </div>`
                };

                transporter.sendMail(mailOptions, function (err, information) {
                    if (err) {
                    }

                })
            })
        }
    })
})

router.post('/getPartialPaymentSupplier', token, function (req, res, next) {
    invoicePaymentSupplierModel.find({ 'returnPoId': req.body._id }).sort({ 'createdAt': 'asc' }).populate([
        {
            path: 'buyerId',
            model: 'trader',
        },
        {
            path: 'supplierId',
            model: 'trader',
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


router.post('/makePaymentSupplier', token, function (req, res, next) {
    returnPoModel.find({ '_id': req.body._id }, function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            var entry = new invoicePaymentSupplierModel({
                paymentTerms: req.body.paymentTerms,
                totalAmount: req.body.totalAmount,
                paidAmount: req.body.paidAmount,
                dueAmount: req.body.dueAmount,
                paymentDate: req.body.paymentDate,
                refrenceNo: req.body.refrenceNo,
                status: "unpaid",
                // invoiceId: doc[0].invoiceId,
                returnPoId: req.body._id,
                supplierId: doc[0].supplierId,
                buyerId: doc[0].buyerId,
                requestQuotationId: doc[0].requestQuotationId,
            })

            entry.save(function (err, doc) {
                if (err) {
                    res.status(404).send(err);
                    return;
                }
                else {
                    res.status(200).send(doc);
                    // //Make Payment notification
                    // var entry = new notificationModel({
                    //     traderId: req.body.traderId,
                    //     message: 'You make payemnt of ' + req.body.paidAmount,
                    //     // route : '',
                    //     // read : ,
                    // });
                    // entry.save(function (err, docs) {
                    //     if (err) res.status(404).send({ message: "error" })
                    //     else {
                    //         res.status(200).send(doc);
                    //     }
                    // });
                }
            })

            // //mail to buyer and supplier for Invoice Partial Payment
            // nodemailer.createTestAccount((err, account) => {
            //     var mailIds = [req.body.SupplierEmail, req.body.BuyerEmail];
            //     var mailOptions = {
            //         from: '"Nicoza " <rxzone@gmail.com>',
            //         to: mailIds,

            //         subject: 'Invoice Payment',
            //         css: `a{text-decoration: none;},
            //       button{    background: rgba(0, 0, 255, 0.78);
            //         border: none;
            //         padding: 10px;}`,
            //         html:`<h3 style="color:blue;">Invoice Payment</h3>
            // <div>Hello from Nicoza,<br><br>
            // Payment of Amount ${req.body.paidAmount} is done in regard of <b>${doc[0].orderNumber}</b>.<br>
            // Please check your account.<br><br>
            // Thanks,<br>
            // The Nicoza team.<br><br>
            // <p align="center">This message was sent by Nicoza.<p>
            // </div>`
            //     };

            //     transporter.sendMail(mailOptions, function (err, information) {
            //         if (err) {
            //         }
            //         res.status(200).send({ email: mailIds });
            //     })
            // })
        }
    })
})

router.post('/postPaymentStatusSupplier', token, function (req, res, next) {
    returnPoModel.update({ '_id': req.body._id },
        { $set: { "paymentStatus": "paid" } }, function (err, statusDoc) {
            if (err) {
                res.status(404).send({ message: "error" })
            }
            else {
                res.status(200).send(statusDoc)
            }
        })
})

module.exports = router;
