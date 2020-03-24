const express = require('express'),
    router = express.Router(),
    productModel = require('../models/productModel'),
    productSellerModel = require('../models/productSellerModel'),
    requestQuotationModel = require('../models/requestQuotationModel'),
    crowdSourcingModel = require('../models/crowdSourcingModel'),
    crowdSourcingSupplierModel = require('../models/crowdSourcingSupplierModel'),
    crowdSourcingProductModel = require('../models/crowdSourcingProductModel'),
    requestQuotationSuppliersModel = require('../models/requestQuotationSuppliersModel'),
    quotationSupplierProductsModel = require('../models/quotationSupplierProductsModel'),
    notificationModel = require('../models/notificationModel'),
    nodemailer = require('nodemailer'),
    transporter = require('../config/mailconfig'),
    customerModel = require('../models/customerModel'),
    customerGroup = require('../models/customerGroupModel'),
    token = require('../middleware/token'),
    productDiscountModel = require('../models/productDiscountModel'),
    cacheMiddleware = require('../middleware/cache');
const constants = require('../config/url');
var clientUrl = constants.clientUrl;

router.post('/getDiscountSuppliers', token, function (req, res, next) {
    customerModel.find({ 'traderId': req.body.customerId }, (err, data) => {
        if (data.length == 0) {
            res.status(200).send(data);
        }
        if (data.length > 0) {
            let groupId = data[0]._id;
            customerGroup.find({ "member.CustomerId": groupId },
                { member: { $elemMatch: { CustomerId: groupId } } }, (err, discountData) => {
                    if (discountData.length > 0) {
                        res.status(200).send(discountData[0].member);
                    } else {
                        res.status(404).send({ message: "error" });
                    }

                });
        }
    })
});

router.post('/getProductDiscountGroup', token, function (req, res, next) {
    customerModel.find({ 'traderId': req.body.customerId }, (err, data) => {
        if (data.length == 0) {
            res.status(200).send(data);
        }
        if (data.length > 0) {
            let groupId = data[0]._id;
            customerGroup.find({ "member.CustomerId": groupId },
                { member: { $elemMatch: { CustomerId: groupId } } }, (err, grpData) => {
                    if (grpData.length > 0) {
                        productDiscountModel.find({ 'customerGroupId': grpData[0]._id }).populate([
                            {
                                path: "productId",
                                model: "product"
                            },
                            {
                                path: "customerGroupId",
                                model: "customerGroup"
                            }
                        ]).exec(function (err, doc) {
                            if (err) {
                                return res.status(404).send({ message: "error" });
                            } else {
                                return res.status(200).send(doc);
                            }
                        });
                    } else {
                        res.status(404).send({ message: "error" });
                    }

                });
        }
    });

});

