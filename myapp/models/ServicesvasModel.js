var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ServicesvasSchema = mongoose.Schema({
    name: { type:String },
    customerCategory: { type:String },
    billingCycle: { type:String },
    paymentTerms: { type:String },
    vasType: { type:String },
    Fee: { type:String },
    description: { type:String },
   serviceCat: { type:Object },
},{collection:'vasPlans'})  

module.exports = mongoose.model('vasPlans',ServicesvasSchema);