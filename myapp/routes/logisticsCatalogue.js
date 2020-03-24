const express = require('express'),
    router = express.Router(),
    logisticcategoryModel = require('../models/logisticcategoryModel'),
    logisticToken = require('../middleware/logisticToken'),
    token = require('../middleware/token'),
    logisticsModel = require('../models/logisticsPofileModel'),
    logisticsUnitsModel = require('../models/logisticsUnitsModel'),
    nodemailer = require('nodemailer'),
    transporter = require('../config/mailconfig'),
    async = require('async');
const constants = require('../config/url');
var clientUrl = constants.clientUrl;

//add logstics catalogue api
router.post('/addWarehouseCatalogue', logisticToken, (req, res, next) => {
    logisticcategoryModel.find({ "ServiceCategory": req.body.ServiceCategory, "ServiceName": req.body.ServiceName, "logisticsId": req.body.logisticsId }, function (err, doc) {
        if (doc.length != 0) {
            res.status(502).send("already Available")
        }
        else {
            var entry = new logisticcategoryModel({
                logisticsId: req.body.logisticsId,
                ServiceCategory: req.body.ServiceCategory,
                ServiceName: req.body.ServiceName,
                ServiceDescription: req.body.ServiceDescription,
                Unit: req.body.Unit,
                PricePerUnit: req.body.PricePerUnit,
                ServiceUrl: req.body.ServiceUrl,
                PriceRules: req.body.PriceRules,
                logisticsType: req.body.logisticsType
            });
            entry.save(function (err, data) {
                if (err) {
                    return res.status(404).send(err);
                }
                res.status(200).send(data)
            })
        }
    })
});
router.post('/UpdateWarehouseCatalogue', logisticToken, (req, res, next) => {
    logisticcategoryModel.find({ "ServiceCategory": req.body.ServiceCategory, "logisticsId": req.body.logisticsId, "ServiceName": req.body.ServiceName }, function (err, doc) {
        if (doc.length != 0) {
            res.status(502).send("already Available")
        }
        else {
            logisticcategoryModel.update({ '_id': req.body._id }, {
                '$set': {
                    ServiceCategory: req.body.ServiceCategory,
                    ServiceName: req.body.ServiceName,
                    ServiceDescription: req.body.ServiceDescription,
                    Unit: req.body.Unit,
                    PricePerUnit: req.body.PricePerUnit,
                    ServiceUrl: req.body.ServiceUrl,
                    PriceRules: req.body.PriceRules
                }
            }, (err, data) => {
                if (err) {
                    res.status(401).send(err)
                } else {
                    res.status(200).send(data)
                }
            })
        }
    })
})
router.get('/GetWarehouseCatalogue', logisticToken, (req, res, next) => {
    logisticcategoryModel.find({ 'logisticsId': req.body.logisticsId }, (err, data) => {
        if (err) {
            res.status(401).send("Unble to find ");
        }
        res.status(200).send(data);
    })
});
router.post('/GetOneWarehouseCatalogue', logisticToken, (req, res, next) => {
    logisticcategoryModel.find({ '_id': req.body._id }, (err, data) => {
        if (err) {
            res.status(401).send("Unble to find ");
        }
        res.status(200).send(data);
    })
})

router.get('/getServicesCategories', logisticToken, (req, res) => {
    logisticsModel.find({ '_id': req.body.logisticsId }, function (err, doc) {
        if (err) {
            res.status(404).send(err)
        }
        res.status(200).send(doc)
    })
});
// router.post('/getServicesCategoryByType', logisticToken, (req, res) => {
//     logisticsModel.find({ '_id': req.body.logisticsId}, function (err, doc) {
//         if (err) {
//             res.status(404).send(err)
//         }
//         res.status(200).send(doc)
//     })
// });

router.post('/getServicesTypesForLogi', token, (req, res) => {
    logisticsModel.find({ '_id': req.body._id }, function (err, doc) {
        if (err) {
            res.status(404).send(err)
        }
        res.status(200).send(doc)
    })
});

router.post('/getServicesTypes', logisticToken, (req, res) => {
    logisticsModel.find({ '_id': req.body._id }, function (err, doc) {
        if (err) {
            res.status(404).send(err)
        }
        res.status(200).send(doc)
    })
});

router.get('/getUnits', logisticToken, (req, res, next) => {
    logisticsUnitsModel.find({ 'logistics_type': { $in: req.body.logisticsType } }, function (err, doc) {
        if (err) {
            return res.status(404).send(err)
        }
        res.status(200).send(doc)
    })
});

module.exports = router;
