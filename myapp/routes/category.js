var express = require('express');
var router = express.Router();
var productSubCategoryModel = require('../models/subCategoryModel')
var productindustryModel = require('../models/industryModel')
var productCategoryModel = require('../models/categoryModel')
var token = require('../middleware/token');
var cacheMiddleware=require('../middleware/cache')
/* GET users listing. */
var multer = require('multer');
// set the directory for the uploads to the uploaded to
var DIR = './uploads/';

router.get('/getAllCategory', cacheMiddleware(10000), function (req, res) {
	productCategoryModel.find({}).populate([
		{
			path: 'industryId',
			model: 'industry',
		},
	]).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
		}
		else {
			res.status(200).send(doc)
		}
	})
})

router.post('/getCategories', function (req, res) {
	productCategoryModel.find({ 'industryId': req.body.industryId }).exec(function (err, doc) {
		if (err) {
			res.status(404).send(err);
			return;
		}
		res.status(200).send(doc);
	})
})

router.post('/getSubCategories', token, function (req, res) {
	productSubCategoryModel.find({ 'categoryId': req.body.categoryId }).exec(function (err, doc) {
		if (err) {
			res.status(404).send(err);
			return;
		}
		res.status(200).send(doc);
	})
})

router.post('/getOneCategoryList', function (req, res) {
	productCategoryModel.find({ '_id': req.body._id }).populate([
		{
			path: 'industryId',
			model: 'industry'
		}
	]).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		} else {
			res.status(200).send(doc)
		}
	})
})


router.post('/getOneSubCategoryList', function (req, res, next) {
	productSubCategoryModel.find({ '_id': req.body._id }).populate([
		{
			path: 'categoryId',
			model: 'category',
		},
		{
			path: 'industryId',
			model: 'industry'
		}
	]).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		} else {
			res.status(200).send(doc)
		}
	})
})

router.post('/addCategoryList', token, function (req, res, next) {
	var category = req.body.category.trim();
	productCategoryModel.find({ "industryId": req.body.industry, "name": category }, function (err, doc) {
		if (doc.length != 0) {
			res.status(502).send("already Available")
		}
		else {
			var categoryEntry = new productCategoryModel({
				name: category,
				industryId: req.body.industry
			});
			categoryEntry.save(function (err, catRes) {
				if (err) {
					res.status(404).send(err);
					return;
				}
				else {
					res.status(200).send({ message: "Success" })
				}
			})
		}
	})
})

router.post('/addSubCategoryList', token, function (req, res, next) {
	var subcategory = req.body.subcategory.trim();
	productSubCategoryModel.find({ "industryId": req.body.industry, "categoryId": req.body.category, "name": subcategory }, function (err, doc) {
		if (doc.length != 0) {
			res.status(502).send("already Available")
		}
		else {
			var subcategoryEntry = new productSubCategoryModel({
				name: subcategory,
				industryId: req.body.industry,
				categoryId: req.body.category,
			});
			subcategoryEntry.save(function (err, catRes) {
				if (err) {
					res.status(404).send(err);
					return;
				}
				else {
					res.status(200).send({ message: "Success" })
				}
			})
		}
	})
})

router.post('/updateSubCategory', token, function (req, res, next) {
	var subcategory = req.body.subcategory.trim();
	productSubCategoryModel.find({ "industryId": req.body.industryIdd, "categoryId": req.body.categoryIdd, "name": subcategory }, function (err, doc) {
		if (doc.length != 0) {
			res.status(502).send("already Available")
		}
		else {
			productSubCategoryModel.update({ '_id': req.body._id }, {
				'$set': {
					industryId: req.body.industryIdd,
					categoryId: req.body.categoryIdd,
					name: subcategory,
				}
			}, function (err, doc) {
				if (err) {
					res.status(404).send(err);
				}
				else {
					res.status(200).send({ message: "success" })
				}
			})
		}
	})
})

