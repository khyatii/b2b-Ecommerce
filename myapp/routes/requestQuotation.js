const express = require('express'),
	router = express.Router(),
	productModel = require('../models/productModel'),
	notificationModel = require('../models/notificationModel'),
	quotationSupplierProductsModel = require('../models/quotationSupplierProductsModel'),
	requestQuotationModel = require('../models/requestQuotationModel'),
	requestQuotationSuppliersModel = require('../models/requestQuotationSuppliersModel'),
	mongoose = require('mongoose'),
	token = require('../middleware/token'),
	nodemailer = require('nodemailer'),
	transporter = require('../config/mailconfig');
const multer = require('multer');
// set the directory for the uploads to the uploaded to
const DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
const upload = multer({ dest: DIR }).single('photo');
const fs = require('fs');

router.post('/add', token, function (req, res, next) {

	var productName = '';
	var modelCode = '';
	var partNo = '';
	var prductCode = '';
	var serialNo = '';

	productModel.find({ '_id': req.body.productId }, function (err, doc) {
		if (err) res.status(404).send({ message: "error" })

		else {
			productName = doc[0].txtProductName;
			prductCode = doc[0].txtProductCode;
			modelCode = doc[0].txtModelCode;
			partNo = doc[0].txtPartNo;
			serialNo = doc[0].txtSerialNo;

			productModel.find({
				'txtProductName': productName,
				'_id': { $ne: req.body.productId._id },
				'traderId': { $ne: req.body.traderId },
			}, function (err, productOutput) {
				if (err) {
					res.status(404).send({ message: "error" })
					return;
				}
				if (productOutput.length == 0) {
					res.status(401).send({ message: "noSupplier" })
					return
				}

				saveRfq(req, function (err, result) {
					if (err) {
						res.status(404).send(err)
						return;
					}
					pushSupplierRfq(productOutput, result, function (err, doc) {
						if (err) {
							res.status(404).send(err)
							return;
						}
						res.status(200).send({ message: "success" })
					})
				})
			})
		}
	})
})

router.get('/getAllQuotation', token, function (req, res, next) {
	requestQuotationModel.aggregate([
		{
			$match: { 'supplierDetail.supplierId': req.body.traderId }
		}, {
			$lookup: {
				from: "trader", localField: 'traderId', foreignField: '_id', as: 'trader'
			}
		}, {
			$unwind: '$trader'
		},
		{
			$lookup: {
				from: "inventoryLocation", localField: 'deliveryLocation', foreignField: '_id', as: 'location'
			}
		}, {
			$unwind: '$location'
		},
		{
			$project: {
				'productName': 1, 'orderQuantity': 1,
				'traderName': '$trader.company_name',
				'closingDate': 1,
				'locationName': '$location.locationName'
			}
		},
	], function (err, doc) {
		if (err) {
			res.status(404).send(err);
			return;
		}
		res.status(200).send(doc);
	})
})

router.post('/getOneQuotation', token, function (req, res, next) {
	requestQuotationModel.aggregate([{ $match: { '_id': mongoose.Types.ObjectId(req.body._id) } },
	{ $lookup: { from: "trader", localField: 'traderId', foreignField: '_id', as: 'trader' } }, { $unwind: '$trader' },
	{ $lookup: { from: "inventoryLocation", localField: 'deliveryLocation', foreignField: '_id', as: 'location' } }, { $unwind: '$location' },
	{
		$project: {
			'unitMeasure': 1, 'paymentTerms': 1, 'productName': 1, 'orderQuantity': 1, 'shipping': 1
			, 'BuyerName': '$trader.company_name'
			, 'BuyerContact': '$trader.phone_number',
			'closingDate': 1, 'locationName': '$location.locationName'
		}
	}
	], function (err, doc) {
		if (err) {
			res.status(404).send(err);
			return;
		}
		res.status(200).send(doc);
	})
})

