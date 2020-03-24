var express = require('express');
var router = express.Router();
var industry = require('../models/industryModel');
var productModel = require('../models/productModel')
var productSellerModel = require('../models/productSellerModel')
var traderModel = require('../models/traderModel');
var productDiscount = require('../models/productDiscountModel');
var productSubCategoryModel = require('../models/subCategoryModel')
var productCategoryModel = require('../models/categoryModel');
var inventoryLocation = require('../models/inventoryLocationModel');
var currency = require('../models/currencyModel');
var token = require('../middleware/token');
var locationModel = require('../models/locationModel')

var serverUrl = require('../config/url').serverUrl
/* GET users listing. */
var multer = require('multer');
var mongoose = require('mongoose')
// var csv = require('fast-csv');
var json2csv = require('json2csv');
const csv = require('csvtojson');
var async = require('async');
const Json2csvParser = require('json2csv').Parser;
// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({ dest: DIR }).single('photo');
// var approvalProduct = require('./approvalProcess').approvalProduct
// var fs = require('fs');
// var productcsvfiles = multer({dest:'productscsv/'})




router.get('/getAllProductList', token, function (req, res, next) {
	var seenNames = {};
	productSellerModel.find({ 'traderId': { $ne: req.body.traderId } }).populate([
		{
			path: 'productId',
			model: 'product'
		}
	]).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		var data = doc;
		array = data.filter(function (currentObject) {

			if (currentObject.productId.txtProductName in seenNames) {
				return false;
			} else {
				seenNames[currentObject.productId.txtProductName] = true;
				return true;
			}
		});
		res.status(200).send(array)
	})
})

router.get('/userLocation', token, (req, res, next) => {
	locationModel.find({ 'traderId': req.body.traderId }, (err, data) => {
		if (err) {
			res.status(401).send("something error")
		} else {
			res.status(200).send(data)
		}
	})

});
router.post('/getBranch', token, (req, res, next) => {
	inventoryLocation.find({ 'traderId': req.body.traderId }, (err, data) => {
		if (err) {
			res.status(401).send("something error")
		} else {
			res.status(200).send(data)
		}
	})

})
router.post('/getAllProduct', function (req, res, next) {
	productSellerModel.find({ 'traderId': req.body.traderId }).populate([{
		path: 'productId',
		model: 'product',
	}
	]).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		res.status(200).send(doc)
	})
})
router.post('/getSubCategory', function (req, res, next) {
	var categoryId = req.body.categoryId;
	productSubCategoryModel.find({ categoryId: categoryId }, function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		res.status(200).send(doc)
	})
})

router.post('/getCategories', function (req, res) {
	var industryId = req.body.industryId;
	productCategoryModel.find({ industryId: industryId }, function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
		}
		res.status(200).send(doc)
	})
})

router.get('/getCategory', function (req, res, next) {

	productCategoryModel.find({ 'trad`erId': req.body.traderId }, function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}

		res.status(200).send(doc)

	})
})

router.get('/getPrefferedSupplier', token, function (req, res, next) {
	traderModel.find({}, function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}

		res.status(200).send(doc)

	})
})

router.post('/add', token, function (req, res) {
	var userReq = req.body;
	var username;
	var freeuploads = 10;
	var userId = userReq.traderId;
	traderModel.findOne({ '_id': userId }, function (err, resp) {
		if (err) res.status(400).send('user not registered');
		else {
			productSellerModel.find({ 'traderId': userId }).count() //restrict user to 10 products us
				.exec()
				.then(count => {
					if (count <= freeuploads) {
						username = resp.registration_name;
						productSellerModel.find({ txtProductCode: userReq.txtProductCode }, function (err, foundProduct) {
							if (foundProduct.length === 0) {
								saveProduct(userReq, username, function (output) {
									res.status(200).send({ id: output })
								}, req);
							}
							else {
								res.status(400).send({ message: "DuplicateProdcutCode" })
							}
						})
					} else {									//redirect to subscribe services
						res.status(403).json({
							message: 'you can not add more then 10 products in trial version, please upgrade to premium',
							redirectTo: 'services/subscribe'
						})
					}
				})

		}
	})

})

