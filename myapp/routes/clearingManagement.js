var logisticsModel = require('../models/logisticsPofileModel');
var clearingManagementModel = require('../models/clearingManagementModel');
var logisticcategoryModel = require('../models/logisticcategoryModel');
var express = require('express');
var router = express.Router();
var logisticsPofileModel = require('../models/logisticsPofileModel');
var token = require('../middleware/token');
var logisticToken = require('../middleware/logisticToken');
var nodemailer = require('nodemailer');
var transporter = require('../config/mailconfig');

/* GET users listing. */
  router.post('/addService', token, function (req, res, next) {
      clearingManagementModel.find({
          txtClearingId: req.body.txtClearingId, 'traderId': req.body.traderId
      }, function (err, doc) {
          if (doc.length != 0) {
              res.status(502).send("already Available")
          }
          else {
              var entry = new clearingManagementModel({
                  txtCountry: req.body.txtCountry,
                  txtCountryCode: req.body.txtCountryCode,
                  txtTown: req.body.txtTown,
                  txtClearingName: req.body.txtClearingName,
                  txtClearingId: req.body.txtClearingId,
                  serviceType: req.body.serviceType,
                  serviceName: req.body.serviceName,
                  txtPriority: req.body.txtPriority,
                  txtShareWarehouseDetails: req.body.txtShareWarehouseDetails,
                  txtShareTransportServiceDetails: req.body.txtShareTransportServiceDetails,
                  txtShareConsignmentDetails: req.body.txtShareConsignmentDetails,
                  traderId: req.body.traderId,
              })
              entry.save(function (err, doc) {
                  if (err) {
                      res.status(404).send(err)
                      return;
                  }
                  res.status(200).send(doc);
              })
          }
      })
  })
  router.get('/getAllClearingNames', function (req, res, next) {
      logisticsModel.aggregate([{
          $match: {
              $or:
                  [{ "logistics_type": "Clearing" }]
          }
      },
      { $project: { 'company_name': 1 } }]
          , function (err, doc) {
              if (err) {
                  res.status(404).send(err)
                  return;
              }
              res.status(200).send(doc);
          })
  });
  router.post('/getClearingCountry', token, (req, res) => {
      logisticsPofileModel.find({ "logistics_type": "Clearing", "country": req.body.warehousecountry }, function (err, doc) {
          if (err) {
              res.status(404).send(err);
              return;
          }

          res.status(200).send(doc)

      })
  });
  router.get('/getAllClearingManagement', token, function (req, res, next) {
      clearingManagementModel.find({ 'traderId': req.body.traderId }).sort({ "txtPriority": 1 }).exec(function (err, doc) {
          if (err) {
              res.status(404).send(err)
              return;
          }
          res.status(200).send(doc);
      })
  })
  router.post('/clearingService', token, function (req, res) {
      var seenNames = {}
      logisticcategoryModel.find({ 'logisticsId': req.body.ClearingType }, function (err, data) {
          if (err) {
              res.status(404).send(err);
              return;
          }
          else {
              var Logisticdata = data;
              array = Logisticdata.filter(function (currentObject) {
                  if (currentObject.ServiceCategory in seenNames) {
                      return false;
                  } else {
                      seenNames[currentObject.ServiceCategory] = true;
                      return true;
                  }
              });
              res.status(200).send(array)
          }
      })
  })
  router.post('/clearingServiceName', token, function (req, res) {
      logisticcategoryModel.find({ 'ServiceCategory': req.body.ClearingService, "logisticsId": req.body.logisticsId }, function (err, doc) {
          if (err) {
              return res.status(404).send(err);
          }
          else {
              res.status(200).send(doc);
          }
      })
  })
  router.post('/getOne', token, function (req, res, next) {
      clearingManagementModel.find({ '_id': req.body._id }, function (err, doc) {
          if (err) {
              res.status(404).send(err)
              return;
          }
          res.status(200).send(doc);
      })
  })
  router.post('/updateOne', function (req, res, next) {
      clearingManagementModel.update({ '_id': req.body._id }, {
          '$set': {
              txtCountry: req.body.txtCountry,
              txtCountryCode: req.body.txtCountryCode,
              txtTown: req.body.txtTown,
              txtClearingName: req.body.txtClearingName,
              txtClearingId: req.body.txtClearingId,
              serviceType: req.body.serviceType,
              serviceName: req.body.serviceName,
              txtPriority: req.body.txtPriority,
              txtShareWarehouseDetails: req.body.txtShareWarehouseDetails,
              txtShareConsignmentDetails: req.body.txtShareConsignmentDetails,
              txtShareTransportServiceDetails: req.body.txtShareTransportServiceDetails,
          }
      }, function (err, doc) {
          if (err) {
              res.status(404).send(err)
              return;
          }
          res.status(200).send(doc);
      })

  })
  router.post('/getLogicticsSupplier', token, function (req, res, next) {
      clearingManagementModel.find({ 'traderId': req.body.supplierId }).populate([
          {
              path: 'txtClearingId',
              model: 'logisticsUser'
          }
      ]).exec(function (err, doc) {
          if (err) {
              res.status(404).send(err)
              return;
          } else {
              res.status(200).send(doc);
          }

      })
  });

  router.get('/getClearnceRequest',logisticToken,(req,res)=>{
    let logisticId = req.body.logisticsId;
    clearingManagementModel.find({'txtClearingId':logisticId}).populate([
      {
        path:'traderId',
        model:'trader'
      }
    ]).exec()
    .then(resp=>{
        res.status(200).json({
          message:'transport request found',
          data:resp
        })
    })
    .catch(err=>{
      res.status(400).json({
        message:'error occured',
        data:err
      })
    })
  })

router.post('/clearingReqStatus',(req,res)=>{
  let actionReq = req.body.isAccepted;
  let ItemId = req.body.requestId;
  let traderId = req.body.trader;
  clearingManagementModel.update({'_id': req.body.requestId},
  {$set:{'statusLogistic': actionReq}}).exec()
  .then(resp=>{
    if(actionReq == 'rejected' || actionReq == 'accepted'){
        nodemailer.createTestAccount((err, account) => {
                               var mailIds = [traderId];
                               var mailOptions = {
                                   from: '"Nicoza " <rxzone@gmail.com>',
                                   to: mailIds,
                                   subject: 'warehouse request status changed',
                                   css: `a{text-decoration: none;},
                               button{    background: rgba(0, 0, 255, 0.78);
                               border: none;
                               padding: 10px;},
                               `,
                                   html: `<h3 style="color:blue;">warehouse Request ${actionReq}</h3
                                   <p>Your request for warehouse is changed to ${actionReq}. For more details
                                   visit <button href='#'>Nicoza</button>
                                   </p>
                                   `,
                                 }

                               transporter.sendMail(mailOptions, function (err, information) {
                                   if(err){
                                   }
                               })

                             })

                          }

        res.status(200).json({
            message:'updated',
            status:actionReq,
            data:resp
          })
      })
      .catch(err=>{
      res.status(400).json({
        message:'notUpdated',
        error:err
      })
    })
})

module.exports = router
