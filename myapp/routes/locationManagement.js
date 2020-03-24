var logisticsModel = require('../models/logisticsPofileModel');
var clearingManagementModel = require('../models/clearingManagementModel');
var locationModel = require('../models/locationModel');
var express = require('express');
var router = express.Router();
const constants = require('../config/url');
var clientUrl=constants.clientUrl;
var token  = require('../middleware/token');
/* GET users listing. */
router.post('/addLocation',token,function(req,res,next){
    var entry = new locationModel({
        label:req.body.label,
        street1:req.body.street1,
        street2:req.body.street2,
        suburb:req.body.suburb,
        city:req.body.city,
        state:req.body.state,
        postal_code:req.body.postal_code,
        txtCountry:req.body.txtCountry,
        hold_stock:req.body.hold_stock,
        default:req.body.default,
        traderId:req.body.traderId
    })
    entry.save(function(err,doc){
        if(err){
            res.status(404).send(err)
            return;
        }
        res.status(200).send(doc);
    })
})

router.post('/addLocationInvite',token,function(req,res,next){
    var entry = new locationModel({
        label:req.body.label,
        street1:req.body.street1,
        street2:req.body.street2,
        suburb:req.body.suburb,
        city:req.body.city,
        state:req.body.state,
        postal_code:req.body.postal_code,
        txtCountry:req.body.txtCountry,
        hold_stock:req.body.hold_stock,
        default:req.body.default,
        traderId:req.body.id
    })
    entry.save(function(err,doc){
        if(err){
            res.status(404).send(err)
            return;
        }
        res.status(200).send(doc);
    })
})
router.get('/getAllLocation',token,function(req,res,next){
    locationModel.find({'traderId':req.body.traderId}).exec(function(err,doc){
        if(err){
            res.status(404).send(err)
            return;
        }
        res.status(200).send(doc);
    })
})

router.post('/getOne',token,function(req,res,next){
    locationModel.find({'_id':req.body._id},function(err,doc){
        if(err){
            res.status(404).send(err)
            return;
        }
        res.status(200).send(doc);
    })
})


router.post('/updateOne',function(req,res,next){
    locationModel.update({'_id':req.body._id},{'$set': {
        label:req.body.label,
        street1:req.body.street1,
        street2:req.body.street2,
        suburb:req.body.suburb,
        city:req.body.city,
        state:req.body.state,
        postal_code:req.body.postal_code,
        txtCountry:req.body.txtCountry,
        hold_stock:req.body.hold_stock,
        }},function(err,doc){
        if(err){
            res.status(404).send(err)
            return;
        }
        res.status(200).send(doc);
    })
})

module.exports = router