router.post('/uploadImage', token, function (req, res, next) {
	upload(req, res, function (err) {
		if (err) {
			res.status(404).send("an Error occured")
			return
		}
		// No error occured.
		var sampleFile = req.files.photo;
		if (sampleFile.length == undefined) {
			sampleFile = [sampleFile]
		}
		var isdefault;
		sampleFile.forEach((element, index) => {

			element.mv(`uploads/${element.name}`, function (err) {
				if (err) {
					res.status(404).send("an Error occured")
					return

				}
				else {
				}
				productSellerModel.find({ '_id': req.query.id }, { 'imageFile': { $elemMatch: { 'name': element.name } } },
					function (err, result) {
						if (result[0].imageFile.length == 0) {
							productSellerModel.update({ '_id': req.query.id },
								{
									$push: {
										"imageFile": {
											name: element.name,
											path: `${serverUrl}/uploads/${element.name}`,
											isdefault: isdefault
										}
									}
								}, function (err, docs) {
									if (err) {
										res.status(404).send("err")
										return
									}
									if ((sampleFile.length - 1) == index) {
										res.status(200).send({ message: "success" })
									}
								})
						}
					})


			});
		})

	});
})
router.post('/setDefaultImage', token, function (req, res, next) {
	productSellerModel.find({ '_id': req.body._id }, { 'imageFile': 1 },
		function (err, doc) {
			if (err) {
				res.status(404).send(err);
			}
			var tempArray = []
			doc[0].imageFile.forEach((element, index) => {
				if (req.body.name == element.name) {
					element.isdefault = true;
				}
				else {
					element.isdefault = false;
				}

				tempArray.push(element);
				if (doc[0].imageFile.length - 1 == index) {
					productSellerModel.update({ '_id': req.body._id }, { $set: { 'imageFile': tempArray } },
						function (err, data) {
							if (err) {
								res.status(404).send(err);

							}
							res.status(200).send({ message: "success" })
						})
				}
			})

		})
})

router.post('/uploadDocument', token, function (req, res, next) {
	upload(req, res, function (err) {
		if (err) {
			// An error occurred when uploading
			res.status(404).send("an Error occured")
			return
		}
		var sampleFile = req.files.docs;
		if (sampleFile.length == undefined) {
			sampleFile = [sampleFile]
		}
		sampleFile.forEach((element, index) => {
			element.mv(`uploads/${element.name}`, function (err) {
				if (err) {
					res.status(404).send("an Error occured")
					return

				}

				productSellerModel.update({ '_id': req.query.id },
					{
						$push: {
							"document": {
								name: element.name,
								path: `${serverUrl}/uploads/${element.name}`,
							}
						}
					}, function (err, docs) {
						if (err) {
							res.status(404).send("err")
							return
						}
					})

			});
			if ((sampleFile.length - 1) == index) {
				res.status(200).send({ message: "success" })
			}
		})

	});
})

router.post('/getCategoryProductDetail', function (req, res) {
	productSellerModel.find({ 'txtProductCategory': req.body.categoryId }).populate([
		{
			path: 'productId',
			model: 'product',
			populate: {
				path: 'txtProductCategory',
				model: 'category'
			},
		},
		{
			path: 'traderId',
			model: 'trader',

		},
		{
			path: 'txtCurrency',
			model: 'currency',

		},
		{
			path: 'discountId',
			model: 'productDiscount',
			populate: {
				path: 'customerGroupId',
				model: 'customerGroup'
			},
		},
		{
			path: 'priceListId',
			model: 'priceList',
			populate: {
				path: 'customerGroup',
				model: 'customerGroup'
			},

		},

	]).sort({ '_id': -1 })
		.exec(function (err, doc) {
			if (err) {
				res.status(404).send({ message: "error" })
			}
			res.status(200).send(doc);
		})
})

