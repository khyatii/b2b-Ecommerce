const express = require('express'),
  router = express.Router(),
  generalConfugurationModel = require('../models/generalModel'),
  traderModel = require('../models/traderModel'),
  logisticsPofileModel = require('../models/logisticsPofileModel'),
  currencyModel = require('../models/currencyModel'),
  pricelistModel = require('../models/pricelistModel'),
  productSellerModel = require('../models/productSellerModel'),
  token = require('../middleware/token'),
  logisticToken = require('../middleware/logisticToken');

/* GET users listing. */

router.post('/general', token, function (req, res, next) {
  var entry = new generalConfugurationModel({
    tax_label: req.body.tax_label,
    tax_number_label: req.body.tax_number_label,
    tax_number: req.body.tax_number,
    warn_on_shipping: req.body.warn_on_shipping,
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

router.post('/addCurrency', token, function (req, res, next) {
  req.body.default = req.body.default || false;
  var entry = new currencyModel({
    currency_name: req.body.currency_name,
    iso3: req.body.iso3,
    symbol: req.body.symbol,
    txtExchangeRate: req.body.txtExchangeRate,
    traderId: req.body.traderId,
    default: req.body.default
  })
  entry.save(function (err, doc) {
    if (err) {
      res.status(404).send(err);
      return;
    }
    res.status(200).send({ message: "success" })
  })
})

router.post('/currencyInvite', token, function (req, res, next) {
  req.body.default = req.body.default || false;
  var entry = new currencyModel({
    currency_name: req.body.currency_name,
    iso3: req.body.iso3,
    symbol: req.body.symbol,
    txtExchangeRate: req.body.txtExchangeRate,
    traderId: req.body.id,
    default: req.body.default
  })
  entry.save(function (err, doc) {
    if (err) {
      res.status(404).send(err);
      return;
    }
    res.status(200).send({ message: "success" })

  })
})

router.get('/currency', token, function (req, res, next) {
  currencyModel.find({ $or: [{ 'traderId': req.body.traderId }, { 'traderId': undefined }] }, function (err, doc) {
    if (err) {
      res.status(404).send(err);
      return
    }
    res.status(200).send(doc)
  })

})

router.post('/getOneCurrency', token, function (req, res, next) {
  currencyModel.find({ '_id': req.body._id }, function (err, doc) {
    if (err) {
      res.status(404).send(err);
      return
    }
    res.status(200).send(doc)
  })

})

router.post('/updateCurrency', token, function (req, res, next) {
  currencyModel.update({ '_id': req.body._id }, {
    '$set': {
      currency_name: req.body.currency_name,
      iso3: req.body.iso3,
      symbol: req.body.symbol,
    }
  }, function (err, doc) {
    if (err) {
      res.status(404).send(err);
      return;
    }
    res.status(200).send({ message: "success" })
  })
})

router.post('/addPriceList', token, function (req, res, next) {
  const {
    product,
    customerGroup,
    end_date
  } = req.body;
  pricelistModel.findOne({ $and: [{ product }, { customerGroup }] }, 'product', (err, foundProduct) => {
    if (foundProduct) return res.status(400).json({ message: 'This Product already exists' });
    else {
      var entry = new pricelistModel({
        product: req.body.product,
        customerGroup: req.body.customerGroup,
        price: req.body.price,
        currency: req.body.currency,
        quantity_per_unit: req.body.quantity_per_unit,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        traderId: req.body.traderId
      })
      entry.save(function (err, doc) {
        if (err) {
          res.status(404).send(err);
          return;
        }
        else {
          productSellerModel.findOne({ 'productId': product }, function (err, discount) {
            if (!discount) {
              return res.status(401).send({ message: "not found" })
            }
            discount.priceListId = doc._id;
            discount.save(function (err) {
              return res.status(200).send(discount)
            });
          });
        }
      })
    }
  })
})

router.get('/getAllPriceList', token, function (req, res, next) {
  pricelistModel.find({ 'traderId': req.body.traderId }).populate([
    {
      path: 'customerGroup',
      model: 'customerGroup',
    },
    {
      path: 'currency',
      model: 'currency',
    },
    {
      path: 'product',
      model: 'product',
    },
  ]).exec(function (err, doc) {
    if (err) {
      res.status(404).send(err);
      return;
    }
    res.status(200).send(doc);
  })
})

router.post('/getOnePriceList', token, function (req, res, next) {
  pricelistModel.find({ '_id': req.body._id }, function (err, doc) {
    if (err) {
      res.status(404).send(err);
      return;
    }
    res.status(200).send(doc);
  })
})

router.post('/modyifyPriceList', token, function (req, res, next) {
  pricelistModel.update({ '_id': req.body._id }, {
    '$set': {
      product: req.body.product,
      customerGroup: req.body.customerGroup,
      price: req.body.price,
      currency: req.body.currency,
      quantity_per_unit: req.body.quantity_per_unit,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    }
  }, function (err, doc) {
    if (err) {
      res.status(404).send(err);
      return;
    }
    res.status(200).send({ message: "success" })
  })
})
/** Company Details for a Trader */
router.get('/getCompanyDetails', token, function (req, res, next) {
  traderModel.find({ '_id': req.body.traderId }, function (err, doc) {
    if (err) return res.status(404).send(err);
    else res.status(200).send(doc);
  })
})
router.post('/saveCompanyDetails', token, function (req, res, next) {
  traderModel.updateMany({ 'email': req.body.traderEmail }, {
    '$set': {
      company_name: req.body.txtCompanyName,
      role: req.body.role,
      country_name: req.body.txtCountry,
      website: req.body.txtWebsite,
      email: req.body.traderEmail,
      phone_number: req.body.txtMobile,
    }
  }, function (err, doc) {
    if (err) {
      res.status(404).send(err)
    }
    else {
      res.status(200).send({ message: "success" })
    }
  });
})

/** Company Details for a Logistics Service Provider */
router.get('/getCompanyDetailsLogistics', logisticToken, function (req, res, next) {
  logisticsPofileModel.find({ '_id': req.body.logisticsId }, function (err, doc) {
    if (err) return res.status(404).send(err);
    else res.status(200).send(doc);
  })
})
router.post('/saveCompanyDetailsLogistics', logisticToken, function (req, res, next) {
  logisticsPofileModel.updateMany({ 'email': req.body.logisticsEmail }, {
    '$set': {
      company_name: req.body.txtCompanyName,
      role: req.body.role,
      country_name: req.body.txtCountry,
      website: req.body.txtWebsite,
      email: req.body.logisticsEmail,
      phone_number: req.body.txtMobile,
    }
  }, function (err, doc) {
    if (err) {
      res.status(404).send(err)
    }
    else {
      res.status(200).send({ message: "success" })
    }
  });
})

module.exports = router;
