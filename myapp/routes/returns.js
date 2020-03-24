const express = require('express'),
    router = express.Router(),
    issuePoModel = require('../models/issuePoModel'),
    issuePoProductModel = require('../models/issuePoProductModel'),
    returnPoModel = require('../models/returnPoModel'),
    returnPoProductModel = require('../models/returnPoProductModel'),
    notificationModel = require('../models/notificationModel'),
    productSellerModel = require('../models/productSellerModel'),
    returnOrderTrackModel = require('../models/returnOrderTrackModel'),
    token = require('../middleware/token'),
    nodemailer = require('nodemailer'),
    transporter = require('../config/mailconfig');

router.post('/saveReturnData', token, function (req, res, next) {

    var productidArray = req.body.items.map(function (item) {
        return item.hiddenId;
    });

    var getRequest = req.body;

    issuePoModel.find({ "_id": req.body.issuePoId }, function (err, issuePoDoc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            if (issuePoDoc.length >= 1) {
                var entry = new returnPoModel({
                    invoiceNumber: issuePoDoc[0].invoiceNumber,
                    orderNumber: issuePoDoc[0].orderNumber,
                    warehouseProvider: issuePoDoc[0].warehouseProvider,
                    transportProvider: issuePoDoc[0].transportProvider,
                    freightRate: issuePoDoc[0].freightRate,
                    clearingForwardingAgent: issuePoDoc[0].clearingForwardingAgent,
                    insuranceAgent: issuePoDoc[0].insuranceAgent,
                    supplierPoStatus: issuePoDoc[0].supplierPoStatus,
                    buyerPoStatus: issuePoDoc[0].buyerPoStatus,
                    supplierReturnStatus: "pending",
                    paymentStatus: "unpaid",
                    supplierId: issuePoDoc[0].supplierId,
                    buyerId: issuePoDoc[0].buyerId,
                    issuePoId: issuePoDoc[0]._id,
                    requestQuotationId: issuePoDoc[0].requestQuotationId,
                    requestQuotationSupplierId: issuePoDoc[0].requestQuotationSupplierId,
                    txtComment: getRequest.txtComment,
                    txtCreditNote: getRequest.txtCreditNote,
                    txtReasonForReturn: getRequest.txtReasonForReturn,
                })
                entry.save(function (err, doc) {
                    if (err) {
                        res.status(404).send(err);
                        return;
                    }
                    else {
                        var returnPoId = doc._id;
                        issuePoProductModel.find({ 'productId': { $in: productidArray }, issuePoId: getRequest.issuePoId }, function (err, op) {
                            if (err) {
                                res.status(404).send({ message: "error" })
                                return;
                            }
                            else {
                                if (op.length >= 1) {
                                    op.forEach(function (v, i) {

                                        if (i != op.length - 1) {

                                            var entry = new returnPoProductModel({
                                                invoiceNumber: issuePoDoc[0].invoiceNumber,
                                                orderNumber: issuePoDoc[0].orderNumber,
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
                                                qunatityDelievered: v.qunatityDelievered,
                                                returnedQty: getRequest.items[i]['txtQunatityToBeReturned'],
                                                createdAt: Date.now(),
                                                updatedAt: Date.now(),
                                                status: v.status,
                                                returnPoId: returnPoId,
                                                buyerId: v.buyerId,
                                                supplierId: v.supplierId,
                                                productId: v.productId,

                                                requestQuotationId: v.requestQuotationId,
                                                requestQuotationSupplierId: v.requestQuotationSupplierId,
                                                issuePoId: getRequest.issuePoId,

                                            })

                                            entry.save(function (err, doc) {

                                                if (err) {
                                                    res.status(404).send({ message: "error" })
                                                }
                                                else {
                                                }
                                            })
                                        }

                                        if (i == op.length - 1) {

                                            var entry = new returnPoProductModel({
                                                invoiceNumber: issuePoDoc[0].invoiceNumber,
                                                orderNumber: issuePoDoc[0].orderNumber,
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
                                                qunatityDelievered: v.qunatityDelievered,
                                                returnedQty: getRequest.items[i]['txtQunatityToBeReturned'],
                                                createdAt: Date.now(),
                                                updatedAt: Date.now(),
                                                status: v.status,
                                                returnPoId: returnPoId,

                                                buyerId: v.buyerId,
                                                supplierId: v.supplierId,
                                                productId: v.productId,

                                                requestQuotationId: v.requestQuotationId,
                                                requestQuotationSupplierId: v.requestQuotationSupplierId,
                                                issuePoId: getRequest.issuePoId,

                                            })

                                            entry.save(function (err, doc) {

                                                if (err) {
                                                    res.status(404).send({ message: "error" })
                                                }
                                                else {

                                                    //Return order notification
                                                    var entry = new notificationModel({
                                                        traderId: req.body.traderId,
                                                        message: 'ORDER is returned',
                                                        // route : '',
                                                        // read : ,
                                                    });
                                                    entry.save(function (err, docs) {
                                                        if (err) res.status(404).send({ message: "error" })
                                                        else {
                                                            // res.status(200).send(doc);
                                                            saveReturnOrderTracking(doc, function (status) {
                                                                if (status) {
                                                                    res.status(200).send(doc)
                                                                }
                                                                else {
                                                                    res.status(404).send('Error')
                                                                }
                                                            })
                                                        }
                                                    });

                                                }
                                            })

                                        }
                                    })
                                }
                            }

                        })


                        //mail to buyer and supplier for return order
                        nodemailer.createTestAccount((err, account) => {
                            var mailIds = [req.body.SupplierEmail, req.body.BuyerEmail];
                            var mailOptions = {
                                from: '"Nicoza " <rxzone@gmail.com>',
                                to: mailIds,

                                subject: 'Return Order',
                                css: `a{text-decoration: none;},
                                    button{    background: rgba(0, 0, 255, 0.78);
                                    border: none;
                                    padding: 10px;}`,
                                html: `<h3 style="color:blue;">Return Order</h3>
								<div>Hello from Nicoza,<br><br>
                                      Your order <b>${issuePoDoc[0].orderNumber}</b> is returned due to ${getRequest.txtReasonForReturn}.<br>
									  Please check your Account.<br><br>
									  Thanks,<br>
									  The Nicoza team.<br><br>
									  <p align="center">This message was sent by Nicoza.<p>
								</div>`
                            };

                            transporter.sendMail(mailOptions, function (err, information) {
                                if (err) {
                                }
                                res.status(200).send({ email: mailIds });
                            })

                        })
                    }
                })
            }
        }
    })
})