//search products with id and sending complete data
router.post('/getSubCategoryProductDetail', (req, res) => {

	productSellerModel.find({ 'txtProductSubCategory': req.body.subcatId }).populate([
		{
			path: 'productId',
			model: 'product',
			populate: {
				path: 'txtProductCategory',
				model: 'category'
			},
		},
		{
			path: 'traderId',
			model: 'trader',

		},
		{
			path: 'txtCurrency',
			model: 'currency',

		},
		{
			path: 'discountId',
			model: 'productDiscount',
			populate: {
				path: 'customerGroupId',
				model: 'customerGroup'
			},
		},
		{
			path: 'priceListId',
			model: 'priceList',
			populate: {
				path: 'customerGroup',
				model: 'customerGroup'
			},

		},
	]).sort({ '_id': -1 })
		.exec(function (err, doc) {
			if (err) {
				res.status(404).send({ message: "error" })
			}
			res.status(200).send(doc);
		})

})

router.post('/search', (req, res) => {
	var searchString = String(req.body.searchTerm);
	if (searchString == undefined) {
		res.status(400).send('undefined message from the server');
	}
	var str = searchString.toLowerCase().replace(/\b[a-z]/g, function (letter) {
		return letter.toUpperCase();
	});
	var foundcatResults = [];
	var errMsg = [];
	var rex = new RegExp(searchString, 'i');
	var finalstr = '^' + str;
	// var rexforf = new RegExp(finalstr);

	productCategoryModel.find({ name: { $regex: finalstr } })
		.limit(4)
		.exec((err, doc) => {
			if (err) {
				errMsg.push(err);
			} else {
				foundcatResults = doc;
				productCategoryModel.find({ name: { $regex: rex } })
					.limit(4)
					.exec((err, rep) => {
						if (err) res.status(400).send('this is error ', err);
						else {
							foundcatResults.push(...rep);
						}
					})
			}
		})

	productSubCategoryModel.find({ name: { $regex: finalstr } })
		.limit(4)
		.populate([
			{
				path: 'categoryId',
				model: 'category'
			},
		])
		.exec((err, doc) => {
			if (err) {
				errMsg.push(err);
				count = false;
				res.status(400).send(errMsg);
			}
			else {
				foundcatResults.push(...doc);
				productSubCategoryModel.find({ name: { $regex: rex } })
					.limit(4)
					.populate([
						{
							path: 'categoryId',
							model: 'category'
						},
					])
					.exec((err, rep) => {
						if (err) res.status(400).send('this is error ', err);
						else {
							foundcatResults.push(...rep);
							res.status(200).send(foundcatResults);
						}
					})
			}
		})
})

router.post('/searchString', (req, res) => {

	var searchString = req.body.searchq;
	var regexStr = new RegExp(searchString, 'i');
	// productModel.aggregate( [
	// 	{$match:{ txtProductName: { $regex:regexStr}} },
	// 	{
	// 		$lookup: {
	// 		  from: 'productSeller',
	// 		  localField:'_id',
	// 		  foreignField: 'productId',
	// 		  as: 'productDetails'
	// 		},

	// 	},
	// ])

	productSellerModel.find({ txtProductName: { $regex: regexStr } })
		.populate([
			{
				path: 'txtCurrency',
				model: 'currency',
			},
			{
				path: 'traderId',
				model: 'trader',
			}
		])
		.exec((err, resp) => {
			if (err) {
				res.status(400).send('no product found')
			}
			else {
				// productDetails.populate(resp, {path: 'traderId',model: 'trader',})

				res.status(200).send(resp);
			}
		})

})


router.post('/categorySearch', (req, res) => {
	var categoryId = req.body.productId;
	productSubCategoryModel.find({ 'categoryId': categoryId }).limit(4)
		.exec((err, resp) => {
			if (err) {
				res.status(404).send(err);
			}

			res.status(200).send(resp);
		})

})

router.get('/getAll', token, function (req, res, next) {
	productSellerModel.find({ 'traderId': req.body.traderId }).populate([
		{
			path: 'productId',
			model: 'product',
			populate: {
				path: 'txtProductCategory',
				model: 'category'
			}
		},

	]).sort({ '_id': -1 })
		.exec(function (err, doc) {
			if (err) {
				res.status(404).send({ message: "error" })
				return;
			}
			res.status(200).send(doc)

		})

})

