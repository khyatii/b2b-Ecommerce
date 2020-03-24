var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var users = require('../models/traderModel')
var token = require('../middleware/token');
/* GET users listing. */
var multer = require('multer');
var ServicesvasModel = require('../models/ServicesvasModel');
var vasServiceSubscribe = require('../models/vasServiceSubscribeModel')


router.post('/addVasService', token, function (req, res, next) {
	var vasService = new vasServiceModel({

		servicePLan: req.body.servicePLan,
		location: req.body.location,
		price: req.body.price,
	});
	vasService.save(function (err, catRes) {
		if (err) {
			res.status(404).send(err);
			return;
		}
		else {
			var lastId = catRes._id;
			users.find({}).exec(function (err, user) {
				if (err) {
					res.status(404).send({ message: "error" })
					return;
				}
				for (i = 0; i < user.length; i++) {
					var vasService = new vasServiceSubscribe({
						status: 'unsubscribe',
						vasServiceId: lastId,
						traderId: user[i]._id,
					});
					vasService.save(function (err, catRes) {
						if (err) {
							res.status(404).send(err);
							return;
						}
						else { }
					});
				}
			})
			res.status(200).send({ message: "Success" })
		}
	})
})

router.get('/getAllVasService', token, function (req, res, next) {
	vasServiceModel.find({}).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		res.status(200).send(doc)
	})
})

router.post('/valueAddServices', (req, res) => {
	var serviceObj = req.body;
	var generateWithId = serviceObj.items.map(function (item) {
		item._id = mongoose.Types.ObjectId();
		return item;
	});
	var entry = new ServicesvasModel({
		name: serviceObj.Name,
		customerCategory: serviceObj.customerCat,
		billingCycle: serviceObj.billCycle,
		paymentTerms: serviceObj.paymentTerms,
		vasType: serviceObj.services,
		Fee: serviceObj.serviceFee,
		description: serviceObj.serviceDescription,
		serviceCat: generateWithId,
	})
	entry.save((err, resp) => {
		if (err) res.status(400).send({ message: 'could not save product' });
		else {
			res.status(200).send({
				message: 'successfully saved in db'
			})
		}
	});
});

router.get('/getAllVas', (req, res) => {
	ServicesvasModel.find({}, (err, resp) => {
		if (err) res.status(400).send({
			message: 'could not find the services'
		})
		else res.status(200).send(resp);
	})
})

router.post('/deleteServices', (req, res) => {
	ServicesvasModel.findByIdAndRemove(req.body._id, (err, resp) => {
		if (err) res.status(400).send({ message: 'the selected item not deleted', error: err })
		else res.status(200).send({ message: 'item deleted', response: resp });
	})
})

router.post('/getoneVas', (req, res) => {
	ServicesvasModel.findOne({ '_id': req.body._id }, (err, doc) => {
		if (err) res.status(400).send(err)
		else res.status(200).send(doc);
	})
});

router.post('/updateoneVas', (req, res) => {
	let newData = {
		'name': req.body.Name,
		'customerCategory': req.body.customerCategory,
		'billingCycle': req.body.billCycle,
		'paymentTerms': req.body.paymentTerms,
		'vasType': req.body.services,
		'Fee': req.body.serviceFee,
		'description': req.body.serviceDescription,
		'serviceCat': req.body.items
	}
	ServicesvasModel.updateMany({ '_id': req.body._id },
		{ $set: newData }, (err, doc) => {
			if (err) res.status(400).send(err)
			else {
				res.status(200).send(doc);
			}
		})
});
router.post('/planVasServiceByName', (req, res) => {
	ServicesvasModel.find({ 'name': req.body.name }, (err, data) => {
		if (err) {
			res.status(400).send(err);
		} else {
			res.status(200).json({
				data: data,
				message: "Fetch Data"
			})
		}
	})

})


module.exports = router;
