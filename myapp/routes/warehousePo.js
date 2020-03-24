const express = require('express'),
    router = express.Router(),
    warehousePoModel = require('../models/warehousePoModel'),
    warehousePoProductModel = require('../models/warehousePoProductModel'),
    issuePoModel = require('../models/issuePoModel'),
    issuePoProductModel = require('../models/issuePoProductModel'),
    invoiceModel = require('../models/invoiceModel'),
    invoiceProductModel = require('../models/invoiceProductModel'),
    transportPoModel = require('../models/transportPoModel'),
    transportPoProductModel = require('../models/transportPoProductModel'),
    insurancePoModel = require('../models/insurancePoModel'),
    insurancePoProductModel = require('../models/insurancePoProductModel'),
    acceptedPoTrackModel = require('../models/acceptedPoTrackModel'),
    logisticcategoryModel = require('../models/logisticcategoryModel'),
    invoiceLogisticsModel = require('../models/invoiceLogisticsModel'),
    invoiceLogisticsDetailsModel = require('../models/invoiceLogisticsDetailsModel'),
    multipleLogisticPoModel = require('../models/multipleLogisticPoModel'),
    multipleLogisticsPoProductModel = require('../models/multipleLogisticsPoProductModel'),
    logisticToken = require('../middleware/logisticToken'),
    token = require('../middleware/token'),
    nodemailer = require('nodemailer'),
    transporter = require('../config/mailconfig');

router.get('/getPendingWarehousePo', logisticToken, function (req, res, next) {

    warehousePoModel.find({ 'logisticsId': req.body.logisticsId, "status": "pending" }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'warehouseId',
            model: 'logisticsUser',
        },
        {
            path: 'issuePoId',
            model: 'issuePo',
            populate: {
                path: 'requestQuotationSupplierId',
                model: 'requestQuotationSupplier',
            }
        },
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            if (doc != '') {
                logisticcategoryModel.find({ 'ServiceName': { $in: doc[0].warehouseServices } }, function (err, docs) {
                    if (err) res.status(404).send({ message: "error" })
                    else {
                        res.status(200).send(doc);
                    }
                })
            }
            else {
                res.status(200).send(doc);
            }
        }
    })
})

