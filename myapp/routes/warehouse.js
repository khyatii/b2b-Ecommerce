
var express = require('express');
var router = express.Router();
var warehouseModel = require('../models/warehouseModel');
var logisticsPofileModel = require('../models/logisticsPofileModel');
var logisticcategoryModel = require('../models/logisticcategoryModel');
var user = require('../models/userModel');
var token = require('../middleware/token');
var logisticToken = require('../middleware/logisticToken');
var nodemailer = require('nodemailer');
var transporter = require('../config/mailconfig');

/* GET users listing. */
router.post('/save', token, function (req, res, next) {
    warehouseModel.find({
        'txtWarehouse': req.body.txtWarehouse, 'traderId': req.body.traderId
    }, function (err, doc) {
        if (doc.length != 0) {
            res.status(502).send("already Available")
        }
        else {
            var entry = new warehouseModel({
                txtCountry: req.body.txtCountry,
                txtCountryCode: req.body.txtCountryCode,
                txtTown: req.body.txtTown,
                txtWarehouse: req.body.txtWarehouse,
                txtWarehouseName: req.body.txtWarehouseName,
                serviceType: req.body.serviceType,
                serviceName: req.body.serviceName,
                txtPriority: req.body.txtPriority,
                txtShareTransportServiceDetails: req.body.txtShareTransportServiceDetails,
                txtShareConsignmentDetails: req.body.txtShareConsignmentDetails,
                traderId: req.body.traderId,
            })
            entry.save(function (err, docs) {
                if (err) {
                    res.status(404).send(err);
                }
                res.status(200).send({ message: "success" });
            });
        }
    })
})
router.get('/getAll', token, function (req, res, next) {
    warehouseModel.find({ 'traderId': req.body.traderId }).exec(function (err, doc) {
        if (err) {
            return res.status(404).send(err);
        }
        res.status(200).send(doc);
    })
})
router.get('/getAllWarehouse', function (req, res, next) {
    logisticsPofileModel.find({
        $or: [{ "logistics_type": "Warehouse" }]
    }, function (err, doc) {
        if (err) {
            res.status(404).send(err);
            return;
        }
        res.status(200).send(doc)

    })
});

router.post('/getWarehouseCountry', token, (req, res) => {
    let countryCode = req.body.warehousecountry;
    logisticsPofileModel.find({ 'country_name': countryCode, 'logistics_type': 'Warehouse' }).exec()
        .then(resp => {
            res.status(200).json({
                message: 'found warehouses',
                data: resp
            });
        })
        .catch(err => {
            res.status(400).json({
                message: 'some error occured',
                error: err
            })
        })
});

router.post('/warehouseService', token, function (req, res) {
    var seenNames = {};
    logisticcategoryModel.find({ 'logisticsId': req.body.warehouseType }, function (err, data) {
        if (err) {
            res.status(404).send(err);
            return;
        }
        else {
            var Logisticdata = data;
            array = Logisticdata.filter(function (currentObject) {
                if (currentObject.ServiceCategory in seenNames) {
                    return false;
                } else {
                    seenNames[currentObject.ServiceCategory] = true;
                    return true;
                }
            });
            res.status(200).send(array)
        }
    })
})

router.post('/warehouseServiceName', token, function (req, res) {
    logisticcategoryModel.find({ 'ServiceCategory': req.body.warehouseName, "logisticsId": req.body.logisticsId }, function (err, doc) {
        if (err) {
            return res.status(404).send(err);
        }
        else {
            res.status(200).send(doc);
        }
    })
})

router.post('/getOne', token, function (req, res, next) {
    warehouseModel.find({ '_id': req.body._id }, function (err, doc) {
        if (err) {
            res.status(404).send(err);
            return;
        }
        res.status(200).send(doc)
    })
})
router.post('/update', token, function (req, res, next) {
    warehouseModel.update({ '_id': req.body._id }, {
        '$set': {
            txtCountry: req.body.txtCountry,
            txtCountryCode: req.body.txtCountryCode,
            txtTown: req.body.txtTown,
            txtWarehouse: req.body.txtWarehouse,
            txtWarehouseName: req.body.txtWarehouseName,
            serviceType: req.body.serviceType,
            serviceName: req.body.serviceName,
            txtPriority: req.body.txtPriority,
            txtShareTransportServiceDetails: req.body.txtShareTransportServiceDetails,
            txtShareConsignmentDetails: req.body.txtShareConsignmentDetails,
        }
    }, function (err, docs) {
        if (err) {
            res.status(404).send(err);
            return;
        }
        res.status(200).send({ message: "success" })
    })
})
router.post('/getLogicticsSupplier', token, function (req, res, next) {
    warehouseModel.find({ 'traderId': req.body.supplierId }).populate([
        {
            path: 'txtWarehouse',
            model: 'logisticsUser'
        }
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send(err)
            return;
        } else {
            res.status(200).send(doc);
        }
    })
});

router.get('/getWarehouseRequest', logisticToken, function (req, res, next) {
    let logisticId = req.body.logisticsId;
    warehouseModel.find({ 'txtWarehouse': logisticId }).populate([
        {
            path: 'traderId',
            model: 'trader'
        }
    ]).exec()
        .then(resp => {
            res.status(200).json({
                message: 'order found',
                data: resp
            })
        })
        .catch(err => {
            res.status(400).json({
                message: 'error occured',
                data: err
            })
        })
});

router.post('/warhouseReqStatus', (req, res) => {
    let actionReq = req.body.isAccepted;
    let ItemId = req.body.requestId;
    let traderId = req.body.trader;
    warehouseModel.update({ '_id': ItemId },
        { $set: { 'statusLogistic': actionReq } }).exec()
        .then(resp => {
            if (actionReq == 'rejected' || actionReq == 'accepted') {
                nodemailer.createTestAccount((err, account) => {
                    var mailIds = [traderId];
                    var mailOptions = {
                        from: '"Nicoza " <rxzone@gmail.com>',
                        to: mailIds,
                        subject: 'warehouse request status changed',
                        css: `a{text-decoration: none;},
                             button{    background: rgba(0, 0, 255, 0.78);
                             border: none;
                             padding: 10px;},
                             `,
                        html: `<h3 style="color:blue;">warehouse Request ${actionReq}</h3
                                 <p>Your request for warehouse is changed to ${actionReq} . For more details
                                 visit <button href='#'>Nicoza</button>
                                 </p>
                                 `,
                    }

                    transporter.sendMail(mailOptions, function (err, information) {
                        if (err) {
                        }
                    })

                })

            }

            res.status(200).json({
                message: 'updated',
                status: actionReq,
                data: resp
            })
        })
        .catch(err => {
            res.status(400).json({
                message: 'notUpdated',
                error: err
            })
        })
})

module.exports = router;
