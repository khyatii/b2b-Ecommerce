var express = require('express');
var router = express.Router();
var productModel = require('../models/productModel')
var customerGroupModel = require('../models/customerGroupModel')
var productDiscountModel = require('../models/productDiscountModel')
var token  = require('../middleware/token');
/* GET users listing. */
var multer = require('multer');
// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({dest: DIR}).single('photo');
var fs = require('fs');

router.post('/addMember',token,function(req,res,next){

    
    //var categoryId = req.body.categoryId;
    productModel.find({'traderId':req.body.traderId},function(err,doc){
        if(err){
            res.status(404).send({message:"error"})
            return;
        }
        res.status(200).send(doc)

    })
})



module.exports = router;
