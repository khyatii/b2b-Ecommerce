const express = require('express');
const router = express.Router();
const transportPoModel = require('../models/transportPoModel'),
    transportPoProductModel = require('../models/transportPoProductModel'),
    clearingPoModel = require('../models/clearingPoModel'),
    clearingPoProductModel = require('../models/clearingPoProductModel'),
    invoiceLogisticsModel = require('../models/invoiceLogisticsModel'),
    invoiceLogisticsDetailsModel = require('../models/invoiceLogisticsDetailsModel'),
    acceptedPoTrackModel = require('../models/acceptedPoTrackModel'),
    logisticcategoryModel = require('../models/logisticcategoryModel'),
    nodemailer = require('nodemailer'),
    transporter = require('../config/mailconfig'),
    logisticToken = require('../middleware/logisticToken');

router.get('/getPendingTransportPo', logisticToken, function (req, res, next) {
    transportPoModel.find({ 'transportId': req.body.logisticsId, "status": "pending" }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'supplierId',
            model: 'trader',
        },
        {
            path: 'transportId',
            model: 'logisticsUser',
        },
        {
            path: 'deliveryLocation',
            model: 'locationModel',
        },
        {
            path: 'issuePoId',
            model: 'issuePo',
            populate: {
                path: 'requestQuotationSupplierId',
                model: 'requestQuotationSupplier',
            }
        },
        {
            path: 'warehouseId',
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

router.post('/getSingleTransportPo', logisticToken, function (req, res, next) {
    transportPoModel.find({ '_id': req.body._id }, function (err, doc) {
        if (err) res.status(404).send({ message: "error" })
        else {
            logisticcategoryModel.find({
                $and: [
                    { 'ServiceName': { $in: doc[0].transportServices } },
                    { 'logisticsId': doc[0].transportId },
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

router.get('/getCompletedTransportPo', logisticToken, function (req, res, next) {
    transportPoModel.find({ 'transportId': req.body.logisticsId, "status": "accept" }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'transportId',
            model: 'logisticsUser',
        },
        {
            path: 'deliveryLocation',
            model: 'locationModel',
        },
        {
            path: 'issuePoId',
            model: 'issuePo',
            populate: {
                path: 'requestQuotationSupplierId',
                model: 'requestQuotationSupplier',
            }
        },
        {
            path: 'warehouseId',
            model: 'logisticsUser',
        }
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send(err)
        }
        else {
            res.status(200).send(doc);
        }
    })
})

router.post('/getTransportProduct', logisticToken, function (req, res, next) {

    transportPoProductModel.find({ 'transportPoId': req.body._id }).populate([
        {
            path: 'productId',
            model: 'productSeller',
            populate: {
                path: 'productId',
                model: 'product',
            }
        },
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'issuePoId',
            model: 'issuePo',
            populate: {
                path: 'txtClearing',
                model: 'logisticsUser',
            }
        },
        {
            path: 'transportPoId',
            model: 'transportPo',
            populate: {
                path: 'transportId',
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

router.post('/postTransportPoStatus', logisticToken, function (req, res, next) {

    transportPoModel.update({ '_id': req.body._id },
        { $set: { "status": req.body.status } }, function (err, statusDoc) {
            if (err) {
                res.status(404).send({ message: "error" })
            }
            else {
                transportPoModel.find({ '_id': req.body._id }).populate([
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
                    {
                        path: 'buyerId',
                        model: 'trader'
                    },
                    {
                        path: 'clearingId',
                        model: 'logisticsUser',
                    },
                ]).exec(function (err, transportPoDoc) {
                    if (err) res.status(404).send(err)
                    acceptedPoTrackModel.update({ 'issuePOId': transportPoDoc[0].issuePoId },
                        { $set: { "orderShipped": "received" } }, function (err, docs) {
                            if (err) {
                                res.status(404).send(err)
                            }
                            else {
                                var shipping = transportPoDoc[0].requestQuotationId.shipping;

                                if (shipping == "FOB") {
                                    var warehouseService = transportPoDoc[0].issuePoId.txtWarehouseService;
                                    var transportService = transportPoDoc[0].issuePoId.TransportName;
                                    var clearingService = transportPoDoc[0].issuePoId.txtClearingName;
                                    var insuranceService = transportPoDoc[0].issuePoId.txtInsuranceName;

                                } else {
                                    var warehouseService = transportPoDoc[0].warehouseServices;
                                    var transportService = transportPoDoc[0].transportServices;
                                    var clearingService = transportPoDoc[0].clearingServices;
                                    var insuranceService = transportPoDoc[0].insuranceServices;
                                }
                                if (transportPoDoc[0].clearingId !== null) {
                                    var entry = new clearingPoModel({
                                        orderNumber: transportPoDoc[0].orderNumber,
                                        traderId: transportPoDoc[0].traderId,
                                        buyerId: transportPoDoc[0].buyerId,
                                        issuePoId: transportPoDoc[0].issuePoId,
                                        warehousePoId: transportPoDoc[0].warehousePoId,
                                        transportPoId: req.body._id,
                                        requestQuotationId: transportPoDoc[0].requestQuotationId._id,
                                        status: "pending",
                                        deliveryLocation: transportPoDoc[0].requestQuotationId.deliveryLocation._id,
                                        warehouseId: transportPoDoc[0].warehouseId,
                                        transportId: transportPoDoc[0].transportId,
                                        clearingId: transportPoDoc[0].clearingId,
                                        insuranceId: transportPoDoc[0].insuranceId,

                                        warehouseServices: warehouseService,
                                        transportServices: transportService,
                                        clearingServices: clearingService,
                                        insuranceServices: insuranceService,

                                    })
                                    entry.save(function (err, clearingDoc) {
                                        if (err) {
                                            res.status(404).send(err);
                                        }
                                        else {
                                            transportPoProductModel.find({ 'transportPoId': req.body._id }, function (err, doc) {

                                                if (err) res.status(404).send(err);
                                                else {
                                                    if (doc.length >= 1) {
                                                        doc.forEach(function (v, i) {
                                                            if (i != doc.length - 1) {
                                                                var entry = new clearingPoProductModel({
                                                                    orderNumber: transportPoDoc[0].orderNumber,
                                                                    clearingPoId: clearingDoc._id,
                                                                    transportPoId: v.transportPoId,
                                                                    warehousePoId: v.warehousePoId,
                                                                    issuePoId: v.issuePoId,
                                                                    productId: v.productId,
                                                                    traderId: v.traderId,
                                                                    txtTotalPrice: v.txtTotalPrice,
                                                                    txtUnitPrice: v.txtUnitPrice,
                                                                    txtNoOfItems: v.txtNoOfItems,
                                                                    txtItemPerPackage: v.txtItemPerPackage,
                                                                    txtPackagingWeight: v.txtPackagingWeight,
                                                                    txtPackaging: v.txtPackaging,
                                                                    txtShipping: v.txtShipping,
                                                                })
                                                                entry.save(function (err, docu) {
                                                                    if (err) res.status(404).send(err);
                                                                    else { }
                                                                })
                                                            }
                                                            if (i == doc.length - 1) {
                                                                var entry = new clearingPoProductModel({
                                                                    orderNumber: transportPoDoc[0].orderNumber,
                                                                    clearingPoId: clearingDoc._id,
                                                                    transportPoId: v.transportPoId,
                                                                    warehousePoId: v.warehousePoId,
                                                                    issuePoId: v.issuePoId,
                                                                    productId: v.productId,
                                                                    traderId: v.traderId,
                                                                    txtTotalPrice: v.txtTotalPrice,
                                                                    txtUnitPrice: v.txtUnitPrice,
                                                                    txtNoOfItems: v.txtNoOfItems,
                                                                    txtItemPerPackage: v.txtItemPerPackage,
                                                                    txtPackagingWeight: v.txtPackagingWeight,
                                                                    txtPackaging: v.txtPackaging,
                                                                    txtShipping: v.txtShipping,
                                                                })
                                                                entry.save(function (err, docu) {
                                                                    if (err) {
                                                                        res.status(404).send(err);
                                                                    } else {
                                                                        saveInvoiceLogistics(req, transportPoDoc, function (status) {
                                                                            if (status) {
                                                                                res.status(200).send(docu)
                                                                            }
                                                                            else {
                                                                                res.status(404).send('Error')
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                }
                                            })

                                            /*mail to Trader for order shipped*/
                                            nodemailer.createTestAccount((err, account) => {
                                                mailids = [transportPoDoc[0].traderId.email, transportPoDoc[0].buyerId.email];
                                                var mailOptions = {
                                                    from: '"Nicoza " <rxzone@gmail.com>',
                                                    to: mailids,
                                                    subject: 'Your order is shipped',
                                                    css: `a{text-decoration: none;},
                                        button{    background: rgba(0, 0, 255, 0.78);
                                        border: none;
                                        padding: 10px;}`,
                                                    html: `<h3 style="color:blue;">Your order is shipped</h3>
                                        <div>Hello from Nicoza,<br><br>
                                        Your Order ${transportPoDoc[0].orderNumber} is <b>Shipped</b> by Transport.<br>
                                        Please check your account.<br><br>
                                        Thanks,<br>
                                        The Nicoza team.<br><br>
                                        <p align="center">This message was sent by Nicoza.<p>
                                        </div>`

                                                };
                                                transporter.sendMail(mailOptions, function (err, information) {
                                                    if (err) { }
                                                    res.status(200).send(doc);
                                                })
                                            });
                                            /* mail to Trader to notify Transport accept or reject request*/
                                            nodemailer.createTestAccount((err, account) => {
                                                var mailOptions = {
                                                    from: '"Nicoza " <rxzone@gmail.com>',
                                                    to: transportPoDoc[0].traderId.email,
                                                    subject: 'Status of Transport',
                                                    css: `a{text-decoration: none;},
                                        button{    background: rgba(0, 0, 255, 0.78);
                                        border: none;
                                        padding: 10px;}`,
                                                    html: `<h3 style="color:blue;">Status of Transport</h3>
                                    <div>Hello <b>${transportPoDoc[0].traderId.registration_name}</b>,<br><br>
                                    Your Order ${transportPoDoc[0].orderNumber} is <b>${req.body.status}ed</b> by Transport.<br>
                                    Please check your account.<br><br>
                                    Thanks,<br>
                                    The Nicoza team.<br><br>
                                    <p align="center">This message was sent by Nicoza.<p>
                                    </div>`
                                                };
                                                transporter.sendMail(mailOptions, function (err, information) {
                                                    if (err) { }
                                                    res.status(200).send(docs);
                                                })
                                            });
                                            /*mail to Clearing & Forwarding Agent for Request */
                                            nodemailer.createTestAccount((err, account) => {
                                                var mailOptions = {
                                                    from: '"Nicoza " <rxzone@gmail.com>',
                                                    to: transportPoDoc[0].clearingId.email,
                                                    subject: 'Request for Clearing & Forwarding',
                                                    css: `a{text-decoration: none;},
                                                    button{    background: rgba(0, 0, 255, 0.78);
                                                    border: none;
                                                    padding: 10px;}`,
                                                    html: `<h3 style="color:blue;">Request for Clearing & Forwarding</h3>
                                                    <div>Hello <b>${transportPoDoc[0].clearingId.registration_name}</b>,<br><br>
                                                    You have a request for Clearing & Forwarding.<br>
                                                    Please check your account.<br><br>
                                                    Thanks,<br>
                                                    The Nicoza team.<br><br>
                                                    <p align="center">This message was sent by Nicoza.<p>
                                                    </div>`
                                                };
                                                transporter.sendMail(mailOptions, function (err, information) {
                                                    if (err) { }
                                                    res.status(200).send(docs);
                                                })
                                            });

                                        }
                                    })
                                }
                                else {

                                    saveInvoiceLogistics(req, transportPoDoc, function (status) {
                                        if (status) {
                                            res.status(200).send(transportPoDoc)
                                        }
                                        else {
                                            res.status(404).send('Error')
                                        }
                                    })
                                    /*mail to Trader for order shipped*/
                                    nodemailer.createTestAccount((err, account) => {
                                        mailids = [transportPoDoc[0].traderId.email, transportPoDoc[0].buyerId.email];
                                        var mailOptions = {
                                            from: '"Nicoza " <rxzone@gmail.com>',
                                            to: mailids,
                                            subject: 'Your order is shipped',
                                            css: `a{text-decoration: none;},
                                        button{    background: rgba(0, 0, 255, 0.78);
                                        border: none;
                                        padding: 10px;}`,
                                            html: `<h3 style="color:blue;">Your order is shipped</h3>
                                        <div>Hello from Nicoza,<br><br>
                                        Your Order ${transportPoDoc[0].orderNumber} is <b>Shipped</b> by Transport.<br>
                                        Please check your account.<br><br>
                                        Thanks,<br>
                                        The Nicoza team.<br><br>
                                        <p align="center">This message was sent by Nicoza.<p>
                                        </div>`

                                        };
                                        transporter.sendMail(mailOptions, function (err, information) {
                                            if (err) { }
                                            res.status(200).send(doc);
                                        })
                                    });
                                    /* mail to Trader to notify Transport accept or reject request*/
                                    nodemailer.createTestAccount((err, account) => {
                                        var mailOptions = {
                                            from: '"Nicoza " <rxzone@gmail.com>',
                                            to: transportPoDoc[0].traderId.email,
                                            subject: 'Status of Transport',
                                            css: `a{text-decoration: none;},
                                        button{    background: rgba(0, 0, 255, 0.78);
                                        border: none;
                                        padding: 10px;}`,
                                            html: `<h3 style="color:blue;">Status of Transport</h3>
                                    <div>Hello <b>${transportPoDoc[0].traderId.registration_name}</b>,<br><br>
                                    Your Order ${transportPoDoc[0].orderNumber} is <b>${req.body.status}ed</b> by Transport.<br>
                                    Please check your account.<br><br>
                                    Thanks,<br>
                                    The Nicoza team.<br><br>
                                    <p align="center">This message was sent by Nicoza.<p>
                                    </div>`
                                        };
                                        transporter.sendMail(mailOptions, function (err, information) {
                                            if (err) { }
                                            res.status(200).send(docs);
                                        })
                                    });
                                }

                            }
                        }
                    )
                })
            }
        })
})

//buyer or seller transport Iinvoice
function saveInvoiceLogistics(req, transportPoDoc, callback) {

    logisticcategoryModel.find({
        $and: [
            { 'ServiceName': { $in: transportPoDoc[0].transportServices } },
            { 'logisticsId': transportPoDoc[0].transportId },
        ]
    }, function (err, docs) {
        if (err) callback(false);
        else {
            const generateInvNo = generateInvoiceNumber();
            var entry = new invoiceLogisticsModel({
                orderNumber: transportPoDoc[0].orderNumber,
                invoiceNumber: generateInvNo,
                traderId: transportPoDoc[0].traderId,
                issuePoId: transportPoDoc[0].issuePoId._id,
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
                                    orderNumber: transportPoDoc[0].orderNumber,
                                    invoiceNumber: generateInvNo,
                                    traderId: transportPoDoc[0].traderId,
                                    issuePoId: transportPoDoc[0].issuePoId,
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
                                    orderNumber: transportPoDoc[0].orderNumber,
                                    invoiceNumber: generateInvNo,
                                    traderId: transportPoDoc[0].traderId,
                                    issuePoId: transportPoDoc[0].issuePoId,
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