//View Request Quotations Details of Buyer
router.post('/getRqstQuotation', token, function (req, res, next) {
	quotationSupplierProductsModel.find({ "requestQuotationSupplierId": req.body._id, status: "pending" }).populate([
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
				path: 'txtCurrency',
				model: 'currency'
			}
		},

		{
			path: 'productId',
			model: 'productSeller',
			populate: {
				path: 'discountId',
				model: 'productDiscount',
			},
		},
		{
			path: 'requestQuotationId',
			model: 'requestQuotation'
		},
		{
			path: 'buyerId',
			model: 'trader',
		},
	]).exec(function (err, doc) {
		res.status(200).send(doc);
	})
})

//View Request Quotations Product Details
router.post('/viewQuotationProductDetails', token, function (req, res, next) {
	quotationSupplierProductsModel.find({ "requestQuotationSupplierId": req.body._id, status: "pending" }).populate([
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
				path: 'txtCurrency',
				model: 'currency'
			}
		},
		{
			path: 'buyerId',
			model: 'trader',
		},
		{
			path: "supplierId",
			model: 'trader',
		},
	]).exec(function (err, doc) {
		res.status(200).send(doc);
	})

})

//View Response Quotations Product Details
router.post('/viewResponseQuotationProducts', token, function (req, res, next) {
	quotationSupplierProductsModel.find({ "requestQuotationSupplierId": req.body._id, 'status': 'finalised', "statusIssuePo": "pending" }).populate([
		{
			path: 'productId',
			model: 'productSeller',
			populate: {
				path: 'productId',
				model: 'product',
			},
			populate: {
				path: 'txtCurrency',
				model: 'currency'
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
			path: "supplierId",
			model: 'trader',
		},


	]).exec(function (err, doc) {
		res.status(200).send(doc);
	})

})

//All Quotations Request
router.get('/getAllQuotationRequests', token, function (req, res, next) {
	requestQuotationSuppliersModel.find({ "buyerId": req.body.traderId, status: "pending" }).populate([
		{
			path: 'requestQuotationId',
			model: 'requestQuotation',
		},
		{
			path: "supplierId",
			model: 'trader',
		},
	]).exec(function (err, doc) {
		res.status(200).send(doc);
	})
})

//All Quotations Response
router.get('/getAllQuotationResponse', token, function (req, res, next) {
	requestQuotationSuppliersModel.find({
		"buyerId": req.body.traderId,
		$or: [{ status: "finalised" }, { status: "rejected" }]
	}).populate([
		{
			path: 'requestQuotationId',
			model: 'requestQuotation',
		},
		{
			path: "supplierId",
			model: 'trader',
		},
	]).exec(function (err, doc) {
		res.status(200).send(doc);
	})
})

router.post('/getSingleResponseData', token, function (req, res, next) {
	requestQuotationSuppliersModel.find({ "_id": req.body._id, status: "finalised" }).populate([
		{
			path: 'requestQuotationId',
			model: 'requestQuotation',
		},
		{
			path: "supplierId",
			model: 'trader',
		},
		{
			path: "buyerId",
			model: 'trader',
		},
	]).exec(function (err, doc) {
		res.status(200).send(doc);
	})
})
/* Quotation Request Per Item Cancelled by Seller */
router.post('/supplierQuotationCancelPerItem', token, function (req, res, next) {
	var arr = req.body.rejectArray;
	quotationSupplierProductsModel.find({
		'requestQuotationSupplierId': req.body.quotationSupplierId,
		status: 'pending'
	}, function (err, docs) {
		if (err) res.status(404).send(err);
		else {
			requestQuotationSuppliersModel.updateMany(
				{ '_id': req.body.quotationSupplierId },
				{
					$set: {
						"status": 'rejected',
						"updatedAt": Date.now(),
					}
				}, function (err, doc) {
					if (err) {
						res.status(404).send(err);
					} else {

						var quotationIdArray = arr.map(function (item) {
							return item._id;
						})

						quotationSupplierProductsModel.updateMany({ '_id': { $in: quotationIdArray } },
							{
								$set: {
									"status": 'rejected',
									"updatedAt": Date.now(),
								}
							}, function (err, result) {
								if (err) {
									res.status(404).send(err);
								}
								else {
									nodemailer.createTestAccount((err, account) => {
										var mailOptions = {
											from: '"Nicoza " <rxzone@gmail.com>',
											to: req.body.buyerEmail,
											subject: 'Request Rejected By Seller',
											css: `a{text-decoration: none;},
											button{    background: rgba(0, 0, 255, 0.78);
											border: none;
											padding: 10px;}`,
											html: `<h3 style="color:blue;">Request Rejected By Seller</h3>
											<div>Hello ${req.body.buyerEmail},<br><br>
											Quotation is Rejected by Seller.<br>
											Please check your account.<br><br>
											Thanks,<br>
											The Nicoza team.<br><br>
											<p align="center">This message was sent by Nicoza.<p>
											</div>`
										};
										transporter.sendMail(mailOptions, function (err, information) {
											if (err) { }
											res.status(200).send({ email: req.body.buyerEmail });
										})
									})
								}
							}
						)
					}
				}
			)
		}
	})
})
/* Quotation Request Cancelled by Seller */
// router.post('/supplierQuotationCancel', token, function (req, res, next) {
// 	requestQuotationSuppliersModel.updateMany(
// 		{ '_id': req.body.quotationSupplierId },
// 		{
// 			$set: {
// 				"status": req.body.status,
// 				"updatedAt": Date.now(),
// 			}
// 		}, function (err, doc) {
// 			if (err) {
// 				res.status(404).send(err);
// 				return;
// 			} else {
// 				nodemailer.createTestAccount((err, account) => {
// 					var mailOptions = {
// 						from: '"Nicoza " <rxzone@gmail.com>',
// 						to: req.body.buyerEmail,
// 						subject: 'Request Rejected By Seller',
// 						css: `a{text-decoration: none;},
// 							button{    background: rgba(0, 0, 255, 0.78);
// 							border: none;
// 							padding: 10px;}`,
// 						html: `<h3 style="color:blue;">Request Rejected By Seller</h3>
// 							<div>Hello ${req.body.buyerEmail},<br><br>
// 							Quotation is Rejected by Seller.<br>
// 							Please check your account.<br><br>
// 							Thanks,<br>
// 							The Nicoza team.<br><br>
// 							<p align="center">This message was sent by Nicoza.<p>
// 							</div>`
// 					};
// 					transporter.sendMail(mailOptions, function (err, information) {
// 						if (err) { }
// 						res.status(200).send({ email: req.body.buyerEmail });
// 					})
// 				})
// 			}
// 		})
// })

//modify product Details of buyer
router.post('/supplierQuotationResponse', token, function (req, res, next) {
	requestQuotationSuppliersModel.updateMany(
		{ '_id': req.body.quotationSupplierIds },
		{
			$set: {
				"status": 'finalised',
				"updatedAt": Date.now(),
			}
		}, function (err, doc) {
			if (err) {
				res.status(404).send(err);
				return;
			}

			nodemailer.createTestAccount((err, account) => {
				var mailOptions = {
					from: '"Nicoza " <rxzone@gmail.com>',
					to: req.body.buyerEmail,
					subject: 'Request Accepted By Seller',
					css: `a{text-decoration: none;},
	                            button{    background: rgba(0, 0, 255, 0.78);
	                            border: none;
	                            padding: 10px;}`,
					html: `<h3 style="color:blue;">Request Accepted By Seller</h3>
	                            <div>Hello ${req.body.buyerEmail},<br><br>
	                            Response is modified/accepted by Seller.<br>
	                            Please check your account.<br><br>
	                            Thanks,<br>
	                            The Nicoza team.<br><br>
	                            <p align="center">This message was sent by Nicoza.<p>
	                            </div>`
				};
				transporter.sendMail(mailOptions, function (err, information) {
					if (err) { }
					res.status(200).send({ email: req.body.buyerEmail });
				})
			})


		})

	var product = req.body.items;
	product.forEach(function (element, index) {
		var productarray = (product.length - 1)
		quotationSupplierProductsModel.updateMany(
			{ '_id': element.hiddenId },
			{
				$set: {
					"txtPaymentModeWithDiscount": element.txtPaymentModeWithDiscount,
					"txtUnitPrice": element.txtUnitPrice,
					"txtNoOfItems": element.txtNoOfItems,
					"txtItemPerPackage": element.txtItemPerPackage,
					"txtPackagingWeight": element.txtPackagingWeight,
					"txtPackaging": element.txtPackaging,
					"txtPaymentModeDiscount": element.txtPaymentModeDiscount,
					"txtEarlyPaymentTermDiscount": element.txtEarlyPaymentTermDiscount,
					"txtDiscountForEarlyPayment": element.txtDiscountForEarlyPayment,
					"txtTotalPrice": element.txtTotalPrice,
					"status": 'finalised',
					"updatedAt": Date.now(),
				}
			}, function (err, doce) {
				if (index == productarray) {
					//For notification
					var entry = new notificationModel({
						traderId: req.body.traderId,
						message: 'Quoation modified.',
						// route : '',
						// read : ,
					});
					entry.save(function (err, docs) {
						if (err) res.status(404).send({ message: "error" })
						else {
							res.status(200).send(doce);
						}
					});
				}
			})
	}, this);
})

// , function (err, doce) { this was for modifying quotations
// 				if (index == productarray) {
// 					//For notification
// 					var entry = new notificationModel({
// 						traderId: req.body.traderId,
// 						message: 'Quoation modified.',
// 						// route : '',
// 						// read : ,
// 					});
// 					entry.save(function (err, docs) {
// 						if (err) res.status(404).send({ message: "error" })
// 						else {
// 							res.status(200).send(doce);
// 						}
// 					});
// 				}
// 			}


var saveRfq = function (req, cb) {
	var entry = new requestQuotationModel({
		productName: req.body.txtProduct,
		orderQuantity: req.body.txtOrderQuantity,
		unitMeasure: req.body.txtUnitOfMeasure,
		invitationType: req.body.txtinvitationType,
		currency: req.body.txtCurrency,
		paymentTerms: req.body.txtPaymentTerms,
		closingDate: req.body.txtClosingDate,
		deliveryLocation: req.body.txtDelivery,
		shipping: req.body.txtShipping,
		supplierDetail: [],
		traderId: req.body.traderId,
		userId: req.body.userId,
	})
	entry.save(function (err, doc) {
		err ? cb(err) : cb(null, doc)
	})
}

var pushSupplierRfq = function (product, rfq, cb) {
	product.forEach(function (element, index) {
		var obj = {
			supplierId: element.traderId,
			productId: element._id
		}
		requestQuotationModel.updateMany({ '_id': rfq._id },
			{ $push: { "supplierDetail": obj } }, function (err, doc) {
				if (err) {
					cb(err);
				}
				if (index == product.length - 1) {
					cb(null, doc);
				}
			})
	}, this);
}

//Request quotations of buyers
router.get('/viewQuotationRequests', token, function (req, res, next) {
	requestQuotationSuppliersModel.find({ supplierId: req.body.traderId, status: 'pending' }).populate([
		{
			path: 'requestQuotationId',
			model: 'requestQuotation',
		},
		{
			path: 'buyerId',
			model: 'trader',
		},
	]).exec(function (err, doc) {
		res.status(200).send(doc);
	})
})

router.post('/postSupplierQuotations', token, function (req, res, next) {
	var gerRequest = req.body;

	const generateRFQNo = generateRFQNumber();

	saveRfqSupplier(gerRequest, generateRFQNo, function (err, result) {
		if (err) {
			res.status(404).send(err);
		}
		else {
			pushSupplierRfqSupplier(gerRequest, generateRFQNo, gerRequest.productArray, result, function (err, doc) {
				if (err) {
					res.status(404).send(err)
					return;
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
							res.status(404).send(err)
							return;
						}
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
					})
				}
			})
		}
	})
})

