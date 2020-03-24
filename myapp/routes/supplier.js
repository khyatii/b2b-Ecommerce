var express = require('express');
var router = express.Router();
var traderModel = require('../models/traderModel')
var sellerManagementModel = require('../models/sellerManagementModel')
var token = require('../middleware/token');

router.post('/add', token, function (req, res, next) {
    const {
        optSupplier,
        optProduct,
        traderId
    } = req.body;
    sellerManagementModel.findOne({ $and: [{ optSupplier }, { optProduct }, { traderId }] }, 'optSupplier', (err, foundProduct) => {
        if (foundProduct) return res.status(502).json({ message: 'Already exists' });
        else {
            var entry = new sellerManagementModel({
                optSupplier: req.body.optSupplier,
                optPriority: req.body.optPriority,
                radioShareStock: req.body.radioShareStock,
                radioReorder: req.body.radioReorder,
                radioMovementAlert: req.body.radioMovementAlert,
                optProduct: req.body.optProduct,
                txtOrderQuantity: req.body.txtOrderQuantity,
                txtReorderStock: req.body.txtReorderStock,
                optBranchName: req.body.optBranchName,
                optPurchaseUnit: req.body.optPurchaseUnit,
                txtstartDate: req.body.txtstartDate,
                txtEndDate: req.body.txtEndDate,
                optStorageLocation: req.body.optStorageLocation,
                txtItemSize: req.body.txtItemSize,
                txtItemWeight: req.body.txtItemWeight,
                traderId: req.body.traderId,
            })
            entry.save(function (err, doc) {
                if (err) {
                    res.status(404).send(err);
                    return;
                }
                res.status(200).send({ message: "success" });
            })
        }

    })
})

router.get('/getAll', token, function (req, res, next) {
    traderModel.aggregate([{
        $match: {
            // $or: [{ "trader_type": "Seller" }, { "trader_type": "Both" }]
            $or: [{ "trader_type": "Seller" }, { "trader_type": "Both" }], "_id": { $ne: req.body.traderId }
        }
    }, { $project: { "_id": 1, "company_name": 1 } }], function (err, result) {
        if (err) {
            res.status(404).send(err)
            return;
        }
        res.status(200).send(result);
    })
})
router.get('/getAllSupplier', token, function (req, res, next) {
    var seenNames = {};
    sellerManagementModel.find({ 'traderId': req.body.traderId }).populate([
        {
            path: 'optProduct',
            model: 'productSeller',
            populate: {
                path: 'productId',
                model: 'product',
            },
        },
        {
            path: 'optSupplier',
            model: 'trader',
        }
    ]).exec(function (err, result) {
        if (err) {
            res.status(404).send(err)
            return;
        }
        var data = result;
        array = data.filter(function (currentObject) {

            if (currentObject.optSupplier.company_name in seenNames) {
                return false;
            } else {
                seenNames[currentObject.optSupplier.company_name] = true;
                return true;
            }
        });
        res.status(200).send(data);
    });
});

router.post('/getSupplierDetail', token, function (req, res, next) {
    sellerManagementModel.find({ 'optSupplier': req.body.supplierId }).populate([{
        path: 'optProduct',
        model: 'productSeller',
        populate: {
            path: 'productId',
            model: 'product',
        },
    }, {
        path: 'optSupplier',
        model: 'trader',
    }
    ]).exec(function (err, result) {
        if (err) res.status(404).send(err)
        else res.status(200).send(result);
    });
});


router.post('/getOne', token, function (req, res, next) {
    sellerManagementModel.find({ '_id': req.body.supplierId }).populate([{
        path: 'optProduct',
        model: 'productSeller',
        populate: {
            path: 'productId',
            model: 'product',
        }
    }]).exec(function (err, doc) {
        if (err) {
            res.status(404).send(err);
            return;
        }
        res.status(200).send(doc);
    })
})

router.post('/updateOne', token, function (req, res, next) {
    const {
        optSupplier,
        optProduct
    } = req.body;
    sellerManagementModel.findOne({ $and: [{ optSupplier }, { optProduct }] }, 'optSupplier', (err, foundProduct) => {
        if (foundProduct) return res.status(502).json({ message: 'Already exists' });
        else {
            sellerManagementModel.updateMany({ '_id': req.body._id }, {
                '$set': {
                    optSupplier: req.body.optSupplier,
                    optPriority: req.body.optPriority,
                    radioShareStock: req.body.radioShareStock,
                    radioReorder: req.body.radioReorder,
                    radioMovementAlert: req.body.radioMovementAlert,
                    optProduct: req.body.productIdd,
                    txtOrderQuantity: req.body.txtOrderQuantity,
                    txtReorderStock: req.body.txtReorderStock,
                    optBranchName: req.body.optBranchName,
                    optPurchaseUnit: req.body.optPurchaseUnit,
                    txtstartDate: req.body.txtstartDate,
                    txtEndDate: req.body.txtEndDate,
                    optStorageLocation: req.body.optStorageLocation,
                    txtItemSize: req.body.txtItemSize,
                    txtItemWeight: req.body.txtItemWeight,
                    traderId: req.body.traderId,
                }
            }, function (err, doc) {
                if (err) {
                    res.status(404).send(err);
                }
                res.status(200).send({ message: "success" });
            })
        }
    })
})

module.exports = router;