router.post('/getOne', token, function (req, res, next) {
	productSellerModel.find({ '_id': req.body._id }).populate([
		{
			path: 'productId',
			model: 'product',
			populate: {
				path: 'txtProductCategory',
				model: 'category'
			}
		},
		{
			path: 'productId',
			model: 'product',
			populate: {
				path: 'txtProductSubCategory',
				model: 'subCategory'
			}
		},

	]).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		res.status(200).send(doc)

	})
});
router.post('/getOneProduct', token, function (req, res, next) {
	productSellerModel.find({ 'productId': req.body.productId }).populate([
		{
			path: 'productId',
			model: 'product',
		},

	]).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		res.status(200).send(doc)

	})
});

router.post('/updateOne', token, function (req, res, next) {

	var userReq = req.body;
	var username;
	var userId = userReq.traderId;
	traderModel.findOne({ '_id': userId }, function (err, resp) {
		if (err) res.status(400).send('user not registered');
		else {
			username = resp.registration_name;
			updateProduct(userReq, username, function (status) {
				if (status) {
					res.status(200).send({ message: "success" })
				}
				else {
					res.status(404).send('Error')
				}
			});
		}
	})
})


router.post('/importProductViaDocument', token, function (req, res) {
	var csvArrdata;
	if (!req.files) {
		return res.status(400).send('No files were uploaded.');
	}
	const csvString = req.files.csv.data.toString();
	csv({
		noheader: true,
		output: "csv"
	})
		.fromString(csvString)
		.then((csvRow) => {
			var alldata = []
			var headers = csvRow.splice(0, 1);
			csvRow.forEach(resp => {
				var obj = {}
				for (let i = 0; i < resp.length; i++) {
					let key = headers[0][i].replace(/[^\w\s]/gi, '').trim().toLowerCase();
					obj[key] = resp[i];
				}
				alldata.push(obj);
			})
			return alldata;
		})

		.then(data => {

			//********** this is the array and mongo way
			var industryNameArr = [];
			var categoryNameArr = [];
			var subcategoryNameArr = [];
			var currencyArr = [];
			var loctionArr = [];
			const dataLen = data.length;

			const findIndustry = function (industryNameArr) {
				var promise = new Promise(function (resolve, reject) {
					industry.find({ 'name': industryNameArr }, function (err, result) {
						if (err => {
							reject(err)
						})
							result = industryNameArr.map(industry => result.find(d => d.name === industry));
						resolve(result)
					})
				})
				return promise;
			}

			const findCategory = function (categoryNameArr) {
				var promise1 = new Promise(function (resolve, reject) {
					productCategoryModel.find({ 'name': categoryNameArr }, function (err, result) {
						if (err) {
							reject(err);
						}
						result = categoryNameArr.map(category => result.find(d => d.name === category));
						resolve(result)
					})
				})
				return promise1;
			}

			const findSubcategory = function (subcategoryNameArr) {
				var promise2 = new Promise(function (resolve, reject) {
					productSubCategoryModel.find({ 'name': subcategoryNameArr }, function (err, result) {
						if (err) {
							reject(err);
						}
						result = subcategoryNameArr.map(subcategory => result.find(d => d.name === subcategory));
						resolve(result)
					})
				})
				return promise2;
			}

			const findCurrency = function (currencyArr) {
				let userCurrency = req.body.traderId;
				var promise3 = new Promise(function (resolve, reject) {
					currency.find({ 'traderId': userCurrency }, function (err, result) {
						if (err) {
							reject(err)
						}
						resolve(result[0])
					})
				})
				return promise3;
			}

			// categoryNameArr.push('some wrong entry');
			for (let i = 0; i < dataLen; i++) {
				if (data[i].industry !== '') industryNameArr.push(data[i].industry);
				else {
					res.status(400).json({
						message: 'industry name at row ' + (i + 1) + ' is empty',
					})
					break;
				}
				if (data[i].category !== '') categoryNameArr.push(data[i].category);
				else {
					res.status(400).json({
						message: 'category name at row ' + (i + 1) + ' is empty',
					})
					break;
				}

				if (data[i]['sub category'] !== '') subcategoryNameArr.push(data[i]['sub category']);
				else {
					res.status(400).json({
						message: 'sub category name at row ' + (i + 1) + ' is empty',
					})
					break;
				}

				if (i == dataLen - 1) {
					findIndustry(industryNameArr)
						.then(indResp => {
							let counter = false;
							var modifiedIndustriesData = data.map((item, index) => {
								if (indResp[index] !== undefined) {
									item.industry = indResp[index]._id;
									return item;
								} else {
									if (!counter) {
										// let 'inside else:',`category name "`+catresp[index].name+`" is under wrong industry at row `+(index+1));
										res.status(400).json({
											message: `Industry name "` + industryNameArr[index] + `" is not valid at row ` + (index + 1),
										})
										counter = true
									}
								}
							})
							return modifiedIndustriesData;
						})
						.then(modifiedIndustriesData => {
							findCategory(categoryNameArr)
								.then(catresp => {
									let counter = false;
									var modifiedCategoryData = modifiedIndustriesData.map((item, index) => {
										if (catresp[index] !== undefined) {
											if (String(item.industry) == String(catresp[index].industryId)) {
												item.category = catresp[index]._id;
												return item;
											} else {
												if (!counter) {
													// let 'inside else:',`category name "`+catresp[index].name+`" is under wrong industry at row `+(index+1));
													res.status(400).json({
														message: `category name "` + catresp[index].name + `" is under wrong industry at row ` + (index + 1),
													})
													counter = true
												}
											}
										} else {
											res.status(400).json({
												message: 'category ' + categoryNameArr[index] + ' at row ' + (index + 1) + ' is not valid',
											});
										}
									})
									return modifiedCategoryData;
								})
								.catch(err => {
									res.status(400).json({
										message: 'error occured',
										error: err
									});
								})
								.then(modifiedCategoryData => {
									findSubcategory(subcategoryNameArr)
										.then(subcatresp => {
											let counter = false;
											var modifiedSubcatData = modifiedCategoryData.map((item, index) => {
												if (subcatresp[index] !== undefined) {
													if (String(item.category) == String(subcatresp[index].categoryId)) {
														item['sub category'] = subcatresp[index]._id;
														return item;
													} else {
														if (!counter) {
															res.status(400).json({
																message: `subcategory Name "` + subcatresp[index].name + `" is under wrong category at row ` + (index + 1),
															})
															counter = true;
														}
													}
												} else {
													res.status(400).json({
														message: 'subcategory ' + subcategoryNameArr[index] + 'at row ' + (index + 1) + ' is not valid',
													});
												}
											})
											return modifiedSubcatData;
										})
										.then(modifiedSubcatData => {
											findCurrency()
												.then(respCurrency => {
													let modifiedCurrency = modifiedSubcatData.map(item => {
														item.currency = respCurrency._id;
														return item;
													});
													return modifiedCurrency;
												})
												.then(modifiedCurrency => {
													locationModel.find({ 'traderId': req.body.traderId }, (err, resp) => {
														if (err) {
															throw new Error({ message: "can not find the location for registered user set location First" });
														}
														let modifiedLocation = modifiedCurrency.map(item => {
															item['storage location  city'] = resp[0]._id;
															return item;
														})
														saveProductData(modifiedLocation)
													})
												})
										})
								})
						}).catch(err => {
							res.status(400).json({
								message: err,
							});
						})
				}
			}

			const saveProductData = function (modifiedLocation) {
				var productData = modifiedLocation.map(item => {
					let ProductObj = {};
					ProductObj.txtProductName = item['product name'];
					ProductObj.industry = item.industry;
					ProductObj.txtProductCategory = item.category;
					ProductObj.txtProductSubCategory = item['sub category'];
					return ProductObj;
				})
				productModel.insertMany(productData).then((docs) => {
					var docsData = docs;
					saveProductSellerData(modifiedLocation, docsData)
				}).catch((err) => {
					res.status(401).json({
						message: 'product not uploaded',
						error: err
					});
				})
			}

			const saveProductSellerData = function (data, prodData) {
				var prodSellerData = data.map((item, index) => {
					let ProductSellobj = {};
					ProductSellobj.productId = prodData[index]._id;
					ProductSellobj.txtProductName = item['product name'];
					ProductSellobj.industry = item.industry;
					ProductSellobj.traderId = req.query.traderId;
					ProductSellobj.traderName = null;
					ProductSellobj.txtProductCode = item['product code'];
					ProductSellobj.txtModelCode = item['model code'];
					ProductSellobj.txtPartNo = item['part number'];
					ProductSellobj.txtSerialNo = item['serial number'];
					ProductSellobj.txtBrand = item.brand;
					ProductSellobj.txtDescription = item['product description'];
					ProductSellobj.imageFile = [];
					ProductSellobj.txtPrice = item.price;
					ProductSellobj.txtCurrency = item.currency;
					ProductSellobj.txtQuantityPerUnitPrice = item['quantity per unit price'];
					ProductSellobj.txtStorageLocation = item['storage location  city'];//storage location
					ProductSellobj.txtSalesUnitOfMeasure = item['storage unit of measure'];
					ProductSellobj.txtStockOnHand = item['stock on hand'];
					ProductSellobj.txtStockAvailable = item['stock available'];
					ProductSellobj.txtStockReorderLevel = item['stock recorder level'];
					ProductSellobj.txtProductVideoUrl = item['product video url'];
					ProductSellobj.txtPriceRules = item['price rules'];
					ProductSellobj.txtSupplier = item['preferred suppliers'];
					ProductSellobj.txtMinimumOrderQuantity = item['minimum order quantity'];
					ProductSellobj.txtItemSize = item['item size'];
					ProductSellobj.txtItemColor = item['item color'];
					ProductSellobj.txtItemWeight = item['item weightapprox'];
					ProductSellobj.txtItemWarranty = item['item warranty'];
					ProductSellobj.txtStorageUnitOfMeasure = null;
					ProductSellobj.discountId = null;
					ProductSellobj.txtProductCategory = item.category;
					ProductSellobj.txtProductSubCategory = item['sub category'],
						ProductSellobj.document = null;
					ProductSellobj.approvalStatus = true;
					ProductSellobj.modificationStatus = 'notModified';
					ProductSellobj.txtQuantityChange = 0;
					ProductSellobj.txtReason = null;
					ProductSellobj.txtComments = null;
					ProductSellobj.txtAdjustedDate = null;
					return ProductSellobj;
				})

				productSellerModel.insertMany(prodSellerData).then((docs) => {
					res.status(200).send(docs);
				}).catch((err) => {
					res.status(401).send(err)
				})
			}

		})


		.catch(err => {


		})

});


