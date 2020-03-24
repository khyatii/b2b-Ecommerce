var express = require('express');
var router = express.Router();
var customerGroupModel = require('../models/customerGroupModel')
var token = require('../middleware/token');

router.post('/addCustomerGroup', token, function (req, res, next) {

	customerGroupModel.find({ 'traderId': req.body.traderId, 'name': req.body.name }, (err, data) => {
		if (data.length > 0) {
			res.status(401).send(data[0])
		} else {
			try {
				var customerGroup = new customerGroupModel({
					name: req.body.name,
					status: req.body.status,
					traderId: req.body.traderId,
				});

				customerGroup.save(function (err, catRes) {
					if (err) {
						res.status(404).send(err);
						return;
					}
					var length = req.body.member.length;
					var memberArray = req.body.member;

					memberArray.forEach(function (element, index) {
						customerGroupModel.update({ '_id': catRes._id },
							{ $push: { 'member': { CustomerId: element } } }, function (err, docs) {
								if (err) {
									res.status(500).send("err")
								}
								if (index == length - 1) {
									res.status(200).send({ message: "success" })
								}
							})
					}, this);

				});

			}
			catch (e) {
				res.status(404).send(e);
			}
		}
	})


})

router.get('/getAll', token, function (req, res, next) {
	customerGroupModel.find({ 'traderId': req.body.traderId })
		.exec(function (err, doc) {
			if (err) {
				res.status(404).send({ message: "error" })
				return;
			}
			res.status(200).send(doc)
		})
})

router.get('/getAllActive', token, function (req, res, next) {
	customerGroupModel.find({ $and: [{ 'traderId': req.body.traderId }, { "status": "Active" }] })
		.exec(function (err, doc) {
			if (err) {
				res.status(404).send({ message: "error" })
				return;
			}
			res.status(200).send(doc)
		})
})

router.post('/modify', token, function (req, res, next) {
	try {
		customerGroupModel.update({ '_id': req.body._id }, {
			'$set': {
				name: req.body.name,
				status: req.body.status,
			}
		}, function (err, doc) {
			if (err) {
				res.status(404).send(err);
				return;
			}
			var length = req.body.member.length;
			if (length > 0) {
				var memberArray = req.body.member;
				memberArray.forEach(function (element, index) {
					customerGroupModel.update({ '_id': req.body._id },
						{ $push: { 'member': { CustomerId: element } } }, function (err, docs) {
							if (err) {
								res.status(500).send("err")
							}
							if (index == length - 1) {
								return res.status(200).send(docs)
							}
						})
				}, this);
			}
			else {
				return res.status(200).send({ message: "success" })
			}
		})
	}
	catch (e) {
		return res.status(404).send({ e })
	}
})

router.post('/getOne', token, function (req, res, next) {
	customerGroupModel.find({ '_id': req.body.groupId }, function (err, doc) {
		if (err) {
			res.status(404).send(err);
			return;
		}
		res.status(200).send(doc)
	})
})



module.exports = router;