var saveRfqSupplier = function (gerRequest, generateRFQNo, cb) {
	var entry = new requestQuotationModel({
		RFQNumber: generateRFQNo,
		invitationType: gerRequest.txtinvitationType,
		currency: gerRequest.txtCurrency,
		paymentTerms: gerRequest.txtPaymentTerms,
		closingDate: gerRequest.txtClosingDate,
		deliveryLocation: gerRequest.txtDeliveryLocation,
		shipping: gerRequest.txtShipping,
		supplierDetail: [],
		supplier: gerRequest.supplier,
		traderId: gerRequest.traderId,
		userId: gerRequest.userId,
	})
	entry.save(function (err, doc) {
		err ? cb(err) : cb(null, doc)
	})
}

var pushSupplierRfqSupplier = function (gerRequest, generateRFQNo, product, result, cb) {
	var supplierQuotationIdArray = [];
	var entry = new requestQuotationSuppliersModel({
		RFQNumber: generateRFQNo,
		requestQuotationId: result._id,
		supplierId: product[0].optSupplier._id,
		buyerId: gerRequest.traderId,
		locationId: gerRequest.txtDelivery,
		shipping: gerRequest.txtShipping,
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

			var Qty = product[0].txtOrderQuantity;
			var totalPrice = Qty * product[0].optProduct.txtPrice;

			var entry = new quotationSupplierProductsModel({
				RFQNumber: generateRFQNo,
				buyerId: gerRequest.traderId,
				supplierId: product[0].optSupplier._id,
				requestQuotationId: result._id,
				productId: product[0].optProduct._id,
				requestQuotationSupplierId: doc._id,
				txtUnitPrice: product[0].optProduct.txtPrice,
				txtCurrency: product[0].optProduct.txtCurrency,
				txtTotalPrice: totalPrice,
				txtNoOfItems: Qty,
				shipping: gerRequest.txtShipping,
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
	})
}

/* Submit quotation when buyer do search for supplier*/
router.post('/postSearchSupplierQuotations', token, function (req, res, next) {
	var gerRequest = req.body;

	const generateRFQNo = generateRFQNumber();

	saveRfqSearchSupplier(gerRequest, generateRFQNo, function (err, result) {
		if (err) {
			res.status(404).send(err);
		}
		else {
			pushSupplierRfqSearchSupplier(gerRequest, generateRFQNo, gerRequest.data[0], result, function (err, doc) {
				if (err) {
					res.status(404).send(err)
					return;
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
							res.status(404).send(err)
							return;
						}
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
					})
				}
			})
		}
	})
})