router.get('/exportProduct', token, function (req, res) {
	var fields = [
		'txtProductCode', 'txtModelCode', 'txtPartNo', 'txtSerialNo',
		'txtProductName',
		'txtBrand',
		'txtPrice',
		'txtQuantityPerUnitPrice',
		'txtStorageLocation',
		'txtStockOnHand',
		'txtStockAvailable',
		'txtSupplier',
		'txtSalesUnitOfMeasure'
	]

	const json2csvParser = new Json2csvParser({ fields });
	productSellerModel.find({ 'traderId': req.body.traderId }, {
		txtProductCode: 1, txtModelCode: 1, txtPartNo: 1, txtSerialNo: 1,
		//txtProductName: 1,
		txtBrand: 1,
		txtPrice: 1,
		txtQuantityPerUnitPrice: 1,
		txtStorageLocation: 1,
		txtStockOnHand: 1,
		txtStockAvailable: 1,
		txtSupplier: 1,
		txtSalesUnitOfMeasure: 1
	}, function (err, data) {

		if (err) {
			res.status(404).send(err);
			return;
		}
		const csv = json2csvParser.parse(data);
		res.set("Content-Disposition", "attachment;filename=product.csv");
		res.set("Content-Type", "application/octet-stream");
		res.send(csv);
	})

})