router.get('/getAllSubCategory',cacheMiddleware(100), function (req, res, next) {
	productSubCategoryModel.find({}).populate([
		{
			path: 'categoryId',
			model: 'category',
			populate: {
				path: 'industryId',
				model: 'industry'
			}
		}
	]).exec(function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		} else {
			res.status(200).send(doc)
		}
	})
})
router.post('/updateCategory', token, function (req, res, next) {
	var category = req.body.category.trim();
	productCategoryModel.find({ "industryId": req.body.industryIdd, "name": category }, function (err, doc) {
		if (doc.length != 0) {
			res.status(502).send("already Available")
		}
		else {
			productCategoryModel.update({ '_id': req.body._id }, {
				'$set': {
					name: category,
					industryId: req.body.industryIdd,
					traderId: req.body.traderId,
				}
			}, function (err, doc) {
				if (err) {
					res.status(404).send(err)
					return;
				}
				else {
					res.status(200).send({ message: "success" })
				}
			})
		}
	})
});
router.post('/addindustry', token, function (req, res) {
	var industry = req.body.industry.trim();
	productindustryModel.find({ 'name': industry }, function (err, doc) {
		if (doc.length != 0) {
			res.status(502).send("already Available")
		} else {
			var industry = new productindustryModel({
				name: industry,
			})
			industry.save(function (err, doc) {
				if (err) {
					res.status(401).send("something went to wrong")
				} else {
					res.status(200).send({ message: 'industry add Successfully' })
				}
			})
		}
	})
})
router.get('/getindustry', cacheMiddleware(100),function (req, res) {
	productindustryModel.find({}, function (err, industry) {
		if (err) {
			res.status(401).send("someing went wrong");
		} else {
			res.status(200).send(industry)
		}
	})
});
router.post('/updateindustry', token, function (req, res) {
	var industry = req.body.industry.trim();
	productindustryModel.find({ 'name': industry }, function (err, doc) {
		if (doc.length != 0) {
			res.status(502).send("already Available")
		} else {
			productindustryModel.update({ '_id': req.body._id }, {
				'$set': {
					name: industry,
				}
			}, function (err, doc) {
				if (err) {
					res.status(404).send("something went to wrong");
				} else {
					res.status(200).send({ message: "Successfully Update Industry" })
				}
			})
		}
	})
})

router.post('/getOneIndustry', function (req, res) {
	productindustryModel.find({ '_id': req.body._id }, function (err, doc) {
		if (err) {
			res.status(404).send({ message: "error" })
			return;
		}
		else {
			res.status(200).send(doc)
		}
	})
})

router.post('/deleteindustry', token, function (req, res) {
	productindustryModel.deleteOne({ '_id': req.body.id }, function (err, industry) {
		if (err) {
			res.status(404).send("something went wrong");
		} else {
			productCategoryModel.deleteMany({ 'industryId': req.body.id }, function (err, cat) {
				if (err) {
					res.status(404).send("something went wrong");
				} else {
					productSubCategoryModel.deleteMany({ 'industryId': req.body.id }, function (err, subCat) {
						if (err) {
							res.status(404).send("something went wrong");
						} else {
							res.status(200).send(industry)
						}
					})
				}
			})
		}
	})
})
router.post('/deleteCategory', token, function (req, res) {
	productCategoryModel.deleteOne({ '_id': req.body.id }, function (err, cat) {
		if (err) {
			res.status(404).send("something went wrong");
		} else {
			productSubCategoryModel.deleteMany({ 'categoryId': req.body.id }, function (err, subCat) {
				if (err) {
					res.status(404).send("something went wrong");
				} else {
					res.status(200).send(cat)
				}
			})
		}
	})
})
router.post('/deleteSubCategory', token, function (req, res) {
	productSubCategoryModel.deleteOne({ '_id': req.body.id }, function (err, subCat) {
		if (err) {
			res.status(404).send("something went wrong");
		} else {
			res.status(200).send(subCat)
		}
	})
})


module.exports = router;