var saveRfqSearchSupplier = function (gerRequest, generateRFQNo, cb) {
	var entry = new requestQuotationModel({
		invitationType: "Closed",
		RFQNumber: generateRFQNo,
		currency: gerRequest.txtCurrency,
		paymentTerms: gerRequest.txtPaymentTerms,
		closingDate: gerRequest.txtClosingDate,
		deliveryLocation: gerRequest.txtDeliveryLocation,
		shipping: gerRequest.txtShipping,
		supplierDetail: [],
		supplier: gerRequest.data[0].traderId._id,
		traderId: gerRequest.traderId,
		userId: gerRequest.userId,
	})
	entry.save(function (err, doc) {
		err ? cb(err) : cb(null, doc)
	})
}

var pushSupplierRfqSearchSupplier = function (gerRequest, generateRFQNo, product, result, cb) {
	var supplierQuotationIdArray = [];
	var entry = new requestQuotationSuppliersModel({
		RFQNumber: generateRFQNo,
		requestQuotationId: result._id,
		supplierId: product.traderId._id,
		buyerId: gerRequest.traderId,
		locationId: gerRequest.txtDeliveryLocation,
		shipping: gerRequest.txtShipping,
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

			var Qty = gerRequest.txtOrderQuantity;
			var totalPrice = Qty * product.txtPrice;
			var entry = new quotationSupplierProductsModel({
				RFQNumber: generateRFQNo,
				buyerId: gerRequest.traderId,
				supplierId: product.traderId._id,
				requestQuotationId: result._id,
				productId: product._id,
				requestQuotationSupplierId: doc._id,
				txtUnitPrice: product.txtPrice,
				txtCurrency: product.txtCurrency,
				txtTotalPrice: totalPrice,
				txtNoOfItems: Qty,
				shipping: gerRequest.txtShipping,
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
	})
}

function generateRFQNumber() {
	const timestamp = Date.now();
	const year = new Date().getFullYear();
	const prefix = 'RQ-' + year + timestamp * 1000;
	return prefix;
}

module.exports = router;
