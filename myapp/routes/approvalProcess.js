var express = require('express');
var router = express.Router();
var approvalModel = require('../models/approvalModel')
var token  = require('../middleware/token');
/* GET users listing. */
var multer = require('multer');
// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({dest: DIR}).single('photo');
var fs = require('fs');

router.post('/add',token,function(req,res,next){

    approvalModel.find({'traderId':req.body.traderId},function(err,result){
        if(err) {res.status(404).send(err);return;}
        result.length == 0 ? addNew(req,function(err,doc){
             err ? res.status(404).send(err) : res.status(200).send({message:"success"})
        }):updateExisting(req,function(err,doc){
             err ? res.status(404).send(err) : res.status(200).send({message:"success"})
        });
    })

})

router.get('/get',token,function(req,res,next){

    approvalModel.find({'traderId':req.body.traderId},function(err,result){
        err ? res.status(404).send(err) : res.status(200).send(result);
    })

})

router.get('/getProductApproval',token,function(req,res){
    
    approvalProduct(req,function(err,result){
        err?res.status(404).send(err):res.status(200).send(result)
    })

})
var addNew = function(req,cb){

    var entry = new approvalModel({
            txtProduct: req.body.txtProduct,
            txtPriceList: req.body.txtPriceList,
            txtDiscount: req.body.txtDiscount,
            txtCategorry: req.body.txtCategorry,
            traderId:req.body.traderId
        })
    entry.save(function(err,doc){
        err?cb(err):cb(null,doc)
    })

}

var updateExisting = function(req,cb){

    approvalModel.update({'traderId':req.body.traderId},{$set:{
        txtProduct: req.body.txtProduct,
        txtPriceList: req.body.txtPriceList,
        txtDiscount: req.body.txtDiscount,
        txtCategorry: req.body.txtCategorry,
    }},function(err,doc){
        err?cb(err):cb(null,doc)
    })
}
module.exports = {}
module.exports.router  = router;

