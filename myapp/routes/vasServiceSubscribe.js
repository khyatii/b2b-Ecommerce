var express = require('express');
var router = express.Router();
var vasServiceModel = require('../models/vasServiceModel')
var vasServiceSubscribeModel = require('../models/vasServiceSubscribeModel')
var token = require('../middleware/token');
/* GET users listing. */
var multer = require('multer');

router.post('/addVasServiceSubscribe', token, function (req, res, next) {

	vasServiceSubscribeModel.find({
		$and: [{ 'vasServiceId': req.body.vasServiceId }
			, { 'traderId': req.body.traderId }]
	}, (err, doc) => {
		if (err) {
			res.status(404).send(err);
			return;
		}
		if (doc.length == 0) {
			var entry = new vasServiceSubscribeModel({
				status: req.body.status,
				vasServiceId: req.body.vasServiceId,
				traderId: req.body.traderId
			})
			entry.save(function (err, result) {
				if (err) {
					res.status(404).send(err);
					return;
				}
				res.status(200).send({ message: "success" })
			})
		}
		else {
			vasServiceSubscribeModel.update({ '_id': doc[0]._id }, { 'status': req.body.status },
				function (err, data) {
					if (err) {
						res.status(404).send(err)

						//callback(false);
						return false;
					}
					else {
						res.status(200).send({ message: "success" })
					}


				})
		}
	})


})



router.get('/getAllVasService', token, function (req, res, next) {

	vasServiceModel.aggregate([{ $lookup: { from: "vasServiceSubscribe", localField: "_id", foreignField: "vasServiceId", as: "vas" } }, {
		$project: {
			"_id": 1,
			"servicePLan": 1,
			"location": 1,
			"price": 1,
			vas: {
				$filter: {
					input: "$vas",
					as: "vas",
					cond: { $eq: ["$$vas.traderId", req.body.traderId] }
				}
			}

		}

	}], function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		res.status(200).send(doc)
	})
})
module.exports = router;
