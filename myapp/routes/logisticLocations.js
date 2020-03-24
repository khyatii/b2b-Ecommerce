var express = require('express');
var router = express.Router();
const logisticToken = require('../middleware/logisticToken');
const logisticWarehouseLocationModel = require('../models/logisticWarehouseLocationModel');
router.post('/addWarehouseLocation', logisticToken, function (req, res, next) {

    var entry = new logisticWarehouseLocationModel({
        logistics_type:req.body.logistics_type,
        serviceType: req.body.serviceType,
        branch: req.body.txtLocationType,
        country: req.body.txtCountry,
        countryCode: req.body.countryCode,
        townName: req.body.txtTown,
        geoLocation: req.body.txtGeoLocation,
        status: req.body.txtStatus,
        ownershipType: req.body.txtOwnership,
        description: req.body.txtDescription,

        storageLocation: req.body.storageLocation,
        capacity: req.body.txtCapacity,
        packageType: req.body.packageType,
        dimensions: req.body.dimensions,
        ratePerUnit: req.body.ratePerUnit,

        destinationsTransport: req.body.destinationsTransport,
        destinationsClearing: req.body.destinationsClearing,

        transportServices: req.body.transportServices,
        clearingServices: req.body.clearingServices,

        townsCovered: req.body.townsCovered,
        insuranceServices: req.body.insuranceServices,

        logisticsId: req.body.logisticsId,
        logisticsType: req.body.logisticsType,
    })

    entry.save(function (err, doc) {
        if (err) {
            return res.status(404).send(err);
        }
        res.status(200).send(doc)
    })

})

router.get('/getLogisticsLocation', logisticToken, function (req, res, next) {
    logisticWarehouseLocationModel.find({ 'logisticsId': req.body.logisticsId }, function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
            return;
        }
        res.status(200).send(doc)
    })
})

router.post('/getOne', logisticToken, function (req, res, next) {
    logisticWarehouseLocationModel.find({ '_id': req.body._id }).exec(function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
            return;
        }
        res.status(200).send(doc)
    })
});

router.post('/updateOne', logisticToken, function (req, res, next) {

    logisticWarehouseLocationModel.update({ '_id': req.body._id._id }, {
        '$set': {
            locationName: req.body.txtLocationName,
            branch: req.body.txtLocationType,
            country: req.body.txtCountry,
            countryName: req.body.countryName,
            townName: req.body.txtTown,
            geoLocation: req.body.txtGeoLocation,
            status: req.body.txtStatus,
            ownershipType: req.body.txtOwnership,
            description: req.body.txtDescription,

            storageLocation: req.body.storageLocation,
            capacity: req.body.txtCapacity,

            destinationsTransport: req.body.destinationsTransport,
            destinationsClearing: req.body.destinationsClearing,

            transportServices: req.body.transportServices,
            clearingServices: req.body.clearingServices,

            townsCovered: req.body.townsCovered,
            insuranceServices: req.body.insuranceServices,
        }
    }, function (err, doc) {
        if (err) {
            res.status(404).send(err)
        }
        else {
            res.status(200).send({ message: "success" })
        }
    })
})

module.exports = router;