router.post('/submitOrderRequest', token, function (req, res, next) {
    var gerRequest = req.body;
    if (req.body.txtOrderQuantity != undefined) {
        var productNameArray = [req.body.txtProduct];
    }
    else {
        var productNameArray = gerRequest.items.map(function (item) {
            return item.txtProduct;
        });
    }
    productModel.find({ 'txtProductName': { $in: productNameArray }, traderId: { $ne: req.body.traderId } }, function (err, productDetailsResponse) {
        if (err) {
            return res.status(404).send({ message: "error" });
        }
        else {
            if (productDetailsResponse.length == 0) {
                res.status(200).send(productDetailsResponse)
            }
            else {
                var productIdArray = productDetailsResponse.map(function (item) {
                    return item._id;
                });
                productSellerModel.find({ 'productId': { $in: productIdArray } }).populate([
                    {
                        path: 'productId',
                        model: 'product',
                    },
                ]).exec(function (err, docs) {
                    if (err) {
                        res.status(404).send({ message: "error" })
                        return;
                    }
                    else {
                        if (docs.length >= 1) {
                            let dataArr = docs.map(function (w) {
                                return w['traderId'].toString();
                            })

                            Array.prototype.unique = function () {
                                return Array.from(new Set(this));
                            }
                            uniqueArray = dataArr.unique();

                            const generateRFQNo = generateRFQNumber();

                            saveRfq(req, generateRFQNo, function (err, result) {
                                if (err) {
                                    res.status(404).send(err)
                                    return;
                                }
                                else {
                                    pushSupplierRfq(docs, generateRFQNo, uniqueArray, result, req, function (err, doc) {
                                        if (err) {
                                            res.status(404).send(err);
                                        }
                                        else {
                                            var otp = doc.map(function (item) {
                                                return item.requestQuotationSupId;
                                            });

                                            quotationSupplierProductsModel.find({ 'requestQuotationSupplierId': { $in: otp } }).populate([
                                                {
                                                    path: 'productId',
                                                    model: 'productSeller',
                                                    populate: {
                                                        path: 'productId',
                                                        model: 'product'
                                                    }
                                                },
                                                {
                                                    path: 'supplierId',
                                                    model: 'trader',
                                                },
                                                {
                                                    path: 'buyerId',
                                                    model: 'trader',
                                                },
                                            ]).exec(function (err, supplierOut) {
                                                if (err) {
                                                    res.status(404).send(err);
                                                }
                                                else {
                                                    //notifications
                                                    var entry = new notificationModel({
                                                        traderId: req.body.traderId,
                                                        message: 'Request Quotation',
                                                        // route : '',
                                                        // read : ,
                                                    });
                                                    entry.save(function (err, doc) {
                                                        if (err) res.status(404).send({ message: "error" })
                                                        else {
                                                            /* Mail to supplier for Request Quotation*/
                                                            nodemailer.createTestAccount((err, account) => {
                                                                var mailOptions = {
                                                                    from: '"Nicoza " <rxzone@gmail.com>',
                                                                    to: supplierOut[0].supplierId.email,
                                                                    subject: 'Request Quotation By Buyer',
                                                                    css: `a{text-decoration: none;},
                                                                    button{    background: rgba(0, 0, 255, 0.78);
                                                                    border: none;
                                                                    padding: 10px;}`,
                                                                    html: `<h3 style="color:blue;">Request Quotation By Buyer</h3>
                                                                    <div>Hello <b>${supplierOut[0].supplierId.registration_name}</b>,<br><br>
                                                                        Request Quotation is requested by the buyer , ${supplierOut[0].buyerId.registration_name}.<br>
                                                                        Please check your account.<br><br>
                                                                        Thanks,<br>
                                                                        The Nicoza team.<br><br>
                                                                        <p align="center">This message was sent by Nicoza.<p>
                                                                    </div>`
                                                                };
                                                                transporter.sendMail(mailOptions, function (err, information) {
                                                                    if (err) res.status(404).send(err)
                                                                    else {
                                                                        res.status(200).send(supplierOut)
                                                                    }
                                                                })
                                                            });
                                                        }
                                                    });
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
        }
    })
})

var saveRfq = function (req, generateRFQNo, cb) {
    var entry = new requestQuotationModel({
        RFQNumber: generateRFQNo,
        invitationType: req.body.txtinvitationType,
        currency: req.body.txtCurrency,
        paymentTerms: req.body.txtPaymentTerms,
        closingDate: req.body.txtClosingDate,
        deliveryLocation: req.body.txtDeliveryLocation,
        shipping: req.body.txtShipping,
        supplierDetail: [],
        traderId: req.body.traderId,
        userId: req.body.userId,
    })
    entry.save(function (err, doc) {
        err ? cb(err) : cb(null, doc)
    })
}

var pushSupplierRfq = function (product, generateRFQNo, uniqueArray, rfq, getReq, cb) {
    var supplierQuotationIdArray = [];
    uniqueArray.forEach(function (element, index) {
        let supplierId = element;

        var entry = new requestQuotationSuppliersModel({
            RFQNumber: generateRFQNo,
            requestQuotationId: rfq._id,
            supplierId: supplierId,
            buyerId: getReq.body.traderId,
            locationId: getReq.body.txtDelivery,
            shipping: getReq.body.txtShipping,
        })
        entry.save(function (err, doc) {
            if (err) {
                cb(err);
            }
            else {
                var requestQuotationSupId = doc._id;
                var obj = {
                    'requestQuotationSupId': requestQuotationSupId
                }
                supplierQuotationIdArray.push(obj);

                product.forEach(function (element, index) {

                    if (index != product.length - 1) {
                        if (supplierId == element.traderId) {

                            if (getReq.body.txtOrderQuantity != undefined) {
                                var Qty = getReq.body.txtOrderQuantity;
                            }
                            else {
                                var Qty = 0;
                                getReq.body.items.forEach(function (item, j) {
                                    if (element.productId.txtProductName == item.txtProduct) {
                                        Qty = item.txtOrderQuantity;
                                    }
                                });
                            }
                            var totalPrice = Qty * element.txtPrice;
                            var entry = new quotationSupplierProductsModel({
                                RFQNumber: generateRFQNo,
                                buyerId: getReq.body.traderId,
                                supplierId: element.traderId,
                                requestQuotationId: rfq._id,
                                productId: element._id,
                                requestQuotationSupplierId: doc._id,
                                txtUnitPrice: element.txtPrice,
                                txtCurrency: element.txtCurrency,
                                txtTotalPrice: totalPrice,
                                txtNoOfItems: Qty,
                                shipping: getReq.body.txtShipping,
                            })
                            entry.save(function (err, doc) {
                                if (err) cb(err);
                                else { }
                            })
                        }
                    }

                    if (index == product.length - 1) {
                        if (supplierId == element.traderId) {
                            if (getReq.body.txtOrderQuantity != undefined) {
                                var Qty = getReq.body.txtOrderQuantity;
                            }
                            else {
                                var Qty = 0;
                                getReq.body.items.forEach(function (item, j) {
                                    if (element.productId.txtProductName == item.txtProduct) {
                                        Qty = item.txtOrderQuantity;
                                    }
                                });
                            }
                            var totalPrice = Qty * element.txtPrice;
                            var entry = new quotationSupplierProductsModel({
                                RFQNumber: generateRFQNo,
                                buyerId: getReq.body.traderId,
                                supplierId: element.traderId,
                                requestQuotationId: rfq._id,
                                productId: element._id,
                                requestQuotationSupplierId: doc._id,
                                txtCurrency: element.txtCurrency,
                                txtUnitPrice: element.txtPrice,
                                txtTotalPrice: totalPrice,
                                txtNoOfItems: Qty,
                                shipping: getReq.body.txtShipping,
                            })
                            entry.save(function (err, doc) {
                                if (err) {
                                    cb(err);
                                }
                                else {
                                    cb(null, supplierQuotationIdArray);
                                }
                            })
                        }
                    }
                }, this)
            }
        })
    }, this)
}
/* Request Crowd Sourcing for Single Product and Supplier */
router.post('/requestCrowdSourcing', token, function (req, res, next) {
    var gerRequest = req.body;
    crowdSourcingProductModel.find({ '_id': gerRequest._id }).populate([
        {
            path: 'supplierId',
            model: 'trader'
        },
        {
            path: 'buyerId',
            model: 'trader'
        }
    ]).exec(function (err, productDoc) {
        if (err) res.status(404).send({ message: "error" });
        else {
            crowdSourcingModel.find({ '_id': productDoc[0].crowdSourcingId }, function (err, rfq) {
                if (err) res.status(404).send({ message: "error" });
                else {
                    const generateRFQNo = generateRFQNumber();
                    saveRequestQuoatation(rfq, generateRFQNo, function (err, result) {
                        if (err) res.status(404).send(err);
                        else {
                            crowdSourcingSupplierModel.find({ '_id': productDoc[0].crowdSourcingSupplierId }, function (err, supplierDoc) {
                                saveRfqSupplier(result, generateRFQNo, supplierDoc, function (err, supplierResult) {
                                    if (err) res.status(404).send(err);
                                    else {
                                        saveRfqProduct(result, generateRFQNo, supplierResult, productDoc, function (err, productResult) {
                                            if (err) res.status(404).send(err);
                                            else {
                                                /* mail to supplier for crowdSourcing */
                                                nodemailer.createTestAccount((err, account) => {
                                                    var mailOptions = {
                                                        from: '"Nicoza " <rxzone@gmail.com>',
                                                        to: productDoc[0].supplierId.email,
                                                        subject: 'Crowd Sourcing By Buyer',
                                                        css: `a{text-decoration: none;},
                                                                button{    background: rgba(0, 0, 255, 0.78);
                                                                border: none;
                                                                padding: 10px;}`,
                                                        html: `<h3 style="color:blue;">Crowd Sourcing By Buyer</h3>
                                                                <div>Hello <b>${productDoc[0].supplierId.registration_name}</b>,<br><br>
                                                                    Crowd Sourcing is requested by the buyer , ${productDoc[0].buyerId.registration_name}.<br>
                                                                    Please check your account.<br><br>
                                                                    Thanks,<br>
                                                                    The Nicoza team.<br><br>
                                                                    <p align="center">This message was sent by Nicoza.<p>
                                                                </div>`
                                                    };
                                                    transporter.sendMail(mailOptions, function (err, information) {
                                                        if (err) { }
                                                        res.status(200).send(productResult);
                                                    })
                                                });
                                            }
                                        })



                                    }
                                })
                            })
                        }
                    })
                }
            })
        }
    })
})
var saveRequestQuoatation = function (rfq, generateRFQNo, cb) {
    var entry = new requestQuotationModel({
        RFQNumber: generateRFQNo,
        invitationType: rfq[0].txtinvitationType,
        // currency: rfq[0].txtCurrency,
        paymentTerms: rfq[0].paymentTerms,
        closingDate: rfq[0].closingDate,
        deliveryLocation: rfq[0].deliveryLocation,
        shipping: rfq[0].shipping,
        supplierDetail: [],
        traderId: rfq[0].traderId,
        userId: rfq[0].userId,
    })
    entry.save(function (err, doc) {
        err ? cb(err) : cb(null, doc)
    })
}
var saveRfqSupplier = function (result, generateRFQNo, supplierDoc, cb) {
    var entry = new requestQuotationSuppliersModel({
        RFQNumber: generateRFQNo,
        requestQuotationId: result._id,
        supplierId: supplierDoc[0].supplierId,
        buyerId: supplierDoc[0].buyerId,
        locationId: supplierDoc[0].txtDelivery,
        shipping: supplierDoc[0].shipping,
    })
    entry.save(function (err, doc) {
        if (err) cb(err);
        else {
            err ? cb(err) : cb(null, doc)
        }
    })
}
saveRfqProduct = function (result, generateRFQNo, supplierResult, productDoc, cb) {
    var entry = new quotationSupplierProductsModel({
        RFQNumber: generateRFQNo,
        txtPaymentModeWithDiscount: productDoc[0].txtPaymentModeWithDiscount,
        txtTotalPrice: productDoc[0].txtTotalPrice,
        txtUnitPrice: productDoc[0].txtUnitPrice,
        txtNoOfItems: productDoc[0].txtNoOfItems,
        txtItemPerPackage: productDoc[0].txtItemPerPackage,
        txtPackagingWeight: productDoc[0].txtPackagingWeight,
        txtPackaging: productDoc[0].txtPackaging,
        shipping: productDoc[0].shipping,
        txtPaymentModeDiscount: productDoc[0].txtPaymentModeDiscount,
        txtCurrency: productDoc[0].txtCurrency,
        txtEarlyPaymentTermDiscount: productDoc[0].txtEarlyPaymentTermDiscount,
        txtDiscountForEarlyPayment: productDoc[0].txtDiscountForEarlyPayment,
        status: productDoc[0].status,
        buyerId: productDoc[0].buyerId,
        supplierId: productDoc[0].supplierId._id,
        productId: productDoc[0].productId,
        requestQuotationId: result._id,
        requestQuotationSupplierId: supplierResult._id,
    })
    entry.save(function (err, doc) {
        if (err) cb(err);
        else {
            err ? cb(err) : cb(null, doc)
        }
    })
}

/* GET Supplier listing. */

router.post('/getSelectedSuppliers', token, function (req, res, next) {
    var gerRequest = req.body;
    if (req.body.txtOrderQuantity != undefined) {
        var productNameArray = [req.body.txtProduct];
    }
    else {
        var productNameArray = gerRequest.items.map(function (item) {
            return item.txtProduct;
        });
    }


    productModel.find({ 'txtProductName': { $in: productNameArray }, traderId: { $ne: req.body.traderId } }, function (err, productDetailsResponse) {
        if (err) {
            return res.status(404).send(err);
        }
        else {
            if (productDetailsResponse.length == 0) {
                res.status(200).send(productDetailsResponse)
            }
            else {
                var productIdArray = productDetailsResponse.map(function (item) {
                    return item._id;
                });
                productSellerModel.find({ 'productId': { $in: productIdArray } }).populate([
                    {
                        path: 'productId',
                        model: 'product',
                    },

                ]).exec(function (err, docs) {
                    if (err) {
                        res.status(404).send({ message: "error" })
                        return;
                    }
                    else {
                        if (docs.length >= 1) {
                            let dataArr = docs.map(function (w) {
                                return w['traderId'].toString();
                            })
                            Array.prototype.unique = function () {
                                return Array.from(new Set(this));
                            }
                            uniqueArray = dataArr.unique();

                            saveCrowdSourcing(req, function (err, result) {
                                if (err) {
                                    res.status(404).send(err);
                                }
                                else {
                                    savecrowdSourcingProducts(docs, uniqueArray, result, req, function (err, doc) {
                                        if (err) {
                                            res.status(404).send(err);
                                        }
                                        else {
                                            var otp = doc.map(function (item) {
                                                return item.crowdSourcingSupplierId;
                                            });

                                            crowdSourcingProductModel.find({ 'crowdSourcingSupplierId': { $in: otp } }).populate([
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
                                                        path: 'discountId',
                                                        model: 'productDiscount',
                                                        populate: {
                                                            path: 'customerGroupId',
                                                            model: 'customerGroup',
                                                            populate: {
                                                                path: 'customerGroupId                                                                ',
                                                                model: 'customer',
                                                            }
                                                        },
                                                    },
                                                },
                                                {
                                                    path: 'supplierId',
                                                    model: 'trader',
                                                },
                                            ]).exec(function (err, supplierOut) {
                                                if (err) {
                                                    res.status(404).send(err);
                                                }
                                                else {
                                                    res.status(200).send(supplierOut)
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
        }
    })
})
var saveCrowdSourcing = function (req, cb) {
    var entry = new crowdSourcingModel({
        invitationType: req.body.txtinvitationType,
        currency: req.body.txtCurrency,
        paymentTerms: req.body.txtPaymentTerms,
        closingDate: req.body.txtClosingDate,
        deliveryLocation: req.body.txtDeliveryLocation,
        shipping: req.body.txtShipping,
        traderId: req.body.traderId,
        userId: req.body.userId,
    })
    entry.save(function (err, doc) {
        err ? cb(err) : cb(null, doc)
    })
}
var savecrowdSourcingProducts = function (product, uniqueArray, rfq, getReq, cb) {
    var crowdSourcingSupplierIdArray = [];
    uniqueArray.forEach(function (element, index) {
        let supplierId = element;
        var entry = new crowdSourcingSupplierModel({
            crowdSourcingId: rfq._id,
            supplierId: supplierId,
            buyerId: getReq.body.traderId,
            locationId: getReq.body.txtDelivery,
            shipping: getReq.body.txtShipping,
        })
        entry.save(function (err, doc) {
            if (err) cb(err);
            else {
                var crowdSourcingSupplierId = doc._id;
                var obj = {
                    'crowdSourcingSupplierId': crowdSourcingSupplierId
                }
                crowdSourcingSupplierIdArray.push(obj);
                product.forEach(function (element, index) {
                    if (index != product.length - 1) {
                        if (supplierId == element.traderId) {
                            if (getReq.body.txtOrderQuantity != undefined) {
                                var Qty = getReq.body.txtOrderQuantity;
                            }
                            else {
                                var Qty = 0;
                                getReq.body.items.forEach(function (item, j) {
                                    if (element.productId.txtProductName == item.txtProduct) {
                                        Qty = item.txtOrderQuantity;
                                    }
                                });
                            }
                            var totalPrice = Qty * element.txtPrice;
                            var entry = new crowdSourcingProductModel({
                                buyerId: getReq.body.traderId,
                                supplierId: element.traderId,
                                crowdSourcingId: rfq._id,
                                productId: element._id,
                                crowdSourcingSupplierId: doc._id,
                                txtUnitPrice: element.txtPrice,
                                txtCurrency: element.txtCurrency,
                                txtTotalPrice: totalPrice,
                                txtNoOfItems: Qty,
                                shipping: getReq.body.txtShipping,
                            })
                            entry.save(function (err, doc) {
                                if (err) cb(err);
                                else { }
                            })
                        }
                    }
                    if (index == product.length - 1) {
                        if (supplierId == element.traderId) {
                            if (getReq.body.txtOrderQuantity != undefined) {
                                var Qty = getReq.body.txtOrderQuantity;
                            }
                            else {
                                var Qty = 0;
                                getReq.body.items.forEach(function (item, j) {
                                    if (element.productId.txtProductName == item.txtProduct) {
                                        Qty = item.txtOrderQuantity;
                                    }
                                });
                            }
                            var totalPrice = Qty * element.txtPrice;
                            var entry = new crowdSourcingProductModel({
                                buyerId: getReq.body.traderId,
                                supplierId: element.traderId,
                                crowdSourcingId: rfq._id,
                                productId: element._id,
                                crowdSourcingSupplierId: doc._id,
                                txtUnitPrice: element.txtPrice,
                                txtCurrency: element.txtCurrency,
                                txtTotalPrice: totalPrice,
                                txtNoOfItems: Qty,
                                shipping: getReq.body.txtShipping,
                            })
                            entry.save(function (err, doc) {
                                if (err) cb(err);
                                else {
                                    cb(null, crowdSourcingSupplierIdArray);
                                }
                            })
                        }
                    }
                }, this)
            }
        })
    }, this)
}
/* GET Products and Supplier details. */
router.post('/getRequestedProduct', token, function (req, res, next) {
    crowdSourcingProductModel.find({ '_id': req.body._id }).populate([
        {
            path: 'productId',
            model: 'productSeller',
            populate: {
                path: 'productId',
                model: 'product',
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
            path: 'crowdSourcingId',
            model: 'crowdSourcing'
        }
    ]).exec(function (err, doc) {
        if (err) res.status(404).send({ message: "error" })
        else res.status(200).send(doc);
    });
})

function generateRFQNumber() {
    const timestamp = Date.now();
    const year = new Date().getFullYear();
    const prefix = 'RQ-' + year + timestamp * 1000;
    return prefix;
}
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

module.exports = router;