function updateProduct(userReq, username, callback) {
	productSellerModel.update({ '_id': userReq._id._id }, {
		'$set': {
			productId: userReq.productId,
			traderId: userReq.traderId,
			traderName: username,
			txtProductCode: userReq.txtProductCode,
			txtModelCode: userReq.txtModelCode,
			txtPartNo: userReq.txtPartNo,
			txtSerialNo: userReq.txtSerialNo,
			txtBrand: userReq.txtBrand,
			txtItemSize: userReq.txtItemSize,
			txtItemColor: userReq.txtItemColor,
			txtItemWarranty: userReq.txtItemWarranty,
			txtItemWeight: userReq.txtItemWeight,
			txtStorageUnitOfMeasure: userReq.txtStorageUnitOfMeasure,
			txtPrice: userReq.txtPrice,
			txtCurrency: userReq.txtCurrency,
			txtProductCategory: userReq.categoryIdd,
			txtQuantityPerUnitPrice: userReq.txtQuantityPerUnitPrice,
			txtStorageLocation: userReq.txtStorageLocation,
			txtStockOnHand: userReq.txtStockOnHand,
			txtStockAvailable: userReq.txtStockAvailable,
			txtSupplier: userReq.txtSupplier,
			txtDescription: userReq.txtDescription,
			txtStockReorderLevel: userReq.txtStockReorderLevel,
			txtProductVideoUrl: userReq.txtProductVideoUrl,
			txtPriceRules: userReq.txtPriceRules,
			txtMinimumOrderQuantity: userReq.txtMinimumOrderQuantity,
			file: 0,
			modificationStatus: 'notModified',
			txtQuantityChange: userReq.txtQuantityChange,
			txtReason: userReq.txtReason,
			txtComments: userReq.txtComments,
			txtAdjustedDate: userReq.txtAdjustedDate,
		}
	}, function (err, doc) {
		if (err) {
			callback(false);
		}
		else {
			productModel.update({ '_id': userReq.productId }, {
				'$set': {
					txtProductName: userReq.txtProductName,
					industry: userReq.industry,
					txtProductCategory: userReq.categoryIdd,
					txtProductSubCategory: userReq.subCategoryIdd,
				}
			}, function (err, doc) {
				if (err) {
					callback(false);
					//return false;
				}
				else {
					callback(true);
				}
			})
		}

	})
}

