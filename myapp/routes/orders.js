const express = require('express'),
    router = express.Router(),
    issuePoModel = require('../models/issuePoModel'),
    issuePoProductModel = require('../models/issuePoProductModel'),
    notificationModel = require('../models/notificationModel'),
    acceptedPoTrackModel = require('../models/acceptedPoTrackModel'),
    productSellerModel = require('../models/productSellerModel'),
    token = require('../middleware/token'),
    invoiceModel = require('../models/invoiceModel'),
    nodemailer = require('nodemailer'),
    transporter = require('../config/mailconfig');

//Accepted orders for Buyer
router.get('/getAllAcceptPo', token, function (req, res, next) {
    issuePoModel.find({ 'buyerId': req.body.traderId, "supplierPoStatus": "accept", "buyerPoStatus": "pending" }).populate([
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

//Accepted product details for Buyer
router.post('/getAllPoProduct', token, function (req, res, next) {
    issuePoProductModel.find({ 'issuePoId': req.body._id }).populate([
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
        {
            path: 'issuePoId',
            model: 'issuePo',
        },
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    });
});

//completed PO Supplier
router.get('/getAllCompletedPo', token, function (req, res, next) {
    issuePoModel.find({
        'supplierId': req.body.traderId, "supplierPoStatus": "accept",
        $or: [{ buyerPoStatus: "received" }, { buyerPoStatus: "cancel" }]
    }).populate([
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

//completed PO product detail Supplier
router.post('/getAllCompletedPoProduct', token, function (req, res, next) {

    issuePoProductModel.find({ 'issuePoId': req.body._id }).populate([
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
    ]).exec(function (err, doc) {

        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    });

})

router.get('/getAllRecievingGoods', token, function (req, res, next) {
    issuePoModel.find({ 'buyerId': req.body.traderId, "supplierPoStatus": "accept", "buyerPoStatus": "pending" }).populate([
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

router.get('/getAllCompletedGoods', token, function (req, res, next) {
    issuePoModel.find({ 'buyerId': req.body.traderId, "supplierPoStatus": "accept", "buyerPoStatus": "received" }).populate([
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


router.post('/postSupplierPoStatus', token, function (req, res, next) {

    issuePoModel.update({ '_id': req.body._id },
        { $set: { "supplierPoStatus": req.body.status } }, function (err, doc) {
            if (err) {
                res.status(404).send({ message: "error" })
            }
            else {
                res.status(200).send(doc);
            }
        })
})

router.post('/postBuyerPoStatus', token, function (req, res, next) {

    issuePoModel.update({ '_id': req.body._id },
        { $set: { "buyerPoStatus": req.body.status } }, function (err, doc) {
            if (err) {
                res.status(404).send({ message: "error" })
            }
            else {
                //notification for cancel order
                var entry = new notificationModel({
                    traderId: req.body.traderId,
                    message: 'Your order is ' + req.body.status,
                });
                entry.save(function (err, docs) {
                    if (err) res.status(404).send({ message: "error" })
                    else {
                        //mail to supplier if buyer cancel the order
                        nodemailer.createTestAccount((err, account) => {
                            var mailOptions = {
                                from: '"Nicoza " <rxzone@gmail.com>',
                                to: req.body.email,

                                subject: 'Status of Order',
                                css: `a{text-decoration: none;},
                                    button{    background: rgba(0, 0, 255, 0.78);
                                    border: none;
                                    padding: 10px;}`,
                                html: `<h3 style="color:blue;">Status of Order</h3>
            							<div>Hello <b>${req.body.email}</b>,<br><br>
                                            Your Order is <b>${req.body.status}ed</b> by Buyer. Please check your account.<br><br>
  											Thanks,<br>
                      						The Nicoza team.<br><br>
  											<p align="center">This message was sent by Nicoza.<p>
                						</div>`
                            };
                            transporter.sendMail(mailOptions, function (err, information) {
                                if (err) {
                                }
                                res.status(200).send(doc);
                            })
                        });
                    }
                });
            }
        }
    )
})

router.get('/getOrderTrackingStatus', token, function (req, res, next) {
    acceptedPoTrackModel.find({}, function (err, doc) {
        if (err) {
            res.status(404).send(err)
            return;
        }
        else {
            res.status(200).send(doc)
        }
    })
})

router.post('/getPoTrackingStatus', token, function (req, res, next) {
    acceptedPoTrackModel.find({ 'issuePOId': req.body._id }, function (err, doc) {
        if (err) {
            res.status(404).send(err)
            return;
        }
        else {
            res.status(200).send(doc)
        }
    })
})

router.post('/receivingOfGoods', token, function (req, res, next) {

    var items = req.body.items;
    issuePoModel.update({ '_id': req.body._id }, {
        $set: {
            "buyerPoStatus": "received",
            'deliveryDate': Date.now(),
            'comments': req.body.txtComments,
            //  'location': ,
        }
    }, function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            items.forEach(function (element, index) {
                if (index != items.length - 1) {
                    issuePoProductModel.update({ '_id': element.hiddenId },
                        { $set: { "qunatityDelievered": element.qty } }, function (err, doc) {
                            if (err) {
                                res.status(404).send({ message: "error" })
                            }
                            else { }
                        })
                }
                else if (index == items.length - 1) {
                    issuePoProductModel.update({ '_id': element.hiddenId },
                        { $set: { "qunatityDelievered": element.qty } }, function (err, doc) {
                            if (err) {
                                res.status(404).send({ message: "error" })
                            }
                            else {
                                var entry = new notificationModel({
                                    traderId: req.body.traderId,
                                    message: 'Goods is delivered',
                                });
                                entry.save(function (err, docs) {
                                    if (err) res.status(404).send({ message: "error" })
                                    else {
                                        //mail to supplier if buyer cancel the order
                                        nodemailer.createTestAccount((err, account) => {
                                            var mailOptions = {
                                                from: '"Nicoza " <rxzone@gmail.com>',
                                                to: req.body.email,

                                                subject: 'Status of Order',
                                                css: `a{text-decoration: none;},
                                                            button{    background: rgba(0, 0, 255, 0.78);
                                                            border: none;
                                                            padding: 10px;}`,
                                                html: `<h3 style="color:blue;">Status of Order</h3>
            							                    <div>Hello <b>${req.body.email}</b>,<br><br>
                                                                Your Goods delivered to Buyer. Please check your account.<br><br>
  											                    Thanks,<br>
                      						                    The Nicoza team.<br><br>
  											                    <p align="center">This message was sent by Nicoza.<p>
                						                    </div>`
                                            };
                                            transporter.sendMail(mailOptions, function (err, information) {
                                                if (err) {
                                                }
                                                else {
                                                    updateOrderDeliveredStatus(req, function (status) {
                                                        if (status) {
                                                            res.status(200).send(doc)
                                                        }
                                                        else {
                                                            res.status(404).send('Error')
                                                        }
                                                    })
                                                }
                                            })
                                        });
                                    }
                                });
                            }
                        }
                    )
                }
            });
        }
    })
})

//update product Inventory
function updateOrderDeliveredStatus(req, callback) {
    var items = req.body.items;
    acceptedPoTrackModel.update({ 'issuePOId': req.body._id },
        { $set: { "buyerPoStatus": "received", "orderDelivered": "received" } }, function (err, docs) {
            if (err) {
                callback(false);
            }
            else {
                items.forEach(function (element, index) {
                    if (index != items.length - 1) {

                        issuePoProductModel.find({ '_id': element.hiddenId }).populate([
                            {
                                path: 'productId',
                                model: 'productSeller'
                            }
                        ]).exec(function (err, docu) {
                            if (err) {
                                callback(false)
                            } else {

                                var txtStockAvailable = parseInt(docu[0].productId.txtStockAvailable);
                                var qunatityDelievered = parseInt(element.qty);
                                var qunatityLeft = txtStockAvailable - qunatityDelievered;
                                productSellerModel.update({ '_id': docu[0].productId._id },
                                    { $set: { "txtStockAvailable": qunatityLeft } }, function (err, doc) {
                                        if (err) {
                                            callback(false);
                                        }
                                        else {
                                        }
                                    });
                            }
                        })
                    }

                    if (index == items.length - 1) {
                        issuePoProductModel.find({ '_id': element.hiddenId }).populate([
                            {
                                path: 'productId',
                                model: 'productSeller'
                            }
                        ]).exec(function (err, docu) {
                            if (err) {
                                callback(false)
                            } else {
                                var txtStockAvailable = parseInt(docu[0].productId.txtStockAvailable);
                                var qunatityDelievered = parseInt(element.qty);
                                var qunatityLeft = txtStockAvailable - qunatityDelievered;
                                productSellerModel.update({ '_id': docu[0].productId._id },
                                    { $set: { "txtStockAvailable": qunatityLeft } }, function (err, doc) {
                                        if (err) {
                                            callback(false);
                                        }
                                        else {
                                            callback(true);
                                        }
                                    }
                                );
                            }
                        })
                    }
                })
            }
        })
}

router.post('/getInvoicePage', token, function (req, res, next) {
    invoiceModel.find({ 'issuePOId': req.body._id }, function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    })
})

module.exports = router;
