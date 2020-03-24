var express = require('express');
var router = express.Router();
var productModel = require('../models/productModel')
var customerGroupModel = require('../models/customerGroupModel')
var productDiscountModel = require('../models/productDiscountModel')
var productSellerModel = require('../models/productSellerModel')
var token = require('../middleware/token');
/* GET users listing. */
var multer = require('multer');
// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({ dest: DIR }).single('photo');
var fs = require('fs');

router.post('/getProduct', token, function (req, res, next) {
	//var categoryId = req.body.categoryId;
	productModel.find({ 'traderId': req.body.traderId }, function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		res.status(200).send(doc)
	})
})

router.get('/getCustomerGroup', token, function (req, res, next) {
	customerGroupModel.find({ 'traderId': req.body.traderId }, function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		res.status(200).send(doc)
	})
})

router.post('/addProductDiscount', token, function (req, res, next) {
	const {
		productId,
		customerGroupId,
		end_date
	} = req.body;
	productDiscountModel.findOne({ $and: [{ productId }, { customerGroupId }] }, 'productId', (err, foundProduct) => {
		if (foundProduct) return res.status(400).json({ message: 'This Product already exists' });
		else {
			var productDiscount = new productDiscountModel({
				productId: req.body.productId,
				customerGroupId: req.body.customerGroupId,
				discount: req.body.discount,
				minimumOrder: req.body.minimumOrder,
				start_date: req.body.start_date,
				end_date: req.body.end_date,
				traderId: req.body.traderId,
			});

			productDiscount.save(function (err, catRes) {
				if (err) {
					return res.status(404).send(err);
				}
				else {
					customerGroupModel.findOne({ '_id': req.body.customerGroupId }, function (err, discount) {
						if (!discount) {
							return res.status(401).send({ message: "not found" })
						}
						return res.status(200).send(discount)	
					});
				}
			})
		}
	})
})



router.get('/getAllProductDiscount', token, function (req, res, next) {
	productDiscountModel.find({ 'traderId': req.body.traderId }).populate([
		{
			path: 'productId',
			model: 'product',
		}, {
			path: 'customerGroupId',
			model: 'customerGroup',
		},
	]).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		res.status(200).send(doc)
	})
})

router.post('/getOneProductDiscount', token, function (req, res, next) {
	productDiscountModel.find({ '_id': req.body._id }).populate([
		{
			path: 'productId',
			model: 'product',
		}, {
			path: 'customerGroupId',
			model: 'customerGroup',
		},
	]).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}

		res.status(200).send(doc)

	})
});

router.post('/updateProductDiscount', token, function (req, res, next) {
	productDiscountModel.update({ '_id': req.body._id }, {
		'$set': {
			productId: req.body.productId,
			customerGroupId: req.body.customerGroupId,
			discount: req.body.discount,
			minimumOrder: req.body.minimumOrder,
			start_date: req.body.start_date,
			end_date: req.body.end_date,
			traderId: req.body.traderId,
		}
	}, function (err, doc) {
		if (err) {
			res.status(404).send(err)
			return false;
		}
		else {
			res.status(200).send({ message: "success" })
		}
	})
})
router.post('/deleteDiscount', token, function (req, res) {
	productDiscountModel.deleteOne({ '_id': req.body.id }, function (err, discount) {
		if (err) {
			res.status(404).send("something went wrong");
		} else {
			res.status(200).send(discount)
		}
	})
})

module.exports = router;