function saveReturnOrderTracking(doc, callback) {
    var entry = new returnOrderTrackModel({
        orderPacked: "pending",
        orderShipped: "pending",
        orderDelivered: "pending",
        orderReceived: "pending",
        issuePoId: doc.issuePoId,
        returnPoId: doc.returnPoId,
        supplierId: doc.supplierId,
        buyerId: doc.buyerId,
        requestQuotationId: doc.requestQuotationId,
        requestQuotationSupplierId: doc.requestQuotationSupplierId,
    })
    entry.save(function (err, doc) {
        if (err) {
            callback(false);
        }
        else {
            callback(true);
        }
    })
}


router.get('/getReturnsPending', token, function (req, res, next) {
    returnPoModel.find({ 'supplierId': req.body.traderId }, function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    });
})

router.get('/getReturnsCompleted', token, function (req, res, next) {
    returnPoModel.find({ 'supplierId': req.body.traderId, "supplierReturnStatus": "received", "paymentStatus": "paid" }, function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    });
})

router.post('/getReturnsProducts', token, function (req, res, next) {

    returnPoProductModel.find({ 'returnPoId': req.body._id }).populate([
        {
            path: 'productId',
            model: 'productSeller',
            populate: {
                path: 'productId',
                model: 'product'
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
    ]).exec(function (err, doc) {

        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    });

})

router.post('/getReturnsCompletedProducts', token, function (req, res, next) {

    returnPoProductModel.find({ 'returnPoId': req.body._id }).populate([
        {
            path: 'productId',
            model: 'productSeller',
            populate: {
                path: 'productId',
                model: 'product'
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
    ]).exec(function (err, doc) {

        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    });

})

router.post('/getReturnOrderTrackingStatus', token, function (req, res, next) {
    returnOrderTrackModel.find({ 'returnPoId': req.body._id }, function (err, doc) {
        if (err) {
            res.status(404).send(err)
            return;
        }
        else {
            res.status(200).send(doc)
        }
    })
})

router.post('/postSupplierReturnStatus', token, function (req, res, next) {
    returnPoModel.update({ '_id': req.body._id },
        { $set: { "supplierReturnStatus": "received" } }, function (err, statusDoc) {
            if (err) {
                res.status(404).send({ message: "error" })
            }
            else {
                returnOrderTrackModel.update({ 'returnPoId': req.body._id },
                    { $set: { "orderReceived": "received" } }, function (err, statusDocc) {
                        if (err) {
                            res.status(404).send({ message: "error" })
                        }
                        else {

                            //update the product inventory
                            returnPoProductModel.find({ 'returnPoId': req.body._id }).populate([
                                {
                                    path: 'productId',
                                    model: 'productSeller'
                                }
                            ]).exec(function (err, doc) {
                                if (err) {
                                    res.status(404).send({ message: "error" })
                                } else {
                                    if (doc.length >= 1) {
                                        doc.forEach(function (v, i) {
                                            if (i != doc.length - 1) {
                                                var txtStockAvailable = parseInt(v.productId.txtStockAvailable);
                                                var returnedQty = parseInt(v.returnedQty);
                                                var qunatityAdd = txtStockAvailable + returnedQty;

                                                productSellerModel.update({ '_id': v.productId._id },
                                                    { $set: { "txtStockAvailable": qunatityAdd } }, function (err, docs) {
                                                        if (err) {
                                                            res.status(404).send({ message: "error" })
                                                        }
                                                        else {
                                                        }
                                                    });
                                            }
                                            if (i == doc.length - 1) {
                                                var txtStockAvailable = parseInt(v.productId.txtStockAvailable);
                                                var returnedQty = parseInt(v.returnedQty);
                                                var qunatityAdd = txtStockAvailable + returnedQty;

                                                productSellerModel.update({ '_id': v.productId._id },
                                                    { $set: { "txtStockAvailable": qunatityAdd } }, function (err, docs) {
                                                        if (err) {
                                                            res.status(404).send({ message: "error" })
                                                        }
                                                        else {
                                                            res.status(200).send(statusDoc)
                                                        }
                                                    });
                                            }
                                        })
                                    }

                                }
                            })

                        }
                    })
            }
        })
})

module.exports = router;
