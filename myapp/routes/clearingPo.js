const express = require('express');
const router = express.Router();
const clearingPoModel = require('../models/clearingPoModel'),
    clearingPoProductModel = require('../models/clearingPoProductModel'),
    invoiceLogisticsModel = require('../models/invoiceLogisticsModel'),
    invoiceLogisticsDetailsModel = require('../models/invoiceLogisticsDetailsModel'),
    acceptedPoTrackModel = require('../models/acceptedPoTrackModel'),
    logisticcategoryModel = require('../models/logisticcategoryModel'),
    nodemailer = require('nodemailer'),
    transporter = require('../config/mailconfig'),
    logisticToken = require('../middleware/logisticToken');

router.get('/getPendingClearingPo', logisticToken, function (req, res, next) {
    clearingPoModel.find({ 'clearingId': req.body.logisticsId, "status": "pending" }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'clearingId',
            model: 'logisticsUser',
        },
        {
            path: 'deliveryLocation',
            model: 'locationModel',
        }
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    })
})

router.post('/getSingleClearingPo', logisticToken, function (req, res, next) {
    clearingPoModel.find({ '_id': req.body._id }, function (err, doc) {
        if (err) res.status(404).send({ message: "error" })
        else {
            logisticcategoryModel.find({
                $and: [
                    { 'ServiceName': { $in: doc[0].clearingServices } },
                    { 'logisticsId': doc[0].clearingId },
                ]
            }, function (err, docs) {
                if (err) res.status(404).send({ message: "error" })
                else {
                    res.status(200).send(docs);
                }
            })
        }
    })
})

router.get('/getCompletedClearingPo', logisticToken, function (req, res, next) {
    clearingPoModel.find({ 'clearingId': req.body.logisticsId, "status": "accept" }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'clearingId',
            model: 'logisticsUser',
        },
        {
            path: 'deliveryLocation',
            model: 'locationModel',
        }
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    })
})