function saveProduct(userReq, username, callback) {

	var entry = new productModel({
		txtProductName: userReq.txtProductName,
		industry: userReq.industry,
		txtProductCategory: userReq.txtProductCategory,
		txtProductSubCategory: userReq.txtProductSubCategory,
	})

	entry.save(function (err, doc) {
		if (err) {
			return res.status(404).send(err);
		}
		else {
			var productSellerEntry = new productSellerModel({
				productId: doc._id,
				txtProductName: userReq.txtProductName,
				industry: userReq.industry,
				txtProductCategory: userReq.txtProductCategory,
				txtProductSubCategory: userReq.txtProductSubCategory,
				traderId: userReq.traderId,
				traderName: username,
				txtProductCode: userReq.txtProductCode,
				txtModelCode: userReq.txtModelCode,
				txtPartNo: userReq.txtPartNo,
				txtSerialNo: userReq.txtSerialNo,
				txtBrand: userReq.txtBrand,
				txtSalesUnitOfMeasure: userReq.txtSalesUnitOfMeasure,
				txtItemSize: userReq.txtItemSize,
				txtItemColor: userReq.txtItemColor,
				txtItemWarranty: userReq.txtItemWarranty,
				txtItemWeight: userReq.txtItemWeight,
				txtStorageUnitOfMeasure: userReq.txtStorageUnitOfMeasure,
				txtPrice: userReq.txtPrice,
				txtCurrency: userReq.txtCurrency,
				txtProductCategory: userReq.txtProductCategory,
				txtProductSubCategory: userReq.txtProductSubCategory,
				txtProductName: userReq.txtProductName,
				txtQuantityPerUnitPrice: userReq.txtQuantityPerUnitPrice,
				txtStorageLocation: userReq.txtStorageLocation,
				txtStockOnHand: userReq.txtStockOnHand,
				txtStockAvailable: userReq.txtStockAvailable,
				txtSupplier: userReq.txtSupplier,
				txtDescription: userReq.txtDescription,
				txtStockReorderLevel: userReq.txtStockReorderLevel,
				txtProductVideoUrl: userReq.txtProductVideoUrl,
				txtPriceRules: userReq.txtPriceRules,
				txtMinimumOrderQuantity: userReq.txtMinimumOrderQuantity,
				imageFile: userReq.imageFile,
				document: userReq.document,
				file: 0,
				modificationStatus: 'notModified',
				txtQuantityChange: userReq.txtQuantityChange,
				txtReason: userReq.txtReason,
				txtComments: userReq.txtComments,
				txtAdjustedDate: userReq.txtAdjustedDate,
			})
			productSellerEntry.save(function (err, doc) {
				if (err) {
					res.status(404).send(err);
					return;
				}
				else {
					callback(doc._id);
				}
			})
		}
	})
	// 	}
	// })

}


