var express = require('express');
var router = express.Router(); 
var templateModel = require('../models/templateModel')
var defaultTemplateModel = require('../models/defaultTemplateModel')
// var generalConfugurationModel = require('../models/generalConfugurationModel')
const nodemailer = require('nodemailer');
const transporter = require('../config/mailconfig');
var token  = require('../middleware/token');
/* GET users listing. */
router.post('/save',token, function(req, res, next) {
    var entry=new templateModel({
        txtTemplateText:req.body.txtTemplateText,
        traderId:req.body.traderId,
        txtTemplateName:req.body.txtTemplateName,
        txtSubject:req.body.txtSubject,
    })

    entry.save(function(err,doc){
        if(err){
            res.status(404).send(err);
        }
        res.status(200).send({message:"success"});
    });
})

router.get('/getAll',token,function(req,res,next){
      
    templateModel.find({$or: [ { 'traderId': req.body.traderId }, { 'traderId': undefined } ]},function(err,doc){
       
    if(err){
        res.status(404).send(err);
        return;
    }
        res.status(200).send(doc)

    })
})

router.post('/getOne',function(req,res,next){
    templateModel.find({'_id':req.body._id},function(err,doc){
    if(err){
        res.status(404).send(err);
        return;
    }
        res.status(200).send(doc)

    })
})

router.post('/getDefaultTemplate',function(req,res,next){
    if(req.body._id == '') {
        defaultTemplateModel.find({},function(err,doc){
            if(err){
                res.status(404).send(err);
                return;
            }
                res.status(200).send(doc)
        
            })
    }
    else{
        defaultTemplateModel.find({'_id':req.body._id},function(err,doc){
            if(err){
                res.status(404).send(err);
                return;
            }
                res.status(200).send(doc)
        
            })
    }
    
})

router.post('/update',function(req,res,next){
    templateModel.update({'_id':req.body._id},{'$set': {
        txtTemplateText:req.body.txtTemplateText,
        traderId:req.body.traderId,
        txtTemplateName:req.body.txtTemplateName,
        txtSubject:req.body.txtSubject,
       }},function(err,doc){
           if(err){
               res.status(404).send(err);
               return;
           }
           res.status(200).send({message:"success"})
       })
})

module.exports = router;