router.post('/getClearingProduct', logisticToken, function (req, res, next) {

    clearingPoProductModel.find({ 'clearingPoId': req.body._id }).populate([
        {
            path: 'productId',
            model: 'productSeller',
            populate: {
                path: 'productId',
                model: 'product',
            }
        },
        {
            path: 'issuePoId',
            model: 'issuePo'
        },
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'clearingPoId',
            model: 'clearingPo',
            populate: {
                path: 'clearingId',
                model: 'logisticsUser',
            }
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

router.post('/postClearingPoStatus', logisticToken, function (req, res, next) {

    clearingPoModel.update({ '_id': req.body._id },
        { $set: { "status": req.body.status } }, function (err, statusDoc) {
            if (err) {
                res.status(404).send({ message: "error" })
            }
            else {
                clearingPoModel.find({ '_id': req.body._id }).populate([
                    {
                        path: 'requestQuotationId',
                        model: 'requestQuotation',
                        populate: {
                            path: 'deliveryLocation',
                            model: 'locationModel',
                        }
                    },
                    {
                        path: 'issuePoId',
                        model: 'issuePo',
                    },
                    {
                        path: 'traderId',
                        model: 'trader',
                    },
                ]).exec(function (err, clearingPoDoc) {
                    if (err) res.status(404).send(err)
                    else {
                        acceptedPoTrackModel.update({ 'issuePOId': clearingPoDoc[0].issuePoId },
                            { $set: { "orderShipped": "received" } }, function (err, docs) {
                                if (err) {
                                    res.status(404).send(err)
                                }
                                else {
                                    saveInvoiceLogistics(req, clearingPoDoc, function (status) {
                                        if (status) {
                                            res.status(200).send(clearingPoDoc)
                                        }
                                        else {
                                            res.status(404).send('Error')
                                        }
                                    })
                                }
                            }
                        )
                        /* mail to Trader to notify Clearing and Forwarding accept or reject request*/
                        nodemailer.createTestAccount((err, account) => {
                            var mailOptions = {
                                from: '"Nicoza " <rxzone@gmail.com>',
                                to: clearingPoDoc[0].traderId.email,
                                subject: 'Status of Clearing & Forwarding',
                                css: `a{text-decoration: none;},
                                    button{    background: rgba(0, 0, 255, 0.78);
                                    border: none;
                                    padding: 10px;}`,
                                html: `<h3 style="color:blue;">Status of  Clearing & Forwarding</h3>
                                <div>Hello <b>${clearingPoDoc[0].traderId.registration_name}</b>,<br><br>
                                Your ORDER is <b>${req.body.status}ed</b> by Clearing & Forwarding Agent.<br>
                                Please check your account.<br><br>
                                Thanks,<br>
                                The Nicoza team.<br><br>
                                <p align="center">This message was sent by Nicoza.<p>
                                </div>`
                            };
                            transporter.sendMail(mailOptions, function (err, statusDoc) {
                                if (err) { }
                                res.status(200).send(docs);
                            })
                        });
                    }
                })
            }
        }
    )
})

//buyer or seller clearing Invoice
function saveInvoiceLogistics(req, clearingPoDoc, callback) {

    logisticcategoryModel.find({
        $and: [
            { 'ServiceName': { $in: clearingPoDoc[0].clearingServices } },
            { 'logisticsId': clearingPoDoc[0].clearingId },
        ]
    }, function (err, docs) {
        if (err) callback(false);
        else {
            const generateInvNo = generateInvoiceNumber();
            var entry = new invoiceLogisticsModel({
                orderNumber: clearingPoDoc[0].orderNumber,
                invoiceNumber: generateInvNo,
                traderId: clearingPoDoc[0].traderId,
                issuePoId: clearingPoDoc[0].issuePoId._id,
                serviceType: docs[0].ServiceCategory,
                logisticsId: req.body.logisticsId,
                status: "unpaid"
            })
            entry.save(function (err, invoiceDoc) {
                if (err) callback(false);
                else {
                    if (docs.length >= 1) {
                        docs.forEach(function (v, i) {
                            if (i != docs.length - 1) {
                                var entry = new invoiceLogisticsDetailsModel({
                                    orderNumber: clearingPoDoc[0].orderNumber,
                                    invoiceNumber: generateInvNo,
                                    traderId: clearingPoDoc[0].traderId,
                                    issuePoId: clearingPoDoc[0].issuePoId,
                                    invoiceLogisticsId: invoiceDoc._id,
                                    logisticsId: req.body.logisticsId,
                                    serviceType: v.ServiceCategory,
                                    serviceName: v.ServiceName,
                                    serviceDescription: v.ServiceDescription,
                                    units: v.Unit,
                                    pricePerUnits: v.PricePerUnit,
                                    ServiceUrl: v.ServiceUrl,
                                    PriceRules: v.PriceRules,
                                    createdAt: Date.now(),
                                    updatedAt: Date.now(),
                                })
                                entry.save(function (err, docu) {
                                    if (err) callback(false);
                                    else { }
                                })
                            }
                            if (i == docs.length - 1) {
                                var entry = new invoiceLogisticsDetailsModel({
                                    orderNumber: clearingPoDoc[0].orderNumber,
                                    invoiceNumber: generateInvNo,
                                    traderId: clearingPoDoc[0].traderId,
                                    issuePoId: clearingPoDoc[0].issuePoId,
                                    invoiceLogisticsId: invoiceDoc._id,
                                    logisticsId: req.body.logisticsId,
                                    serviceType: v.ServiceCategory,
                                    serviceName: v.ServiceName,
                                    serviceDescription: v.ServiceDescription,
                                    units: v.Unit,
                                    pricePerUnits: v.PricePerUnit,
                                    ServiceUrl: v.ServiceUrl,
                                    PriceRules: v.PriceRules,
                                    createdAt: Date.now(),
                                    updatedAt: Date.now(),
                                })
                                entry.save(function (err, docu) {
                                    if (err) callback(false);
                                    else {
                                        callback(true);
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    })
}

function generateInvoiceNumber() {
    const timestamp = Date.now();
    const year = new Date().getFullYear();
    const prefix = 'INV-' + year + timestamp * 1000;
    return prefix;
}

module.exports = router;