router.post('/deleteImage', token, function (req, res) {
	productSellerModel.findOneAndUpdate(
		{ '_id': req.body.productId },
		{ $pull: { imageFile: { _id: mongoose.Types.ObjectId(req.body.fileId) } } },
		{ 'new': true },
		function (error, doc) {
			if (error) {
				res.status(400).send("error")
				return;
			}
			res.status(200).send({ message: "success" });
		});
})

router.post('/deleteDocuments', token, function (req, res) {
	productSellerModel.findOneAndUpdate(
		{ '_id': req.body.productId },
		{ $pull: { document: { _id: mongoose.Types.ObjectId(req.body.fileId) } } },
		{ 'new': true },
		function (error, doc) {
			if (error) {
				res.status(400).send("error")
				return;
			}
			res.status(200).send({ message: "success" });
		});
})

router.post('/changeApprovalStatus', token, function (req, res) {
	productSellerModel.update({ '_id': req.body._id }, { 'approvalStatus': true }, function (err, result) {
		err ? res.status(404).send(err) : res.status(200).send({ message: 'success' })
	})
})

router.post('/searchProduct', token, function (req, res) {
	let query = {
		'traderId': mongoose.Types.ObjectId(req.body.traderId)
	};

	if (req.body.txtModel != '' && req.body.txtModel != undefined && req.body.txtModel != null) query['txtModelCode'] = req.body.txtModel;
	if (req.body.txtPartNo != '' && req.body.txtPartNo != undefined && req.body.txtPartNo != null) query['txtPartNo'] = req.body.txtPartNo;
	if (req.body.txtSerialNo != '' && req.body.txtSerialNo != undefined && req.body.txtSerialNo != null) query['txtSerialNo'] = req.body.txtSerialNo;
	if (req.body.txtStorageLocation != '' && req.body.txtStorageLocation != null && req.body.txtStorageLocation != undefined) query['txtStorageLocation'] = req.body.txtStorageLocation;
	if (req.body.txtStorageLocation != 0 && req.body.txtMinPriceRange != 0)
		query.txtPrice = { $gte: req.body.txtMinPriceRange, $lte: req.body.txtMaxPriceRange }


	productSellerModel.find(query).populate([
		{
			path: 'productId',
			model: 'product',
			match: {
				txtProductName: req.body.txtProductName
			}
		},
		'txtStorageLocation'
	]).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
		}
		else {
			result = doc.filter(function (user) {
				return user.productId;
			});
			res.status(200).send(result);

		}
	})

})


router.get('/priceRange', token, function (req, res) {
	productSellerModel.aggregate([{ $match: { 'traderId': req.body.traderId } },
	{ $group: { '_id': '$traderId', 'maxAmount': { $max: "$txtPrice" }, 'minAmount': { $min: "$txtPrice" } } }],
		function (err, result) {
			if (err) res.status(404).send(err);
			res.status(200).send(result);
		})
})

router.post('/updateStock', token, function (req, res) {
	productSellerModel.update({ '_id': req.body._id }, {
		$set: {
			txtQuantityChange: req.body.txtQuantityChange,
			txtStorageUnitOfMeasure: req.body.txtStorageUnitOfMeasure,
			txtReason: req.body.txtReason,
			txtComments: req.body.txtComments,
			txtAdjustedDate: req.body.txtAdjustedDate,
			txtStockOnHand: req.body.txtStockOnHand,
			txtStockAvailable: req.body.txtStockAvailable,
		}
	}, function (err, result) {
		err ? res.status(404).send(err) : res.status(200).send({ message: "success" })
	})
})

router.post('/productListLocation', token, function (req, res) {
	productSellerModel.find({ 'txtStorageLocation': req.body.id }).populate([
		{
			path: 'productId',
			model: 'product',
		},
	]).exec(function (err, doc) {
		err ? res.status(404).send(err) : res.status(200).send(doc);
	})
})


router.post('/updateQuantity', token, function (req, res) {
	let userReq = req.body;
	productSellerModel.update({ '_id': userReq.id }, {
		'$set': {
			txtStockAvailable: userReq.updateQty,
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
