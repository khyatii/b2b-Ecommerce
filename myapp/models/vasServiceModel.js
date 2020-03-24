var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var priceListSchema = mongoose.Schema({

    servicePLan:{type:String},
    location:{type:String},
    price:{type:String},

},{collection:'vasService'})  

module.exports = mongoose.model('vasService',priceListSchema);