router.post('/getSingleWarehousePo', logisticToken, function (req, res, next) {
    warehousePoModel.find({ '_id': req.body._id }, function (err, doc) {
        if (err) res.status(404).send({ message: "error" })
        else {
            logisticcategoryModel.find({
                $and: [
                    { 'ServiceName': { $in: doc[0].warehouseServices } },
                    { 'logisticsId': doc[0].warehouseId },
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

router.get('/getCompletedWarehousePo', logisticToken, function (req, res, next) {
    warehousePoModel.find({ 'logisticsId': req.body.logisticsId, "status": "accept" }).populate([
        {
            path: 'traderId',
            model: 'trader',
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

router.post('/getPendingWarehouseProduct', logisticToken, function (req, res, next) {

    warehousePoProductModel.find({ 'warehousePoId': req.body._id }).populate([
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
            model: 'issuePo',
            populate: {
                path: 'txtTransportation',
                model: 'logisticsUser'
            }
        },
        {
            path: 'issuePoId',
            model: 'issuePo',
            populate: {
                path: 'txtInsurance',
                model: 'logisticsUser'
            }
        },
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'warehousePoId',
            model: 'warehousePo',
            populate: {
                path: 'warehouseId',
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

router.post('/getLogisticsServices', token, function (req, res, next) {
    invoiceModel.find({ '_id': req.body._id }, function (err, doc) {
        if (err) res.status(404).send({ message: "error" })
        else {
            logisticcategoryModel.find({
                $or: [{
                    $and: [
                        { 'ServiceName': { $in: doc[0].txtWarehouseService } },
                        { 'logisticsId': doc[0].txtWarehouse },
                    ]
                }, {
                    $and: [
                        { 'ServiceName': { $in: doc[0].TransportName } },
                        { 'logisticsId': doc[0].txtTransportation },
                    ]
                }, {
                    $and: [
                        { 'ServiceName': { $in: doc[0].txtClearingName } },
                        { 'logisticsId': doc[0].txtClearing },
                    ]
                }, {
                    $and: [
                        { 'ServiceName': { $in: doc[0].txtInsuranceName } },
                        { 'logisticsId': doc[0].txtInsurance },
                    ]
                }
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

router.post('/postWarehousePoStatus', logisticToken, function (req, res, next) {
    warehousePoModel.updateOne({ '_id': req.body._id },
        { $set: { "status": req.body.status } }, function (err, statusDoc) {
            if (err) {
                res.status(404).send({ message: "error" })
            }
            else {
                warehousePoModel.find({ '_id': req.body._id }).populate([
                    {
                        path: 'requestQuotationId',
                        model: 'requestQuotation',
                        populate: {
                            path: 'deliveryLocation',
                            model: 'locationModel',
                        }
                    },
                    {
                        path: 'requestQuotationSupplierId',
                        model: 'requestQuotationSupplier'
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
                        model: 'trader',
                    },
                    {
                        path: 'transportId',
                        model: 'logisticsUser',
                    },
                    {
                        path: 'insuranceId',
                        model: 'logisticsUser',
                    },
                ]).exec(function (err, warehousePoDoc) {
                    if (err) {
                        res.status(404).send({ message: "error" })
                    }
                    else {
                        acceptedPoTrackModel.updateOne({ 'issuePOId': warehousePoDoc[0].issuePoId },
                            { $set: { "orderPacked": "accept" } }, function (err, docs) {
                                if (err) {
                                    res.status(404).send(err)
                                }
                                else {
                                    var shipping = warehousePoDoc[0].requestQuotationId.shipping;
                                    if (shipping == "FOB") {
                                        var warehouseService = warehousePoDoc[0].issuePoId.txtWarehouseService;
                                        var transportService = warehousePoDoc[0].issuePoId.TransportName;
                                        var clearingService = warehousePoDoc[0].issuePoId.txtClearingName;
                                        var insuranceService = warehousePoDoc[0].issuePoId.txtInsuranceName;
                                    } else {
                                        var warehouseService = warehousePoDoc[0].warehouseServices;
                                        var transportService = warehousePoDoc[0].transportServices;
                                        var clearingService = warehousePoDoc[0].clearingServices;
                                        var insuranceService = warehousePoDoc[0].insuranceServices;
                                    }
                                    var entry = new transportPoModel({
                                        orderNumber: warehousePoDoc[0].orderNumber,
                                        traderId: warehousePoDoc[0].traderId,
                                        buyerId: warehousePoDoc[0].buyerId,
                                        issuePoId: warehousePoDoc[0].issuePoId,
                                        warehousePoId: req.body._id,
                                        requestQuotationId: warehousePoDoc[0].requestQuotationId._id,
                                        status: "pending",
                                        deliveryLocation: warehousePoDoc[0].requestQuotationId.deliveryLocation._id,
                                        warehouseId: warehousePoDoc[0].warehouseId,
                                        transportId: warehousePoDoc[0].transportId,
                                        clearingId: warehousePoDoc[0].clearingId,
                                        insuranceId: warehousePoDoc[0].insuranceId,
                                        warehouseServices: warehouseService,
                                        transportServices: transportService,
                                        clearingServices: clearingService,
                                        insuranceServices: insuranceService,
                                    })
                                    entry.save(function (err, transportDoc) {
                                        if (err) {
                                            res.status(404).send(err);
                                        }
                                        else {
                                            warehousePoProductModel.find({ 'warehousePoId': req.body._id }, function (err, doc) {
                                                if (err) res.status(404).send(err);
                                                else {
                                                    if (doc.length >= 1) {
                                                        doc.forEach(function (v, i) {
                                                            if (i != doc.length - 1) {
                                                                var entry = new transportPoProductModel({
                                                                    orderNumber: warehousePoDoc[0].orderNumber,
                                                                    transportPoId: transportDoc._id,
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
                                                                entry.save(function (err, docs) {
                                                                    if (err) res.status(404).send(err);
                                                                    else { }
                                                                })
                                                            }
                                                            if (i == doc.length - 1) {
                                                                var entry = new transportPoProductModel({
                                                                    orderNumber: warehousePoDoc[0].orderNumber,
                                                                    transportPoId: transportDoc._id,
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
                                                                entry.save(function (err, docs) {
                                                                    if (err) {
                                                                        res.status(404).send(err);
                                                                    } else {
                                                                        /* Check if trader choose insurance */
                                                                        if (warehousePoDoc[0].insuranceId != null) {
                                                                            var entry = new insurancePoModel({
                                                                                orderNumber: warehousePoDoc[0].orderNumber,
                                                                                traderId: warehousePoDoc[0].traderId,
                                                                                issuePoId: warehousePoDoc[0].issuePoId,
                                                                                warehousePoId: req.body._id,
                                                                                requestQuotationId: warehousePoDoc[0].requestQuotationId._id,
                                                                                status: "pending",
                                                                                deliveryLocation: warehousePoDoc[0].requestQuotationId.deliveryLocation._id,
                                                                                warehouseId: warehousePoDoc[0].warehouseId,
                                                                                transportId: warehousePoDoc[0].transportId,
                                                                                clearingId: warehousePoDoc[0].clearingId,
                                                                                insuranceId: warehousePoDoc[0].insuranceId,
                                                                                warehouseServices: warehouseService,
                                                                                transportServices: transportService,
                                                                                clearingServices: clearingService,
                                                                                insuranceServices: insuranceService,
                                                                            })
                                                                            entry.save(function (err, insurancePoDoc) {
                                                                                if (err) {
                                                                                    res.status(404).send(err);
                                                                                }
                                                                                else {
                                                                                    if (doc.length >= 1) {
                                                                                        doc.forEach(function (v, i) {
                                                                                            if (i != doc.length - 1) {
                                                                                                var entry = new insurancePoProductModel({
                                                                                                    orderNumber: warehousePoDoc[0].orderNumber,
                                                                                                    insurancePoId: insurancePoDoc._id,
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
                                                                                                entry.save(function (err, docz) {
                                                                                                    if (err) res.status(404).send(err);
                                                                                                    else { }
                                                                                                })
                                                                                            }
                                                                                            if (i == doc.length - 1) {
                                                                                                var entry = new insurancePoProductModel({
                                                                                                    orderNumber: warehousePoDoc[0].orderNumber,
                                                                                                    insurancePoId: insurancePoDoc._id,
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
                                                                                                entry.save(function (err, docz) {
                                                                                                    if (err) {
                                                                                                        res.status(404).send(err);
                                                                                                    }
                                                                                                    else {
                                                                                                        saveInvoiceLogistics(req, warehousePoDoc, function (status) {
                                                                                                            if (status) {
                                                                                                                /*mail to Insurance Agent */
                                                                                                                nodemailer.createTestAccount((err, account) => {
                                                                                                                    var mailOptions = {
                                                                                                                        from: '"Nicoza " <rxzone@gmail.com>',
                                                                                                                        to: warehousePoDoc[0].insuranceId.email,
                                                                                                                        subject: 'Request for Insurance',
                                                                                                                        css: `a{text-decoration: none;},
                                                                                                                            button{    background: rgba(0, 0, 255, 0.78);
                                                                                                                            border: none;
                                                                                                                            padding: 10px;}`,
                                                                                                                        html: `<h3 style="color:blue;">Request for Insurance</h3>
                                                                                                                            <div>Hello <b>${warehousePoDoc[0].insuranceId.registration_name}</b>,<br><br>
                                                                                                                            You have a request for Insurance.<br>
                                                                                                                            Please check your account.<br><br>
                                                                                                                            Thanks,<br>
                                                                                                                            The Nicoza team.<br><br>
                                                                                                                            <p align="center">This message was sent by Nicoza.<p>
                                                                                                                            </div>`
                                                                                                                    };
                                                                                                                    transporter.sendMail(mailOptions, function (err, information) {
                                                                                                                        if (err) { }
                                                                                                                        res.status(200).send(docz);
                                                                                                                    })
                                                                                                                });
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
                                                                        }
                                                                        else {
                                                                            saveInvoiceLogistics(req, warehousePoDoc, function (status) {
                                                                                if (status) {
                                                                                    res.status(200).send(docs)
                                                                                }
                                                                                else {
                                                                                    res.status(404).send('Error')
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                }
                                            })

                                            /*mail to buyer for packed order*/
                                            nodemailer.createTestAccount((err, account) => {
                                                mailids = [warehousePoDoc[0].traderId.email, warehousePoDoc[0].buyerId.email];
                                                var mailOptions = {
                                                    from: '"Nicoza " <rxzone@gmail.com>',
                                                    to: mailids,
                                                    subject: 'Your order is packed',
                                                    css: `a{text-decoration: none;},
                                                        button{    background: rgba(0, 0, 255, 0.78);
                                                        border: none;
                                                        padding: 10px;}`,
                                                    html: `<h3 style="color:blue;">Your order is packed</h3>
                                                        <div>Hello from Nicoza,<br><br>
                                                        Your Order ${warehousePoDoc[0].orderNumber} is packed.<br>
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
                                            /*mail to Trader to notify warehouse accepted the request*/
                                            nodemailer.createTestAccount((err, account) => {
                                                var mailOptions = {
                                                    from: '"Nicoza " <rxzone@gmail.com>',
                                                    to: warehousePoDoc[0].traderId.email,

                                                    subject: 'Status of Warehouse',
                                                    css: `a{text-decoration: none;},
                                                        button{    background: rgba(0, 0, 255, 0.78);
                                                        border: none;
                                                        padding: 10px;}`,
                                                    html: `<h3 style="color:blue;">Status of Warehouse</h3>
                                                        <div>Hello <b>${warehousePoDoc[0].traderId.registration_name}</b>,<br><br>
                                                        Your Order ${warehousePoDoc[0].orderNumber} is <b>${req.body.status}ed</b> by Warehouse.<br>
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
                                        }
                                    })

                                }
                            });
                    }
                }
                )
            }
        }
    )
})

/*Send invoice from Logistics service provider to Trader*/
function saveInvoiceLogistics(req, warehousePoDoc, callback) {

    logisticcategoryModel.find({
        $and: [
            { 'ServiceName': { $in: warehousePoDoc[0].warehouseServices } },
            { 'logisticsId': warehousePoDoc[0].warehouseId },
        ]
    }, function (err, docs) {
        if (err) callback(false);
        else {
            const generateInvNo = generateInvoiceNumber();
            var entry = new invoiceLogisticsModel({
                orderNumber: warehousePoDoc[0].orderNumber,
                invoiceNumber: generateInvNo,
                traderId: warehousePoDoc[0].traderId,
                issuePoId: warehousePoDoc[0].issuePoId._id,
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
                                    orderNumber: warehousePoDoc[0].orderNumber,
                                    invoiceNumber: generateInvNo,
                                    traderId: warehousePoDoc[0].traderId,
                                    issuePoId: warehousePoDoc[0].issuePoId,
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
                                    }
                                })
                            }
                            if (i == docs.length - 1) {
                                var entry = new invoiceLogisticsDetailsModel({
                                    orderNumber: warehousePoDoc[0].orderNumber,
                                    invoiceNumber: generateInvNo,
                                    traderId: warehousePoDoc[0].traderId,
                                    issuePoId: warehousePoDoc[0].issuePoId,
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
                                        /*mail to Transport  */
                                        nodemailer.createTestAccount((err, account) => {
                                            if (warehousePoDoc[0].transportId == null || warehousePoDoc[0].transportId == undefined) {
                                                return;
                                            }
                                            var mailOptions = {
                                                from: '"Nicoza " <rxzone@gmail.com>',
                                                to: warehousePoDoc[0].transportId.email,
                                                subject: 'Request for Transport',
                                                css: `a{text-decoration: none;},
                                                    button{    background: rgba(0, 0, 255, 0.78);
                                                    border: none;
                                                    padding: 10px;}`,
                                                html: `<h3 style="color:blue;">Request for Transport</h3>
                                                    <div>Hello <b>${warehousePoDoc[0].transportId.registration_name}</b>,<br><br>
                                                    You have a request for Transport.<br>
                                                    Please check your account.<br><br>
                                                    Thanks,<br>
                                                    The Nicoza team.<br><br>
                                                    <p align="center">This message was sent by Nicoza.<p>
                                                    </div>`
                                            };
                                            transporter.sendMail(mailOptions, function (err, information) {
                                                if (err) callback(false);
                                                else callback(true);
                                            })
                                        });
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

//send request to warehouse PO
router.post('/postWarehousePo', token, function (req, res, next) {
    let obj = {
        $set: {
            "supplierPoStatus": "accept",
            "txtWarehouse": req.body.txtWarehouse,
            "txtTransportation": req.body.txtTransportation,
            "txtInsurance": req.body.txtInsurance,
            "txtClearing": req.body.txtClearing
        }
    }
    issuePoModel.updateMany({ '_id': req.body._id }, obj, function (err, statusDoc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            issuePoModel.find({ "_id": req.body._id }).populate([
                {
                    path: 'requestQuotationId',
                    model: 'requestQuotation'
                },
                {
                    path: 'supplierId',
                    model: 'trader'
                },
                {
                    path: 'buyerId',
                    model: 'trader'
                }
            ]).exec(function (err, IssuePodoc) {

                if (err) {
                    res.status(404).send({ message: "error" })
                }
                else {

                    var warehouse, transportation, clearing, insurance;
                    if (req.body.txtWarehouse != '') warehouse = req.body.txtWarehouse;
                    else warehouse = null;

                    if (req.body.txtTransportation != '') transportation = req.body.txtTransportation;
                    else transportation = null;

                    if (req.body.txtClearing != '') clearing = req.body.txtClearing;
                    else clearing = null;

                    if (req.body.txtInsurance != '') insurance = req.body.txtInsurance;
                    else insurance = null;
                    //    if(warehouse!==null){
                    const generateInvNo = generateInvoiceNumber();

                    var entry = new invoiceModel({
                        invoiceNumber: generateInvNo,
                        orderNumber: IssuePodoc[0].orderNumber,
                        txtWarehouse: warehouse,
                        txtTransportation: transportation,
                        txtFrightRate: req.body.txtFrightRate,
                        txtClearing: clearing,
                        txtInsurance: insurance,
                        txtWarehouseType: req.body.txtWarehouseType,
                        txtWarehouseService: req.body.txtWarehouseService,
                        TransportType: req.body.TransportType,
                        TransportName: req.body.TransportName,
                        txtClearingType: req.body.txtClearingType,
                        txtClearingName: req.body.txtClearingName,
                        txtInsuranceType: req.body.txtInsuranceType,
                        txtInsuranceName: req.body.txtInsuranceName,
                        supplierPoStatus: IssuePodoc[0].supplierPoStatus,
                        buyerPoStatus: IssuePodoc[0].buyerPoStatus,
                        issuePOId: req.body._id,
                        supplierId: IssuePodoc[0].supplierId,
                        buyerId: IssuePodoc[0].buyerId,
                        shipping: IssuePodoc[0].requestQuotationId.shipping,
                        requestQuotationId: IssuePodoc[0].requestQuotationId._id,
                        requestQuotationSupplierId: IssuePodoc[0].requestQuotationSupplierId,
                    })

                    entry.save(function (err, invoiceDoc) {
                        if (err) {
                            res.status(404).send({ message: "error" })
                        }
                        else {
                            var issuePoId = req.body._id;
                            var invoiceId = invoiceDoc._id;
                            issuePoProductModel.find({ 'issuePoId': issuePoId }, function (err, doc) {
                                if (err) res.status(404).send({ message: "error" })
                                else {
                                    if (doc.length >= 1) {
                                        doc.forEach(function (v, i) {
                                            if (i != doc.length - 1) {
                                                var entry = new invoiceProductModel({
                                                    invoiceNumber: generateInvNo,
                                                    orderNumber: IssuePodoc[0].orderNumber,
                                                    txtPaymentModeWithDiscount: v.txtPaymentModeWithDiscount,
                                                    txtTotalPrice: v.txtTotalPrice,
                                                    txtUnitPrice: v.txtUnitPrice,
                                                    txtNoOfItems: v.txtNoOfItems,
                                                    txtItemPerPackage: v.txtItemPerPackage,
                                                    txtPackagingWeight: v.txtPackagingWeight,
                                                    txtPackaging: v.txtPackaging,
                                                    txtShipping: v.txtShipping,
                                                    txtPaymentModeDiscount: v.txtPaymentModeDiscount,
                                                    txtEarlyPaymentTermDiscount: v.txtEarlyPaymentTermDiscount,
                                                    txtDiscountForEarlyPayment: v.txtDiscountForEarlyPayment,
                                                    createdAt: Date.now(),
                                                    updatedAt: Date.now(),
                                                    status: v.status,

                                                    buyerId: v.buyerId,
                                                    supplierId: v.supplierId,
                                                    productId: v.productId,
                                                    invoiceId: invoiceId,

                                                    requestQuotationId: v.requestQuotationId,
                                                    requestQuotationSupplierId: v.requestQuotationSupplierId,
                                                    issuePoId: issuePoId,
                                                })
                                                entry.save(function (err, productDoc) {
                                                    if (err) res.status(404).send({ message: "error" })
                                                    else { }
                                                })
                                            }
                                            if (i == doc.length - 1) {
                                                var entry = new invoiceProductModel({
                                                    invoiceNumber: generateInvNo,
                                                    orderNumber: IssuePodoc[0].orderNumber,
                                                    txtPaymentModeWithDiscount: v.txtPaymentModeWithDiscount,
                                                    txtTotalPrice: v.txtTotalPrice,
                                                    txtUnitPrice: v.txtUnitPrice,
                                                    txtNoOfItems: v.txtNoOfItems,
                                                    txtItemPerPackage: v.txtItemPerPackage,
                                                    txtPackagingWeight: v.txtPackagingWeight,
                                                    txtPackaging: v.txtPackaging,
                                                    txtShipping: v.txtShipping,
                                                    txtPaymentModeDiscount: v.txtPaymentModeDiscount,
                                                    txtEarlyPaymentTermDiscount: v.txtEarlyPaymentTermDiscount,
                                                    txtDiscountForEarlyPayment: v.txtDiscountForEarlyPayment,
                                                    createdAt: Date.now(),
                                                    updatedAt: Date.now(),
                                                    status: v.status,

                                                    buyerId: v.buyerId,
                                                    supplierId: v.supplierId,
                                                    productId: v.productId,
                                                    invoiceId: invoiceId,

                                                    requestQuotationId: v.requestQuotationId,
                                                    requestQuotationSupplierId: v.requestQuotationSupplierId,
                                                    issuePoId: issuePoId,
                                                })
                                                entry.save(function (err, productDoc) {
                                                    if (err) res.status(404).send({ message: "error" })
                                                    else {
                                                        generatePos(req, invoiceId, IssuePodoc, doc, function (status) {
                                                            if (status) {
                                                                res.status(200).send(statusDoc)
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
                        }
                    })

                    //    }
                    //    else{
                    //     const generateInvNo = generateInvoiceNumber();

                    //     var entry = new invoiceModel({
                    //         invoiceNumber: generateInvNo,
                    //         orderNumber: IssuePodoc[0].orderNumber,
                    //         txtWarehouse: warehouse,
                    //         txtTransportation: transportation,
                    //         txtFrightRate: req.body.txtFrightRate,
                    //         txtClearing: clearing,
                    //         txtInsurance: insurance,
                    //         txtWarehouseType: req.body.txtWarehouseType,
                    //         txtWarehouseService: req.body.txtWarehouseService,
                    //         TransportType: req.body.TransportType,
                    //         TransportName: req.body.TransportName,
                    //         txtClearingType: req.body.txtClearingType,
                    //         txtClearingName: req.body.txtClearingName,
                    //         txtInsuranceType: req.body.txtInsuranceType,
                    //         txtInsuranceName: req.body.txtInsuranceName,
                    //         supplierPoStatus: IssuePodoc[0].supplierPoStatus,
                    //         buyerPoStatus: IssuePodoc[0].buyerPoStatus,
                    //         issuePOId: req.body._id,
                    //         supplierId: IssuePodoc[0].supplierId,
                    //         buyerId: IssuePodoc[0].buyerId,
                    //         shipping: IssuePodoc[0].requestQuotationId.shipping,
                    //         requestQuotationId: IssuePodoc[0].requestQuotationId._id,
                    //         requestQuotationSupplierId: IssuePodoc[0].requestQuotationSupplierId,
                    //     })

                    //     entry.save(function (err, invoiceDoc) {
                    //         if (err) {
                    //             res.status(404).send({ message: "error" })
                    //         }
                    //         else {
                    //             var issuePoId = req.body._id;
                    //             var invoiceId = invoiceDoc._id;
                    //             issuePoProductModel.find({ 'issuePoId': issuePoId }, function (err, doc) {
                    //                 if (err) res.status(404).send({ message: "error" })
                    //                 else {
                    //                     if (doc.length >= 1) {
                    //                         doc.forEach(function (v, i) {
                    //                             if (i != doc.length - 1) {
                    //                                 var entry = new invoiceProductModel({
                    //                                     invoiceNumber: generateInvNo,
                    //                                     orderNumber: IssuePodoc[0].orderNumber,
                    //                                     txtPaymentModeWithDiscount: v.txtPaymentModeWithDiscount,
                    //                                     txtTotalPrice: v.txtTotalPrice,
                    //                                     txtUnitPrice: v.txtUnitPrice,
                    //                                     txtNoOfItems: v.txtNoOfItems,
                    //                                     txtItemPerPackage: v.txtItemPerPackage,
                    //                                     txtPackagingWeight: v.txtPackagingWeight,
                    //                                     txtPackaging: v.txtPackaging,
                    //                                     txtShipping: v.txtShipping,
                    //                                     txtPaymentModeDiscount: v.txtPaymentModeDiscount,
                    //                                     txtEarlyPaymentTermDiscount: v.txtEarlyPaymentTermDiscount,
                    //                                     txtDiscountForEarlyPayment: v.txtDiscountForEarlyPayment,
                    //                                     createdAt: Date.now(),
                    //                                     updatedAt: Date.now(),
                    //                                     status: v.status,

                    //                                     buyerId: v.buyerId,
                    //                                     supplierId: v.supplierId,
                    //                                     productId: v.productId,
                    //                                     invoiceId: invoiceId,

                    //                                     requestQuotationId: v.requestQuotationId,
                    //                                     requestQuotationSupplierId: v.requestQuotationSupplierId,
                    //                                     issuePoId: issuePoId,
                    //                                 })
                    //                                 entry.save(function (err, productDoc) {
                    //                                     if (err) res.status(404).send({ message: "error" })
                    //                                     else { }
                    //                                 })
                    //                             }
                    //                             if (i == doc.length - 1) {
                    //                                 var entry = new invoiceProductModel({
                    //                                     invoiceNumber: generateInvNo,
                    //                                     orderNumber: IssuePodoc[0].orderNumber,
                    //                                     txtPaymentModeWithDiscount: v.txtPaymentModeWithDiscount,
                    //                                     txtTotalPrice: v.txtTotalPrice,
                    //                                     txtUnitPrice: v.txtUnitPrice,
                    //                                     txtNoOfItems: v.txtNoOfItems,
                    //                                     txtItemPerPackage: v.txtItemPerPackage,
                    //                                     txtPackagingWeight: v.txtPackagingWeight,
                    //                                     txtPackaging: v.txtPackaging,
                    //                                     txtShipping: v.txtShipping,
                    //                                     txtPaymentModeDiscount: v.txtPaymentModeDiscount,
                    //                                     txtEarlyPaymentTermDiscount: v.txtEarlyPaymentTermDiscount,
                    //                                     txtDiscountForEarlyPayment: v.txtDiscountForEarlyPayment,
                    //                                     createdAt: Date.now(),
                    //                                     updatedAt: Date.now(),
                    //                                     status: v.status,

                    //                                     buyerId: v.buyerId,
                    //                                     supplierId: v.supplierId,
                    //                                     productId: v.productId,
                    //                                     invoiceId: invoiceId,

                    //                                     requestQuotationId: v.requestQuotationId,
                    //                                     requestQuotationSupplierId: v.requestQuotationSupplierId,
                    //                                     issuePoId: issuePoId,
                    //                                 })
                    //                                 entry.save(function (err, productDoc) {
                    //                                     if (err) res.status(404).send({ message: "error" })
                    //                                     else {
                    //                                         generatePos(req, invoiceId, IssuePodoc, doc, function (status) {
                    //                                             if (status) {
                    //                                                 res.status(200).send(statusDoc)
                    //                                             }
                    //                                             else {
                    //                                                 res.status(404).send('Error')
                    //                                             }
                    //                                         })
                    //                                     }
                    //                                 })
                    //                             }
                    //                         })
                    //                     }
                    //                 }
                    //             })
                    //         }
                    //     })

                    //    }


                }
            })
        }
    }
    )
})

function generatePos(req, invoiceId, issuePoDoc, productDoc, callback) {
    //when buyer selects CPT or CIF
    var entry = new acceptedPoTrackModel({
        orderPlaced: "accept",
        orderPacked: "pending",
        orderShipped: "pending",
        orderDelivered: "pending",
        issuePOId: req.body._id,
        orderNumber: issuePoDoc[0].orderNumber,
        supplierId: issuePoDoc[0].supplierId,
        buyerId: issuePoDoc[0].buyerId,
    })
    entry.save(function (err, track) {
        if (err) callback(false);
        else {
            invoiceModel.find({ '_id': invoiceId }).populate([
                {
                    path: 'txtWarehouse',
                    model: 'logisticsUser'
                },
                {
                    path: 'txtTransportation',
                    model: 'logisticsUser'
                },
                {
                    path: 'txtClearing',
                    model: 'logisticsUser'
                },
                {
                    path: 'txtInsurance',
                    model: 'logisticsUser'
                }
            ]).exec(function (err, invoiceDoc) {
                if (err) callback(false);
                else {
                    if (invoiceDoc[0].txtWarehouse !== null) {
                        var entry = new warehousePoModel({
                            orderNumber: invoiceDoc[0].orderNumber,
                            traderId: issuePoDoc[0].supplierId,
                            buyerId: issuePoDoc[0].buyerId,
                            issuePoId: req.body._id,
                            logisticsId: invoiceDoc[0].txtWarehouse,
                            requestQuotationId: issuePoDoc[0].requestQuotationId,
                            status: "pending",
                            warehouseId: invoiceDoc[0].txtWarehouse,
                            transportId: invoiceDoc[0].txtTransportation,
                            clearingId: invoiceDoc[0].txtClearing,
                            insuranceId: invoiceDoc[0].txtInsurance,
                            warehouseServices: invoiceDoc[0].txtWarehouseService,
                            transportServices: invoiceDoc[0].TransportName,
                            clearingServices: invoiceDoc[0].txtClearingName,
                            insuranceServices: invoiceDoc[0].txtInsuranceName,
                        })
                        entry.save(function (err, warehouseDoc) {
                            if (err) callback(false);
                            else {
                                issuePoProductModel.find({ 'issuePoId': req.body._id }, function (err, doc) {
                                    if (err) callback(false);
                                    else {
                                        if (doc.length >= 1) {
                                            doc.forEach(function (v, i) {
                                                if (i != doc.length - 1) {
                                                    var entry = new warehousePoProductModel({
                                                        orderNumber: issuePoDoc[0].orderNumber,
                                                        warehousePoId: warehouseDoc._id,
                                                        issuePoId: req.body._id,
                                                        productId: v.productId,
                                                        traderId: v.supplierId,
                                                        txtTotalPrice: v.txtTotalPrice,
                                                        txtUnitPrice: v.txtUnitPrice,
                                                        PricePerUnit: v.PricePerUnit,
                                                        txtNoOfItems: v.txtNoOfItems,
                                                        txtItemPerPackage: v.txtItemPerPackage,
                                                        txtPackagingWeight: v.txtPackagingWeight,
                                                        txtPackaging: v.txtPackaging,
                                                        txtShipping: v.txtShipping,
                                                    })
                                                    entry.save(function (err, docs) {
                                                        if (err) callback(false);
                                                        else { }
                                                    })
                                                }
                                                if (i == doc.length - 1) {
                                                    var entry = new warehousePoProductModel({
                                                        orderNumber: issuePoDoc[0].orderNumber,
                                                        warehousePoId: warehouseDoc._id,
                                                        issuePoId: req.body._id,
                                                        productId: v.productId,
                                                        traderId: v.supplierId,
                                                        txtTotalPrice: v.txtTotalPrice,
                                                        txtUnitPrice: v.txtUnitPrice,
                                                        PricePerUnit: v.PricePerUnit,
                                                        txtNoOfItems: v.txtNoOfItems,
                                                        txtItemPerPackage: v.txtItemPerPackage,
                                                        txtPackagingWeight: v.txtPackagingWeight,
                                                        txtPackaging: v.txtPackaging,
                                                        txtShipping: v.txtShipping,
                                                    })
                                                    entry.save(function (err, docs) {
                                                        if (err) callback(false);
                                                        else {

                                                            warehousePoModel.find({ '_id': warehouseDoc._id }).populate([
                                                                {
                                                                    path: 'warehouseId',
                                                                    model: 'logisticsUser'
                                                                }
                                                            ]).exec(function (err, docRes) {
                                                                if (err) callback(false);
                                                                else {


                                                                    /*mail to warehouse provider for accept and reject PO*/
                                                                    nodemailer.createTestAccount((err, account) => {
                                                                        var mailOptions = {
                                                                            from: '"Nicoza " <rxzone@gmail.com>',
                                                                            to: docRes[0].warehouseId.email,
                                                                            subject: 'Request for Warehouse',
                                                                            css: `a{text-decoration: none;},
                                                                                        button{    background: rgba(0, 0, 255, 0.78);
                                                                                        border: none;
                                                                                        padding: 10px;}`,
                                                                            html: `<h3 style="color:blue;">Request for Warehouse</h3>
                                                                                            <div>Hello <b>${docRes[0].warehouseId.registration_name}</b>,<br><br>
                                                                                            You have the request from Trader.<br>
                                                                                            Please check your account.<br><br>
                                                                                            Thanks,<br>
                                                                                            The Nicoza team.<br><br>
                                                                                            <p align="center">This message was sent by Nicoza.<p>
                                                                                            </div>`
                                                                        };
                                                                        transporter.sendMail(mailOptions, function (err, information) {
                                                                            if (err) callback(false);
                                                                            else {
                                                                                callback(true);
                                                                            }
                                                                        })
                                                                    });
                                                                }
                                                            })
                                                            //     }
                                                            // })
                                                        }
                                                    })
                                                    /*mail to buyer for accept and reject PO*/
                                                    nodemailer.createTestAccount((err, account) => {
                                                        var mailOptions = {
                                                            from: '"Nicoza " <rxzone@gmail.com>',
                                                            to: issuePoDoc[0].buyerId.email,
                                                            subject: 'Status of Issue PO',
                                                            css: `a{text-decoration: none;},
                                                button{    background: rgba(0, 0, 255, 0.78);
                                                border: none;
                                                padding: 10px;}`,
                                                            html: `<h3 style="color:blue;">Status of Issue PO</h3>
                                                <div>Hello <b>${issuePoDoc[0].buyerId.registration_name}</b>,<br><br>
                                                Your PO is <b>Accepted</b> by seller,${issuePoDoc[0].supplierId.registration_name}.<br>
                                                Please check your account.<br><br>
                                                Thanks,<br>
                                                The Nicoza team.<br><br>
                                                <p align="center">This message was sent by Nicoza.<p>
                                                </div>`
                                                        };
                                                        transporter.sendMail(mailOptions, function (err, information) {
                                                            if (err) { }
                                                            else {
                                                                callback(true);
                                                            }

                                                        })
                                                    });
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    }
                    else {
                        var entry = new transportPoModel({
                            orderNumber: invoiceDoc[0].orderNumber,
                            traderId: issuePoDoc[0].supplierId,
                            buyerId: issuePoDoc[0].buyerId,
                            issuePoId: req.body._id,
                            supplierId: issuePoDoc[0].supplierId,
                            logisticsId: invoiceDoc[0].txtTransportation,
                            requestQuotationId: issuePoDoc[0].requestQuotationId,
                            deliveryLocation: issuePoDoc[0].requestQuotationId.deliveryLocation._id,
                            status: "pending",
                            warehouseId: invoiceDoc[0].txtWarehouse,
                            transportId: invoiceDoc[0].txtTransportation,
                            clearingId: invoiceDoc[0].txtClearing,
                            insuranceId: invoiceDoc[0].txtInsurance,
                            warehouseServices: invoiceDoc[0].txtWarehouseService,
                            transportServices: invoiceDoc[0].TransportName,
                            clearingServices: invoiceDoc[0].txtClearingName,
                            insuranceServices: invoiceDoc[0].txtInsuranceName,
                        })
                        entry.save(function (err, transDoc) {
                            if (err) callback(false);
                            else {
                                issuePoProductModel.find({ 'issuePoId': req.body._id }, function (err, doc) {
                                    if (err) callback(false);
                                    else {
                                        if (doc.length >= 1) {
                                            doc.forEach(function (v, i) {
                                                if (i != doc.length - 1) {
                                                    var entry = new transportPoProductModel({
                                                        orderNumber: issuePoDoc[0].orderNumber,
                                                        transportPoId: transDoc._id,
                                                        issuePoId: req.body._id,
                                                        productId: v.productId,
                                                        traderId: v.supplierId,
                                                        txtTotalPrice: v.txtTotalPrice,
                                                        txtUnitPrice: v.txtUnitPrice,
                                                        PricePerUnit: v.PricePerUnit,
                                                        txtNoOfItems: v.txtNoOfItems,
                                                        txtItemPerPackage: v.txtItemPerPackage,
                                                        txtPackagingWeight: v.txtPackagingWeight,
                                                        txtPackaging: v.txtPackaging,
                                                        txtShipping: v.txtShipping,
                                                    })
                                                    entry.save(function (err, docs) {
                                                        if (err) callback(false);
                                                        else { }
                                                    })
                                                }
                                                if (i == doc.length - 1) {
                                                    var entry = new transportPoProductModel({
                                                        orderNumber: issuePoDoc[0].orderNumber,
                                                        transportPoId: transDoc._id,
                                                        issuePoId: req.body._id,
                                                        productId: v.productId,
                                                        traderId: v.supplierId,
                                                        txtTotalPrice: v.txtTotalPrice,
                                                        txtUnitPrice: v.txtUnitPrice,
                                                        PricePerUnit: v.PricePerUnit,
                                                        txtNoOfItems: v.txtNoOfItems,
                                                        txtItemPerPackage: v.txtItemPerPackage,
                                                        txtPackagingWeight: v.txtPackagingWeight,
                                                        txtPackaging: v.txtPackaging,
                                                        txtShipping: v.txtShipping,
                                                    })
                                                    entry.save(function (err, docs) {
                                                        if (err) callback(false);
                                                        else {

                                                            transportPoModel.find({ '_id': transDoc._id }).populate([
                                                                {
                                                                    path: 'transportId',
                                                                    model: 'logisticsUser'
                                                                }
                                                            ]).exec(function (err, docRes) {
                                                                if (err) callback(false);
                                                                else {


                                                                    /*mail to warehouse provider for accept and reject PO*/
                                                                    nodemailer.createTestAccount((err, account) => {
                                                                        var mailOptions = {
                                                                            from: '"Nicoza " <rxzone@gmail.com>',
                                                                            to: docRes[0].transportId.email,
                                                                            subject: 'Request for transport',
                                                                            css: `a{text-decoration: none;},
                                                                                        button{    background: rgba(0, 0, 255, 0.78);
                                                                                        border: none;
                                                                                        padding: 10px;}`,
                                                                            html: `<h3 style="color:blue;">Request for Warehouse</h3>
                                                                                            <div>Hello <b>${docRes[0].transportId.registration_name}</b>,<br><br>
                                                                                            You have the request from Trader.<br>
                                                                                            Please check your account.<br><br>
                                                                                            Thanks,<br>
                                                                                            The Nicoza team.<br><br>
                                                                                            <p align="center">This message was sent by Nicoza.<p>
                                                                                            </div>`
                                                                        };
                                                                        transporter.sendMail(mailOptions, function (err, information) {
                                                                            if (err) callback(false);
                                                                            else {
                                                                                callback(true);
                                                                            }
                                                                        })
                                                                    });
                                                                }
                                                            })
                                                            //     }
                                                            // })
                                                        }
                                                    })
                                                    /*mail to buyer for accept and reject PO*/
                                                    nodemailer.createTestAccount((err, account) => {
                                                        var mailOptions = {
                                                            from: '"Nicoza " <rxzone@gmail.com>',
                                                            to: issuePoDoc[0].buyerId.email,
                                                            subject: 'Status of Issue PO',
                                                            css: `a{text-decoration: none;},
                                                button{    background: rgba(0, 0, 255, 0.78);
                                                border: none;
                                                padding: 10px;}`,
                                                            html: `<h3 style="color:blue;">Status of Issue PO</h3>
                                                <div>Hello <b>${issuePoDoc[0].buyerId.registration_name}</b>,<br><br>
                                                Your PO is <b>Accepted</b> by seller,${issuePoDoc[0].supplierId.registration_name}.<br>
                                                Please check your account.<br><br>
                                                Thanks,<br>
                                                The Nicoza team.<br><br>
                                                <p align="center">This message was sent by Nicoza.<p>
                                                </div>`
                                                        };
                                                        transporter.sendMail(mailOptions, function (err, information) {
                                                            if (err) { }
                                                            else {
                                                                callback(true);
                                                            }

                                                        })
                                                    });
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    }


                    // }
                    // ----------------------
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
