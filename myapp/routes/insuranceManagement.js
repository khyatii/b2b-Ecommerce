var logisticsModel = require('../models/logisticsPofileModel');
var insuranceManagementModel = require('../models/insuranceManagementModel');
var logisticcategoryModel = require('../models/logisticcategoryModel')
var express = require('express');
var router = express.Router();
var logisticsPofileModel = require('../models/logisticsPofileModel');
var token = require('../middleware/token');
var logisticToken = require('../middleware/logisticToken');
var nodemailer = require('nodemailer');
var transporter = require('../config/mailconfig.js');



/* GET users listing. */
router.post('/addServices', token, function (req, res, next) {
    insuranceManagementModel.find({
        txtInsuranceAgent: req.body.txtInsuranceAgent, 'traderId': req.body.traderId
    }, function (err, doc) {
        if (doc.length != 0) {
            res.status(502).send("already Available")
        }
        else {
            var entry = new insuranceManagementModel({
                txtCountry: req.body.txtCountry,
                txtCountryCode: req.body.txtCountryCode,
                txtTown: req.body.txtTown,
                txtInsuranceAgent: req.body.txtInsuranceAgent,
                txtInsuranceAgentName: req.body.txtInsuranceAgentName,
                serviceType: req.body.serviceType,
                serviceName: req.body.serviceName,
                txtPriority: req.body.txtPriority,
                txtShareWarehouseDetails: req.body.txtShareWarehouseDetails,
                txtShareTransportServiceDetails: req.body.txtShareTransportServiceDetails,
                txtShareClearingAgentsDetails: req.body.txtShareClearingAgentsDetails,
                txtShareConsignmentDetails: req.body.txtShareConsignmentDetails,
                traderId: req.body.traderId,
            })
            entry.save(function (err, doc) {
                if (err) {
                    res.status(404).send(err);
                } else {
                    res.status(200).send(doc);
                }
            })
        }
    })
})
router.get('/getAllInsuranceAgentsNames', token, function (req, res, next) {
    logisticsModel.aggregate([{
        $match:
        {
            $or: [{ "logistics_type": "Insurance" }]
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
router.post('/getInsuranceCountry', token, (req, res) => {
    logisticsPofileModel.find({ "logistics_type": "Insurance",
     "country": req.body.warehousecountry }, function (err, doc) {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).send(doc);
    })
});
router.post('/insuranceService', token, function (req, res) {
    var seenNames = {}
    logisticcategoryModel.find({ 'logisticsId': req.body.InsuranceType }, function (err, data) {
        if (err) {
            res.status(404).send(err);
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
router.post('/insuranceServiceName', token, function (req, res) {
    logisticcategoryModel.find({ 'ServiceCategory': req.body.Insurance, "logisticsId": req.body.logisticsId }, function (err, doc) {
        if (err) {
            return res.status(404).send(err);
        }
        else {
            res.status(200).send(doc);
        }
    })
})

router.get('/getAllInsuranceManagement', token, function (req, res, next) {
    insuranceManagementModel.find({ 'traderId': req.body.traderId }).sort({ "txtPriority": 1 }).exec(function (err, doc) {
        if (err) {
            res.status(404).send(err)
        }
        res.status(200).send(doc);
    })
})
router.post('/getLogicticsSupplier', token, function (req, res, next) {
    insuranceManagementModel.find({ 'traderId': req.body.supplierId }).populate([
        {
            path: 'txtInsuranceAgent',
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
})
router.post('/getOneInsurance', token, function (req, res, next) {
    insuranceManagementModel.find({ '_id': req.body._id }, function (err, doc) {
        if (err) {
            res.status(404).send(err)
            return;
        }
        res.status(200).send(doc);
    })
})
router.post('/updateOne', token, function (req, res, next) {
    // insuranceManagementModel.find({
    //     txtInsuranceAgent: req.body.txtInsuranceAgent, 'traderId': req.body.traderId
    // }, function (err, doc) {
    //     if (doc.length != 0) {
    //         res.status(502).send("already Available")
    //     }
    //     else {
    insuranceManagementModel.update({ '_id': req.body._id }, {
        '$set': {
            txtCountry: req.body.txtCountry,
            txtCountryCode: req.body.txtCountryCode,
            txtTown: req.body.txtTown,
            txtInsuranceAgent: req.body.txtInsuranceAgent,
            txtInsuranceAgentName: req.body.txtInsuranceAgentName,
            txtPriority: req.body.txtPriority,
            serviceType: req.body.serviceType,
            serviceName: req.body.serviceName,
            txtShareWarehouseDetails: req.body.txtShareWarehouseDetails,
            txtShareTransportServiceDetails: req.body.txtShareTransportServiceDetails,
            txtShareClearingAgentsDetails: req.body.txtShareClearingAgentsDetails,
            txtShareConsignmentDetails: req.body.txtShareConsignmentDetails,
        }
    }, function (err, doc) {
        if (err) {
            res.status(404).send(err)
            return;
        }
        res.status(200).send(doc);
    })
    //     }
    // })
});


router.get('/getInsuranceRequest',logisticToken,(req,res)=>{
  let logisticId = req.body.logisticsId;
  insuranceManagementModel.find({'txtInsuranceAgent':logisticId}).populate([
    {
      path:'traderId',
      model:'trader'
    }
  ]).exec()
  .then(resp=>{
      res.status(200).json({
        message:'Insurance request found',
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

router.post('/InsuranceReqStatus',(req,res)=>{
    let actionReq = req.body.isAccepted;
    let ItemId = req.body.requestId;
    let traderId = req.body.trader;
    insuranceManagementModel.update({'_id': req.body.requestId},
    {$set:{'statusLogistic': actionReq}}).exec()
    .then(resp =>{
      if(actionReq == 'rejected' || actionReq == 'accepted'){
        nodemailer.createTestAccount((err, account) => {
                               var mailIds = [traderId];
                               var mailOptions = {
                                   from: '"Nicoza " <rxzone@gmail.com>',
                                   to: mailIds,
                                   subject: 'Insurance request status changed',
                                   css: `a{text-decoration: none;},
                               button{    background: rgba(0, 0, 255, 0.78);
                               border: none;
                               padding: 10px;},
                               `,
                                   html: `<h3 style="color:blue;">Insurance Request</h3
                                   <p>Your request for insurance is changed to ${actionReq}. For more details
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

module.exports = router;
