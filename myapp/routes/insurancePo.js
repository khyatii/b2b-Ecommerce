const express = require('express');
const router = express.Router();
const insurancePoModel = require('../models/insurancePoModel'),
    insurancePoProductModel = require('../models/insurancePoProductModel'),
    invoiceLogisticsModel = require('../models/invoiceLogisticsModel'),
    invoiceLogisticsDetailsModel = require('../models/invoiceLogisticsDetailsModel'),
    logisticcategoryModel = require('../models/logisticcategoryModel'),
    multipleLogisticPoModel = require('../models/multipleLogisticPoModel'),
    multipleLogisticsPoProductModel = require('../models/multipleLogisticsPoProductModel'),
    nodemailer = require('nodemailer'),
    transporter = require('../config/mailconfig'),
    logisticToken = require('../middleware/logisticToken');

router.get('/getPendingInsurancePo', logisticToken, function (req, res, next) {
    insurancePoModel.find({ 'insuranceId': req.body.logisticsId, "status": "pending" }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'insuranceId',
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

router.post('/getSingleInsurancePo', logisticToken, function (req, res, next) {
    insurancePoModel.find({ '_id': req.body._id }, function (err, doc) {
        if (err) res.status(404).send({ message: "error" })
        else {
            logisticcategoryModel.find({
                $and: [
                    { 'ServiceName': { $in: doc[0].insuranceServices } },
                    { 'logisticsId': doc[0].insuranceId },
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

router.get('/getCompletedInsurancePo', logisticToken, function (req, res, next) {
    insurancePoModel.find({ 'insuranceId': req.body.logisticsId, "status": "accept" }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'insuranceId',
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

router.post('/getInsuranceProduct', logisticToken, function (req, res, next) {
    insurancePoProductModel.find({ 'insurancePoId': req.body._id }).populate([
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
        },
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'insurancePoId',
            model: 'insurancePo',
            populate: {
                path: 'insuranceId',
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

router.post('/postInsurancePoStatus', logisticToken, function (req, res, next) {
    insurancePoModel.update({ '_id': req.body._id },
        { $set: { "status": req.body.status } }, function (err, statusDoc) {
            if (err) {
                res.status(404).send({ message: "error" })
            }
            else {
                insurancePoModel.find({ '_id': req.body._id }).populate([
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
                ]).exec(function (err, insurancePoDoc) {
                    if (err) res.status(404).send(err)
                    else {
                        saveInvoiceLogistics(insurancePoDoc, function (status) {
                            if (status) {
                                res.status(200).send(statusDoc)
                            }
                            else {
                                res.status(404).send('Error')
                            }
                        })

                        /* mail to seller to notify warehouse accept request  */
                        nodemailer.createTestAccount((err, account) => {
                            var mailOptions = {
                                from: '"Nicoza " <rxzone@gmail.com>',
                                to: insurancePoDoc[0].traderId.email,
                                subject: 'Status of Insurance',
                                css: `a{text-decoration: none;},
                                    button{    background: rgba(0, 0, 255, 0.78);
                                    border: none;
                                    padding: 10px;}`,
                                html: `<h3 style="color:blue;">Status of Insurance</h3>
                                    <div>Hello <b>${insurancePoDoc[0].traderId.registration_name}</b>,<br><br>
                                    Your ORDER is <b>${req.body.status}ed</b> by Insurance.<br>
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
        }
    )
})

//Send invoices to trader by Insurance Agrnts
function saveInvoiceLogistics(insurancePoDoc, callback) {

    logisticcategoryModel.find({
        $and: [
            { 'ServiceName': { $in: insurancePoDoc[0].insuranceServices } },
            { 'logisticsId': insurancePoDoc[0].insuranceId },
        ]
    }, function (err, docs) {
        if (err) callback(false);
        else {
            const generateInvNo = generateInvoiceNumber();
            var entry = new invoiceLogisticsModel({
                orderNumber: insurancePoDoc[0].orderNumber,
                invoiceNumber: generateInvNo,
                traderId: insurancePoDoc[0].traderId,
                issuePoId: insurancePoDoc[0].issuePoId._id,
                serviceType: docs[0].ServiceCategory,
                logisticsId: insurancePoDoc[0].insuranceId,
                status: "unpaid"
            })
            entry.save(function (err, invoiceDoc) {
                if (err) callback(false);
                else {
                    if (docs.length >= 1) {
                        docs.forEach(function (v, i) {
                            if (i != docs.length - 1) {
                                var entry = new invoiceLogisticsDetailsModel({
                                    orderNumber: insurancePoDoc[0].orderNumber,
                                    invoiceNumber: generateInvNo,
                                    traderId: insurancePoDoc[0].traderId,
                                    issuePoId: insurancePoDoc[0].issuePoId,
                                    invoiceLogisticsId: invoiceDoc._id,
                                    logisticsId: insurancePoDoc[0].insuranceId,
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
                                    orderNumber: insurancePoDoc[0].orderNumber,
                                    invoiceNumber: generateInvNo,
                                    traderId: insurancePoDoc[0].traderId,
                                    issuePoId: insurancePoDoc[0].issuePoId,
                                    invoiceLogisticsId: invoiceDoc._id,
                                    logisticsId: insurancePoDoc[0].insuranceId,
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

router.get('/getpendingMultiplePo', logisticToken, function (req, res, next) {
    multipleLogisticPoModel.find({ 'logisticsId': req.body.logisticsId, "status": "pending" }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'logisticsId',
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
router.get('/getapprovedMultiplePo', logisticToken, function (req, res, next) {
    multipleLogisticPoModel.find({ 'logisticsId': req.body.logisticsId, "status": "accept" }).populate([
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'logisticsId',
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
router.post('/getMulitpleProduct', logisticToken, function (req, res, next) {
    multipleLogisticsPoProductModel.find({ 'multiplePoId': req.body._id }).populate([
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
        },
        {
            path: 'traderId',
            model: 'trader',
        },
        {
            path: 'logisticsId',
            model: 'logisticsUser',
        },
    ]).exec(function (err, doc) {
        if (err) res.status(404).send({ message: "error" })
        else res.status(200).send(doc);
    });
})
router.post('/getSingleMultiplePo', logisticToken, function (req, res, next) {
    multipleLogisticPoModel.find({ '_id': req.body._id }).populate([
        {
            path: 'warehouseId',
            model: 'logisticsUser',
        },
        {
            path: 'transportId',
            model: 'logisticsUser',
        },
    ]).exec(function (err, doc) {
        if (err) res.status(404).send({ message: "error" })
        else {
   
            logisticcategoryModel.find({ 'ServiceName': { $in: doc[0].insuranceServices } }, function (err, docs) {
                if (err) res.status(404).send({ message: "error" })
                else {
                    res.status(200).send(doc);
                }
            })
        }
    })
})
router.post('/postMultiplePoStatus', logisticToken, function (req, res, next) {
    multipleLogisticPoModel.update({ '_id': req.body._id },
        { $set: { "status": req.body.status } }, function (err, statusDoc) {
            if (err) {
                res.status(404).send({ message: "error" })
            }
            else {
                multipleLogisticPoModel.find({ '_id': req.body._id }).populate([
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
                        path: 'logisticsId',
                        model: 'logisticsUser',
                    },
                    {
                        path: 'traderId',
                        model: 'trader',
                    },
                ]).exec(function (err, multiplePoDoc) {
                    if (err) res.status(404).send(err)
                    else {
                        saveInvoiceMultipleLogistics(multiplePoDoc, function (status) {
                            if (status) {
                                res.status(200).send(statusDoc)
                            }
                            else {
                                res.status(404).send('Error')
                            }
                        })

                        /* mail to seller to notify warehouse accept request  */
                        nodemailer.createTestAccount((err, account) => {
                            var mailOptions = {
                                from: '"Nicoza " <rxzone@gmail.com>',
                                to: multiplePoDoc[0].traderId.email,
                                subject: 'Status of Insurance',
                                css: `a{text-decoration: none;},
                                    button{    background: rgba(0, 0, 255, 0.78);
                                    border: none;
                                    padding: 10px;}`,
                                html: `<h3 style="color:blue;">Status of Insurance</h3>
                                    <div>Hello <b>${multiplePoDoc[0].traderId.registration_name}</b>,<br><br>
                                    Your ORDER is <b>${req.body.status}ed</b> by Insurance.<br>
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
        }
    )
})
//Send invoices to trader by Multiple Logistics Service Providers
function saveInvoiceMultipleLogistics(multiplePoDoc, callback) {


    var warehouseServices, transportServices, clearingServices, insuranceServices;

    if (multiplePoDoc[0].logisticsId.logistics_type_multiple == 'Warehouse') {
        warehouseServices = multiplePoDoc[0].warehouseServices
    } else {
        warehouseServices = multiplePoDoc[0].warehouseServices
    }

    logisticcategoryModel.find({ 'ServiceName': { $in: multiplePoDoc[0].insuranceServices } }, function (err, docs) {
        if (err) callback(false);
        else {
            callback(true);
            // const generateInvNo = generateInvoiceNumber();
            // var entry = new invoiceLogisticsModel({
            //     orderNumber: multiplePoDoc[0].orderNumber,
            //     invoiceNumber: generateInvNo,
            //     traderId: multiplePoDoc[0].traderId,
            //     issuePoId: multiplePoDoc[0].issuePoId._id,
            //     serviceType: docs[0].ServiceCategory,
            //     logisticsId: multiplePoDoc[0].insuranceId,
            //     status: "unpaid"
            // })
            // entry.save(function (err, invoiceDoc) {
            //     if (err) callback(false);
            //     else {
            //         if (docs.length >= 1) {
            //             docs.forEach(function (v, i) {
            //                 if (i != docs.length - 1) {
            //                     var entry = new invoiceLogisticsDetailsModel({
            //                         orderNumber: multiplePoDoc[0].orderNumber,
            //                         invoiceNumber: generateInvNo,
            //                         traderId: multiplePoDoc[0].traderId,
            //                         issuePoId: multiplePoDoc[0].issuePoId,
            //                         invoiceLogisticsId: invoiceDoc._id,
            //                         logisticsId: multiplePoDoc[0].insuranceId,
            //                         serviceType: v.ServiceCategory,
            //                         serviceName: v.ServiceName,
            //                         serviceDescription: v.ServiceDescription,
            //                         units: v.Unit,
            //                         pricePerUnits: v.PricePerUnit,
            //                         ServiceUrl: v.ServiceUrl,
            //                         PriceRules: v.PriceRules,
            //                         createdAt: Date.now(),
            //                         updatedAt: Date.now(),
            //                     })
            //                     entry.save(function (err, docu) {
            //                         if (err) callback(false);
            //                         else { }
            //                     })
            //                 }
            //                 if (i == docs.length - 1) {
            //                     var entry = new invoiceLogisticsDetailsModel({
            //                         orderNumber: multiplePoDoc[0].orderNumber,
            //                         invoiceNumber: generateInvNo,
            //                         traderId: multiplePoDoc[0].traderId,
            //                         issuePoId: multiplePoDoc[0].issuePoId,
            //                         invoiceLogisticsId: invoiceDoc._id,
            //                         logisticsId: multiplePoDoc[0].insuranceId,
            //                         serviceType: v.ServiceCategory,
            //                         serviceName: v.ServiceName,
            //                         serviceDescription: v.ServiceDescription,
            //                         units: v.Unit,
            //                         pricePerUnits: v.PricePerUnit,
            //                         ServiceUrl: v.ServiceUrl,
            //                         PriceRules: v.PriceRules,
            //                         createdAt: Date.now(),
            //                         updatedAt: Date.now(),
            //                     })
            //                     entry.save(function (err, docu) {
            //                         if (err) callback(false);
            //                         else {
            //                             callback(true);
            //                         }
            //                     })
            //                 }
            //             })
            //         }
            //     }
            // })
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
