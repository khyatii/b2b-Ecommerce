var express = require('express');
var router = express.Router();
var token = require('../middleware/token');
var inventoryLocationModel = require('../models/inventoryLocationModel')
var serverUrl = require('../config/url').serverUrl
/* GET users listing. */
var multer = require('multer');
var mongoose = require('mongoose')


router.get('/getAllInventoryLocation', token, function (req, res, next) {
	inventoryLocationModel.find({ 'traderId': req.body.traderId,'status':'Active' }, function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		res.status(200).send(doc)
	})
})

router.post('/add', token, function (req, res, next) {
	var entry = new inventoryLocationModel({
		country: req.body.txtCountry,
		countryCode: req.body.countryCode,
		description: req.body.txtDescription,
		geoLocation: req.body.txtGeoLocation,
		locationName: req.body.txtLocationName,
		branch: req.body.txtLocationType,
		ownershipType: req.body.txtOwnership,
		size: req.body.txtSize,
		status: req.body.txtStatus,
		townName: req.body.txtTown,
		traderId: req.body.traderId
	})

	entry.save(function (err, doc) {
		if (err) {
			res.status(404).send(err);
			return;
		}
		res.status(200).send({ message: "success" })
	})

})

router.post('/getOne', token, function (req, res, next) {
	inventoryLocationModel.find({ '_id': req.body._id }).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		res.status(200).send(doc)
	})
});
router.post('/updateOne', token, function (req, res, next) {
	var userReq = req.body;
	inventoryLocationModel.update({ '_id': userReq._id }, {
		'$set': {
			country: req.body.txtCountry,
			countryCode: req.body.countryCode,
			description: req.body.txtDescription,
			geoLocation: req.body.txtGeoLocation,
			locationName: req.body.txtLocationName,
			branch: req.body.txtLocationType,
			ownershipType: req.body.txtOwnership,
			size: req.body.txtSize,
			status: req.body.txtStatus,
			townName: req.body.txtTown,
			traderId: userReq.traderId
		}
	}, function (err, doc) {
		if (err) {
			res.status(404).send(err)
		}
		else { }
		res.status(200).send({ message: "success" })
	})

})

module.exports = router;
