const express = require('express'),
    router = express.Router(),
    issuePoModel = require('../models/issuePoModel'),
    issuePoProductModel = require('../models/issuePoProductModel'),
    requestQuotationSuppliersModel = require('../models/requestQuotationSuppliersModel'),
    quotationSupplierProductsModel = require('../models/quotationSupplierProductsModel'),
    invoiceModel = require('../models/invoiceModel'),
    invoiceProductModel = require('../models/invoiceProductModel'),
    notificationModel = require('../models/notificationModel'),
    acceptedPoTrackModel = require('../models/acceptedPoTrackModel'),
    warehousePoModel = require('../models/warehousePoModel'),
    warehousePoProductModel = require('../models/warehousePoProductModel'),
    multipleLogisticPoModel = require('../models/multipleLogisticPoModel'),
    multipleLogisticsPoProductModel = require('../models/multipleLogisticsPoProductModel'),
    token = require('../middleware/token'),
    nodemailer = require('nodemailer'),
    transporter = require('../config/mailconfig')
    transportPoModel = require('../models/transportPoModel'),
    transportPoProductModel = require('../models/transportPoProductModel');

router.post('/saveIssuePO', token, function (req, res, next) {
    var warehouse, transportation, clearing, insurance;
    if (req.body.txtWarehouse != '') warehouse = req.body.txtWarehouse;
    else warehouse = null;

    if (req.body.txtTransportation != '') transportation = req.body.txtTransportation;
    else transportation = null;

    if (req.body.txtClearing != '') clearing = req.body.txtClearing;
    else clearing = null;

    if (req.body.txtInsurance != '') insurance = req.body.txtInsurance;
    else insurance = null;

    const generateOrderNo = generateOrderNumber();

    var entry = new issuePoModel({
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
        RFQNumber: req.body.data[0].RFQNumber,
        orderNumber: generateOrderNo,
        supplierPoStatus: "pending",
        buyerPoStatus: "pending",
        supplierId: req.body.data[0].supplierId,
        buyerId: req.body.data[0].buyerId,
        requestQuotationId: req.body.data[0].requestQuotationId,
        requestQuotationSupplierId: req.body.data[0].requestQuotationSupplierId,
    })
    entry.save(function (err, doc) {
        if (err) {
            res.status(404).send(err);
            return;
        }
        else {
            var issuePoId = doc._id;
            var productData = req.body.data;
            var productIdArray = productData.map(function (item) {
                return item._id;
            });
            quotationSupplierProductsModel.updateMany(
                { '_id': { $in: productIdArray } },
                { $set: { "statusIssuePo": 'finalised' } }, function (err, doc) {
                    if (err) res.status(404).send({ message: "error" });
                    else {
                        if (productData.length >= 1) {
                            productData.forEach(function (v, i) {
                                if (i != productData.length - 1) {
                                    var entry = new issuePoProductModel({
                                        RFQNumber: req.body.data[0].RFQNumber,
                                        orderNumber: generateOrderNo,
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
                                        requestQuotationId: v.requestQuotationId,
                                        requestQuotationSupplierId: v.requestQuotationSupplierId,
                                        issuePoId: issuePoId,
                                    })
                                    entry.save(function (err, doc) {
                                        if (err) {
                                            res.status(404).send({ message: "error" })
                                        }
                                        else { }
                                    })
                                }
                                if (i == productData.length - 1) {
                                    var entry = new issuePoProductModel({
                                        RFQNumber: req.body.data[0].RFQNumber,
                                        orderNumber: generateOrderNo,
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
                                        requestQuotationId: v.requestQuotationId,
                                        requestQuotationSupplierId: v.requestQuotationSupplierId,
                                        issuePoId: issuePoId,
                                    })
                                    entry.save(function (err, doc) {
                                        if (err) {
                                            res.status(404).send({ message: "error" })
                                        }
                                        else {
                                            //IssuePO notification
                                            var entry = new notificationModel({
                                                traderId: req.body.traderId,
                                                message: 'Issue PO',
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

                                }
                            })
                        }
                        /*mail to buyer and supplier to issue PO*/
                        nodemailer.createTestAccount((err, account) => {
                            var mailIds = [req.body.data[0].supplierId.email];
                            var mailOptions = {
                                from: '"Nicoza "<rxzone@gmail.com>',
                                to: mailIds,
                                subject: 'Issue PO',
                                css: `a{text-decoration: none;},
                            button{    background: rgba(0, 0, 255, 0.78);
                            border: none;
                            padding: 10px;}`,
                                html: `<h3 style="color:blue;">Issue PO</h3>
                            <div>Hello <b>${req.body.data[0].supplierId.registration_name}</b>,<br><br>
                            PO is issued by the buyer , ${req.body.data[0].buyerId.registration_name}.<br>
                            Please check your account.<br><br>
                            Thanks,<br>
                            The Nicoza team.<br><br>
                            <p align="center">This message was sent by Nicoza.<p>
                            </div>`
                            };
                            transporter.sendMail(mailOptions, function (err, information) {
                                if (err) { }
                                res.status(200).send({ email: mailIds });
                            })
                        })
                    }
                }
            )
        }
    })
})

router.post('/rejectPO', (req, res) => {
    let supplierId = req.body.toupdate[0].supplierId.email;
    let items = req.body.toupdate;
    let rfqNo = req.body.toupdate[0].RFQNumber;
    let rejctReason = req.body.rejectMessage;
    let attachArr = [];
    let itemIdArray = items.map(item => item._id);
    var htmlTable = `<table>
    <tr>
        <th>Image</th>
        <th>Product Name</th>
        <th>Total Price</th>
        <th>Currency</th>
        <th>Unit Price</th>
        <th>Created At</th>
    </tr>
    `
    items.forEach((item, i) => {
        let obj = {};
        obj['filename'] = findDefault(item.productId.imageFile, 'name');
        obj['path'] = findDefault(item.productId.imageFile, 'path');
        obj['cid'] = 'abcd@gm.com';
        attachArr.push(obj)
        htmlTable += `<tr>
                    <td><img style='width:100px; height:100px;' src="cid:abcd@gm.com"/></td>
                    <td>`+ item.productId.txtBrand + `</td>
                    <td>`+ item.txtTotalPrice + `</td>
                    <td>`+ item.productId.txtCurrency.currency_name + `</td>
                    <td>`+ item.txtUnitPrice + `</td>
                    <td>`+ item.createdAt + `</td>
                </tr>`
    })
    htmlTable += `</table>`;

    function findDefault(imgarr, msg) {
        let img = imgarr.filter(img => img.isdefault);
        if (msg === 'name') return img[0].name;
        if (msg === 'path') return img[0].path
    }

    const date = date => {
        //this function will formate the date format to the dd/mm/yy
    }

    nodemailer.createTestAccount((err, account) => {
        var mailIds = [supplierId];
        var mailOptions = {
            from: '"Nicoza " <rxzone@gmail.com>',
            to: mailIds,
            subject: 'Reject PO',
            css: `a{text-decoration: none;},
                            button{    background: rgba(0, 0, 255, 0.78);
                            border: none;
                            padding: 10px;},
                            `,
            html: `<h3 style="color:blue;">Reject PO</h3>
                            <div>Hello <b>${req.body.toupdate[0].supplierId.registration_name}</b>,<br><br>
                            PO is Rejected by the buyer , ${req.body.toupdate[0].buyerId.registration_name}.<br>
                            <h4>Rejected Items</h4>
                            <div>${htmlTable}</div>
                            <br>
                            <br>
                            <h3>Reject Reason</h3>
                            <p> ${rejctReason}</p>
                            Thanks,<br>
                            The Nicoza team.<br><br>
                            <p align="center">This message was sent by Nicoza.<p>
                            </div>`,
            attachments: attachArr
        }

        transporter.sendMail(mailOptions, function (err, information) {
            if (err) {
            } else { }
        })
    })

    quotationSupplierProductsModel.updateMany({ '_id': { $in: itemIdArray } },
        { $set: { "statusIssuePo": 'rejected', "rejectReasonPo": rejctReason } }).exec()
        .then(resp => {
            if (req.body.deleteOrder) {
                requestQuotationSuppliersModel.updateOne({ "RFQNumber": rfqNo },
                    { $set: { "status": 'rejected' } }).exec()
                    .then(rejectResp => {
                        res.status(200).json({
                            message: 'rejected selected items and orders',
                            ProductReject: resp,
                            orderReject: rejectResp,
                        })

                    }).catch(errors => {
                        res.status(400).json({
                            message: 'error occured',
                            error: errors,
                        })
                    })
            } else {
                res.status(200).json({
                    message: 'rejected selected items',
                    response: resp,
                })
            }
        }).catch(err => {
            res.status(400).json({
                message: 'error occured',
                error: err,
            })
        })
})

router.post('/getSupplierDetail', token, function (req, res, next) {
    requestQuotationSuppliersModel.find({ "_id": req.body._id }).populate([
        {
            path: 'supplierId',
            model: 'trader',
        },
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send(err)
            return;
        }
        else {
            res.status(200).send(doc)
        }
    })
})

router.post('/getLogisticsDetails', token, function (req, res, next) {
    issuePoModel.find({ "_id": req.body._id }).populate([
        {
            path: 'txtWarehouse',
            model: 'logisticsUser',
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
        },
    
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send(err)
            return;
        }
        else {
            res.status(200).send(doc)
        }
    })
})

router.post('/saveIssuePoCrowdSourcing', token, function (req, res, next) {
    requestQuotationSuppliersModel.find({ "_id": req.body.requestQuotationSupplierId }).populate([
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
            requestQuotationSuppliersModel.find({ "_id": req.body.requestQuotationSupplierId }, function (err, doc) {
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

                    var entry = new issuePoModel({
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
                        supplierPoStatus: "pending",
                        buyerPoStatus: "pending",
                        supplierId: doc[0].supplierId,
                        buyerId: doc[0].buyerId,
                        requestQuotationId: doc[0].requestQuotationId,
                        requestQuotationSupplierId: req.body.requestQuotationSupplierId,
                    })
                    entry.save(function (err, doc) {
                        if (err) {
                            res.status(404).send(err);
                        }
                        else {
                            var issuePoId = doc._id;
                            quotationSupplierProductsModel.find({ 'requestQuotationSupplierId': req.body.requestQuotationSupplierId }, function (err, doc) {
                                if (err) {
                                    res.status(404).send({ message: "error" })
                                }
                                else {
                                    if (doc.length >= 1) {
                                        doc.forEach(function (v, i) {
                                            if (i != doc.length - 1) {
                                                var entry = new issuePoProductModel({
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
                                                    requestQuotationId: v.requestQuotationId,
                                                    requestQuotationSupplierId: v.requestQuotationSupplierId,
                                                    issuePoId: issuePoId,
                                                })
                                                entry.save(function (err, doc) {
                                                    if (err) {
                                                        res.status(404).send({ message: "error" })
                                                    }
                                                    else { }
                                                })
                                            }
                                            if (i == doc.length - 1) {
                                                var entry = new issuePoProductModel({
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
                                                    requestQuotationId: v.requestQuotationId,
                                                    requestQuotationSupplierId: v.requestQuotationSupplierId,
                                                    issuePoId: issuePoId,
                                                })
                                                entry.save(function (err, doc) {
                                                    if (err) {
                                                        res.status(404).send({ message: "error" })
                                                    }
                                                    else {
                                                        //IssuePO notification
                                                        var entry = new notificationModel({
                                                            traderId: req.body.traderId,
                                                            message: 'Issue PO',
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
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            })

            /*mail to supplier to issue PO Crowd Sourcing*/
            nodemailer.createTestAccount((err, account) => {
                var mailOptions = {
                    from: '"Nicoza " <rxzone@gmail.com>',
                    to: supplierOut[0].supplierId.email,
                    subject: 'Issue PO by Crowd Sourcing',
                    css: `a{text-decoration: none;},
                    button{    background: rgba(0, 0, 255, 0.78);
                    border: none;
                    padding: 10px;}`,
                    html: `<h3 style="color:blue;">Issue PO</h3>
                    <div>Hello <b>${supplierOut[0].supplierId.registration_name}</b>,<br><br>
                    PO is issued by the buyer , ${supplierOut[0].buyerId.registration_name}.<br>
                    Please check your account.<br><br>
                    Thanks,<br>
                    The Nicoza team.<br><br>
                    <p align="center">This message was sent by Nicoza.<p>
                    </div>`
                };
                transporter.sendMail(mailOptions, function (err, information) {
                    if (err) { }
                    res.status(200).send({ email: supplierOut[0].supplierId.email });
                })
            })
        }
    })
})

router.get('/getAllPo', token, function (req, res, next) {
    issuePoModel.find({ 'supplierId': req.body.traderId, "supplierPoStatus": "pending" }).populate([
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

router.post('/getAllPoProduct', token, function (req, res, next) {
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
        {
            path: 'requestQuotationId',
            model: 'requestQuotation'
        }
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    });
})

router.post('/postSupplierPoStatus', token, function (req, res, next) {
    issuePoModel.updateOne({ '_id': req.body._id },
        { $set: { "supplierPoStatus": req.body.status } }, function (err, statusDoc) {
            if (err) {
                res.status(404).send({ message: "error" })
            }
            else {
                //====================================================
                if (req.body.status == "accept") {
                    issuePoModel.find({ "_id": req.body._id }).populate([
                        {
                            path: 'requestQuotationId',
                            model: 'requestQuotation'
                        },
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
                    ]).exec(function (err, IssuePodoc) {
                        if (err) {
                            res.status(404).send({ message: "error" })
                        }
                        else {
                            var warehouse, transportation, clearing, insurance;
                            if (IssuePodoc[0].txtWarehouse != '') warehouse = IssuePodoc[0].txtWarehouse;
                            else warehouse = null;

                            if (IssuePodoc[0].txtTransportation != '') transportation = IssuePodoc[0].txtTransportation;
                            else transportation = null;

                            if (IssuePodoc[0].txtClearing != '') clearing = IssuePodoc[0].txtClearing;
                            else clearing = null;

                            if (IssuePodoc[0].txtInsurance != '') insurance = IssuePodoc[0].txtInsurance;
                            else insurance = null;

                            const generateInvNo = generateInvoiceNumber();

                            var entry = new invoiceModel({
                                invoiceNumber: generateInvNo,
                                orderNumber: IssuePodoc[0].orderNumber,
                                txtWarehouse: warehouse,
                                txtTransportation: transportation,
                                txtFrightRate: IssuePodoc[0].txtFrightRate,
                                txtClearing: clearing,
                                txtInsurance: insurance,
                                txtWarehouseType: IssuePodoc[0].txtWarehouseType,
                                txtWarehouseService: IssuePodoc[0].txtWarehouseService,
                                TransportType: IssuePodoc[0].TransportType,
                                TransportName: IssuePodoc[0].TransportName,
                                txtClearingType: IssuePodoc[0].txtClearingType,
                                txtClearingName: IssuePodoc[0].txtClearingName,
                                txtInsuranceType: IssuePodoc[0].txtInsuranceType,
                                txtInsuranceName: IssuePodoc[0].txtInsuranceName,
                                supplierPoStatus: IssuePodoc[0].supplierPoStatus,
                                buyerPoStatus: IssuePodoc[0].buyerPoStatus,
                                issuePOId: req.body._id,
                                supplierId: IssuePodoc[0].supplierId,
                                buyerId: IssuePodoc[0].buyerId,
                                shipping: IssuePodoc[0].requestQuotationId.shipping,
                                requestQuotationId: IssuePodoc[0].requestQuotationId._id,
                                requestQuotationSupplierId: IssuePodoc[0].requestQuotationSupplierId,
                            })
                            entry.save(function (err, doc) {
                                if (err) {
                                    res.status(404).send(err);
                                    return;
                                }
                                else {
                                    var issuePoId = req.body._id;
                                    var invoiceId = doc._id;
                                    issuePoProductModel.find({ 'issuePoId': issuePoId }, function (err, doc) {
                                        if (err) {
                                            res.status(404).send({ message: "error" })
                                        }
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
                                                        entry.save(function (err, docs) {
                                                            if (err) {
                                                                res.status(404).send({ message: "error" })
                                                            }
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
                                                        entry.save(function (err, docs) {
                                                            if (err) {
                                                                res.status(404).send({ message: "error" })
                                                            }
                                                            else {
                                                                //Invoice creating notification
                                                                var entry = new notificationModel({
                                                                    traderId: req.body.traderId,
                                                                    message: 'Invoice is created',
                                                                    // route : '',
                                                                    // read : ,
                                                                });
                                                                entry.save(function (err, docz) {
                                                                    if (err) res.status(404).send({ message: "error" })
                                                                    else {
                                                                        saveAcceptedOrderTracking(req, IssuePodoc, doc, IssuePodoc[0].requestQuotationId._id, function (status) {
                                                                            if (status) {
                                                                                sendMailStatus(req, function (status2) {
                                                                                    if (status2) {
                                                                                        res.status(200).send(statusDoc);
                                                                                    }
                                                                                    else {
                                                                                        res.status(404).send('Error')
                                                                                    }
                                                                                });
                                                                            }
                                                                            else {
                                                                                res.status(404).send('Error')
                                                                            }
                                                                        })
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                else {
                    sendMailStatus(req, function (status2) {
                        if (status2) {
                            res.status(200).send({ message: 'Success' });
                        }
                        else {
                            res.status(404).send('Error')
                        }
                    })
                }
                //===================================================
            }
        }
    );
})

function saveAcceptedOrderTracking(req, IssuePodoc, productDoc, requestQuotationId, callback) {
    //when buyer selects FOB
    var entry = new acceptedPoTrackModel({
        orderPlaced: "accept",
        orderPacked: "pending",
        orderShipped: "pending",
        orderDelivered: "pending",
        issuePOId: req.body._id,
        orderNumber: IssuePodoc[0].orderNumber,
        supplierId: IssuePodoc[0].supplierId,
        buyerId: IssuePodoc[0].buyerId,
    })
    entry.save(function (err, docd) {
        if (err) {
            callback(false);
        }
        else {

          if(IssuePodoc[0].txtWarehouse!== null){
            var entry = new warehousePoModel({
                orderNumber: IssuePodoc[0].orderNumber,
                traderId: IssuePodoc[0].buyerId,
                buyerId: IssuePodoc[0].buyerId,
                issuePoId: req.body._id,
                logisticsId: req.body.logisticsId,
                requestQuotationId: requestQuotationId,
                status: "pending",
                warehouseId: IssuePodoc[0].txtWarehouse,
                transportId: IssuePodoc[0].txtTransportation,
                clearingId: IssuePodoc[0].txtClearing,
                insuranceId: IssuePodoc[0].txtInsurance,
                warehouseServices: IssuePodoc[0].txtWarehouseService,
            })
            entry.save(function (err, warehouseDoc) {
                if (err) {
                    callback(false);
                }
                else {
                    if (productDoc.length >= 1) {
                        productDoc.forEach(function (v, i) {
                            if (i != productDoc.length - 1) {
                                var entry = new warehousePoProductModel({
                                    orderNumber: IssuePodoc[0].orderNumber,
                                    warehousePoId: warehouseDoc._id,
                                    issuePoId: req.body._id,
                                    productId: v.productId,
                                    // supplierId: v.supplierId,
                                    traderId: v.buyerId,
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
                                    if (err) {
                                        callback(false);
                                    } else { }
                                })
                            }
                            if (i == productDoc.length - 1) {
                                var entry = new warehousePoProductModel({
                                    orderNumber: IssuePodoc[0].orderNumber,
                                    warehousePoId: warehouseDoc._id,
                                    issuePoId: req.body._id,
                                    productId: v.productId,
                                    // supplierId: v.supplierId,
                                    traderId: v.buyerId,
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
                                        callback(false);
                                    } else {
                                        callback(true);
                                    }
                                });
                            }
                        });
                    }
                }

                /*mail to warehouse provider for accept and reject PO*/
                nodemailer.createTestAccount((err, account) => {
                    var mailOptions = {
                        from: '"Nicoza " <rxzone@gmail.com>',
                        to: req.body.warehouseEmail,
                        subject: 'Request for Warehouse',
                        css: `a{text-decoration: none;},
                            button{    background: rgba(0, 0, 255, 0.78);
                            border: none;
                            padding: 10px;}`,
                        html: `<h3 style="color:blue;">Request for Warehouse</h3>
                            <div>Hello ${req.body.warehouseEmail},<br><br>
                            You have the request from Trader.<br>
                            Please check your account.<br><br>
                            Thanks,<br>
                            The Nicoza team.<br><br>
                            <p align="center">This message was sent by Nicoza.<p>
                            </div>`
                    };
                    transporter.sendMail(mailOptions, function (err, information) {
                    })
                });
            })
          }
          else{
              ///transport issue po
            let entry = new transportPoModel({
                        orderNumber: IssuePodoc[0].orderNumber,
                        traderId: IssuePodoc[0].buyerId,
                        buyerId: IssuePodoc[0].buyerId,
                        supplierId: IssuePodoc[0].supplierId,
                        issuePoId: req.body._id,
                        requestQuotationId: IssuePodoc[0].requestQuotationId._id,
                        status: "pending",
                        deliveryLocation: IssuePodoc[0].requestQuotationId.deliveryLocation._id,
                        warehouseId: IssuePodoc[0].warehouseId,
                        transportId: IssuePodoc[0].txtTransportation,
                        clearingId: IssuePodoc[0].txtClearing,
                        insuranceId: IssuePodoc[0].txtInsurance,
                        // warehouseServices: warehouseService,
                        transportServices: IssuePodoc[0].TransportName,
                        clearingServices: IssuePodoc[0].txtClearingName,
                        insuranceServices: IssuePodoc[0].txtInsuranceName,
                    })
                    entry.save(function (err, transportDoc) {
                                if (err) {
                                    res.status(404).send(err);
                                }
                                else {
                                    if (productDoc.length >= 1) {
                                        productDoc.forEach(function (v, i) {
                                            if (i != productDoc.length - 1) {
                                                let entry = new transportPoProductModel({
                                                    orderNumber: IssuePodoc[0].orderNumber,
                                                    transportPoId: transportDoc.transportId._id,
                                                    issuePoId: req.body._id,
                                                    productId: v.productId,
                                                     supplierId: v.supplierId,
                                                    traderId: v.buyerId,
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
                                                    if (err) {
                                                        callback(false);
                                                    } else { }
                                                })
                                            }
                                            if (i == productDoc.length - 1) {
                                                var entry = new transportPoProductModel({
                                                    orderNumber: IssuePodoc[0].orderNumber,
                                                    transportPoId: transportDoc._id,
                                                    issuePoId: req.body._id,
                                                    productId: v.productId,
                                                     supplierId: v.supplierId,
                                                    traderId: v.buyerId,
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
                                                        callback(false);
                                                    } else {
                                                        callback(true);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
          }
        //   else{
        //     var entry = new transportPoModel({
        //         orderNumber: IssuePodoc[0].orderNumber,
        //         traderId: IssuePodoc[0].traderId,
        //         buyerId: IssuePodoc[0].buyerId,
        //         issuePoId: IssuePodoc[0].issuePoId,
        //         warehousePoId: req.body._id,
        //         requestQuotationId: IssuePodoc[0].requestQuotationId._id,
        //         status: "pending",
        //         deliveryLocation: IssuePodoc[0].requestQuotationId.deliveryLocation._id,
        //         warehouseId: IssuePodoc[0].warehouseId,
        //         transportId: IssuePodoc[0].transportId,
        //         clearingId: IssuePodoc[0].clearingId,
        //         insuranceId: IssuePodoc[0].insuranceId,
        //         warehouseServices: warehouseService,
        //         transportServices: transportService,
        //         clearingServices: clearingService,
        //         insuranceServices: insuranceService,
        //     })
        //     entry.save(function (err, transportDoc) {
        //         if (err) {
        //             res.status(404).send(err);
        //         }
        //         else {
        //             warehousePoProductModel.find({ 'warehousePoId': req.body._id }, function (err, doc) {
        //                 if (err) res.status(404).send(err);
        //                 else {
        //                     if (doc.length >= 1) {
        //                         doc.forEach(function (v, i) {
        //                             if (i != doc.length - 1) {
        //                                 var entry = new transportPoProductModel({
        //                                     orderNumber: warehousePoDoc[0].orderNumber,
        //                                     transportPoId: transportDoc._id,
        //                                     warehousePoId: v.warehousePoId,
        //                                     issuePoId: v.issuePoId,
        //                                     productId: v.productId,
        //                                     traderId: v.traderId,
        //                                     txtTotalPrice: v.txtTotalPrice,
        //                                     txtUnitPrice: v.txtUnitPrice,
        //                                     txtNoOfItems: v.txtNoOfItems,
        //                                     txtItemPerPackage: v.txtItemPerPackage,
        //                                     txtPackagingWeight: v.txtPackagingWeight,
        //                                     txtPackaging: v.txtPackaging,
        //                                     txtShipping: v.txtShipping,
        //                                 })
        //                                 entry.save(function (err, docs) {
        //                                     if (err) res.status(404).send(err);
        //                                     else { }
        //                                 })
        //                             }
        //                             if (i == doc.length - 1) {
        //                                 var entry = new transportPoProductModel({
        //                                     orderNumber: warehousePoDoc[0].orderNumber,
        //                                     transportPoId: transportDoc._id,
        //                                     warehousePoId: v.warehousePoId,
        //                                     issuePoId: v.issuePoId,
        //                                     productId: v.productId,
        //                                     traderId: v.traderId,
        //                                     txtTotalPrice: v.txtTotalPrice,
        //                                     txtUnitPrice: v.txtUnitPrice,
        //                                     txtNoOfItems: v.txtNoOfItems,
        //                                     txtItemPerPackage: v.txtItemPerPackage,
        //                                     txtPackagingWeight: v.txtPackagingWeight,
        //                                     txtPackaging: v.txtPackaging,
        //                                     txtShipping: v.txtShipping,
        //                                 })
        //                                 entry.save(function (err, docs) {
        //                                     if (err) {
        //                                         res.status(404).send(err);
        //                                     } else {
        //                                         /* Check if trader choose insurance */
        //                                         if (warehousePoDoc[0].insuranceId != null) {
        //                                             var entry = new insurancePoModel({
        //                                                 orderNumber: warehousePoDoc[0].orderNumber,
        //                                                 traderId: warehousePoDoc[0].traderId,
        //                                                 issuePoId: warehousePoDoc[0].issuePoId,
        //                                                 warehousePoId: req.body._id,
        //                                                 requestQuotationId: warehousePoDoc[0].requestQuotationId._id,
        //                                                 status: "pending",
        //                                                 deliveryLocation: warehousePoDoc[0].requestQuotationId.deliveryLocation._id,
        //                                                 warehouseId: warehousePoDoc[0].warehouseId,
        //                                                 transportId: warehousePoDoc[0].transportId,
        //                                                 clearingId: warehousePoDoc[0].clearingId,
        //                                                 insuranceId: warehousePoDoc[0].insuranceId,
        //                                                 warehouseServices: warehouseService,
        //                                                 transportServices: transportService,
        //                                                 clearingServices: clearingService,
        //                                                 insuranceServices: insuranceService,
        //                                             })
        //                                             entry.save(function (err, insurancePoDoc) {
        //                                                 if (err) {
        //                                                     res.status(404).send(err);
        //                                                 }
        //                                                 else {
        //                                                     if (doc.length >= 1) {
        //                                                         doc.forEach(function (v, i) {
        //                                                             if (i != doc.length - 1) {
        //                                                                 var entry = new insurancePoProductModel({
        //                                                                     orderNumber: warehousePoDoc[0].orderNumber,
        //                                                                     insurancePoId: insurancePoDoc._id,
        //                                                                     warehousePoId: v.warehousePoId,
        //                                                                     issuePoId: v.issuePoId,
        //                                                                     productId: v.productId,
        //                                                                     traderId: v.traderId,
        //                                                                     txtTotalPrice: v.txtTotalPrice,
        //                                                                     txtUnitPrice: v.txtUnitPrice,
        //                                                                     txtNoOfItems: v.txtNoOfItems,
        //                                                                     txtItemPerPackage: v.txtItemPerPackage,
        //                                                                     txtPackagingWeight: v.txtPackagingWeight,
        //                                                                     txtPackaging: v.txtPackaging,
        //                                                                     txtShipping: v.txtShipping,
        //                                                                 })
        //                                                                 entry.save(function (err, docz) {
        //                                                                     if (err) res.status(404).send(err);
        //                                                                     else { }
        //                                                                 })
        //                                                             }
        //                                                             if (i == doc.length - 1) {
        //                                                                 var entry = new insurancePoProductModel({
        //                                                                     orderNumber: warehousePoDoc[0].orderNumber,
        //                                                                     insurancePoId: insurancePoDoc._id,
        //                                                                     warehousePoId: v.warehousePoId,
        //                                                                     issuePoId: v.issuePoId,
        //                                                                     productId: v.productId,
        //                                                                     traderId: v.traderId,
        //                                                                     txtTotalPrice: v.txtTotalPrice,
        //                                                                     txtUnitPrice: v.txtUnitPrice,
        //                                                                     txtNoOfItems: v.txtNoOfItems,
        //                                                                     txtItemPerPackage: v.txtItemPerPackage,
        //                                                                     txtPackagingWeight: v.txtPackagingWeight,
        //                                                                     txtPackaging: v.txtPackaging,
        //                                                                     txtShipping: v.txtShipping,
        //                                                                 })
        //                                                                 entry.save(function (err, docz) {
        //                                                                     if (err) {
        //                                                                         res.status(404).send(err);
        //                                                                     }
        //                                                                     else {
        //                                                                         saveInvoiceLogistics(req, warehousePoDoc, function (status) {
        //                                                                             if (status) {
        //                                                                                 /*mail to Insurance Agent */
        //                                                                                 nodemailer.createTestAccount((err, account) => {
        //                                                                                     var mailOptions = {
        //                                                                                         from: '"Nicoza " <rxzone@gmail.com>',
        //                                                                                         to: warehousePoDoc[0].insuranceId.email,
        //                                                                                         subject: 'Request for Insurance',
        //                                                                                         css: `a{text-decoration: none;},
        //                                                                                             button{    background: rgba(0, 0, 255, 0.78);
        //                                                                                             border: none;
        //                                                                                             padding: 10px;}`,
        //                                                                                         html: `<h3 style="color:blue;">Request for Insurance</h3>
        //                                                                                             <div>Hello <b>${warehousePoDoc[0].insuranceId.registration_name}</b>,<br><br>
        //                                                                                             You have a request for Insurance.<br>
        //                                                                                             Please check your account.<br><br>
        //                                                                                             Thanks,<br>
        //                                                                                             The Nicoza team.<br><br>
        //                                                                                             <p align="center">This message was sent by Nicoza.<p>
        //                                                                                             </div>`
        //                                                                                     };
        //                                                                                     transporter.sendMail(mailOptions, function (err, information) {
        //                                                                                         if (err) { }
        //                                                                                         res.status(200).send(docz);
        //                                                                                     })
        //                                                                                 });
        //                                                                             }
        //                                                                             else {
        //                                                                                 res.status(404).send('Error')
        //                                                                             }
        //                                                                         })
        //                                                                     }
        //                                                                 })
        //                                                             }
        //                                                         })
        //                                                     }
        //                                                 }
        //                                             })
        //                                         }
        //                                         else {
        //                                             saveInvoiceLogistics(req, warehousePoDoc, function (status) {
        //                                                 if (status) {
        //                                                     res.status(200).send(docs)
        //                                                 }
        //                                                 else {
        //                                                     res.status(404).send('Error')
        //                                                 }
        //                                             })
        //                                         }
        //                                     }
        //                                 })
        //                             }
        //                         })
        //                     }
        //                 }
        //             })

        //             /*mail to buyer for packed order*/
        //             nodemailer.createTestAccount((err, account) => {
        //                 mailids = [warehousePoDoc[0].traderId.email, warehousePoDoc[0].buyerId.email];
        //                 var mailOptions = {
        //                     from: '"Nicoza " <rxzone@gmail.com>',
        //                     to: mailids,
        //                     subject: 'Your order is packed',
        //                     css: `a{text-decoration: none;},
        //                         button{    background: rgba(0, 0, 255, 0.78);
        //                         border: none;
        //                         padding: 10px;}`,
        //                     html: `<h3 style="color:blue;">Your order is packed</h3>
        //                         <div>Hello from Nicoza,<br><br>
        //                         Your Order ${warehousePoDoc[0].orderNumber} is packed.<br>
        //                         Please check your account.<br><br>
        //                         Thanks,<br>
        //                         The Nicoza team.<br><br>
        //                         <p align="center">This message was sent by Nicoza.<p>
        //                         </div>`
        //                 };
        //                 transporter.sendMail(mailOptions, function (err, information) {
        //                     if (err) { }
        //                     res.status(200).send(doc);
        //                 })
        //             });
        //             /*mail to Trader to notify warehouse accepted the request*/
        //             nodemailer.createTestAccount((err, account) => {
        //                 var mailOptions = {
        //                     from: '"Nicoza " <rxzone@gmail.com>',
        //                     to: warehousePoDoc[0].traderId.email,

        //                     subject: 'Status of Warehouse',
        //                     css: `a{text-decoration: none;},
        //                         button{    background: rgba(0, 0, 255, 0.78);
        //                         border: none;
        //                         padding: 10px;}`,
        //                     html: `<h3 style="color:blue;">Status of Warehouse</h3>
        //                         <div>Hello <b>${warehousePoDoc[0].traderId.registration_name}</b>,<br><br>
        //                         Your Order ${warehousePoDoc[0].orderNumber} is <b>${req.body.status}ed</b> by Warehouse.<br>
        //                         Please check your account.<br><br>
        //                         Thanks,<br>
        //                         The Nicoza team.<br><br>
        //                         <p align="center">This message was sent by Nicoza.<p>
        //                         </div>`
        //                 };
        //                 transporter.sendMail(mailOptions, function (err, information) {
        //                     if (err) { }
        //                     res.status(200).send(doc);
        //                 })
        //             });
        //         }
        //     })
        //   }


        }
    })
}

function sendMailStatus(req, callback) {
    //notification to buyer for accept and reject PO
    var entry = new notificationModel({
        traderId: req.body.traderId,
        message: 'Your PO is ' + req.body.status,
        // route : '',
        // read : ,
    });
    entry.save(function (err, doc) {
        if (err) res.status(404).send({ message: "error" })
        else {
            /*mail to buyer for accept and reject PO*/
            nodemailer.createTestAccount((err, account) => {
                var mailOptions = {
                    from: '"Nicoza " <rxzone@gmail.com>',
                    to: req.body.email,
                    subject: 'Status of Issue PO',
                    css: `a{text-decoration: none;},
                        button{    background: rgba(0, 0, 255, 0.78);
                        border: none;
                        padding: 10px;}`,
                    html: `<h3 style="color:blue;">Status of Issue PO</h3>
                            <div>Hello ${req.body.email},<br><br>
                            Your PO is <b>${req.body.status}ed</b>.<br>
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
    });
}
function generateOrderNumber() {
    const timestamp = Date.now();
    const year = new Date().getFullYear();
    const prefix = 'PORD-' + year + timestamp * 1000;
    return prefix;
}
function generateInvoiceNumber() {
    const timestamp = Date.now();
    const year = new Date().getFullYear();
    const prefix = 'INV-' + year + timestamp * 1000;
    return prefix;
}

module.exports = router;
