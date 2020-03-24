var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var crowdSourcing = mongoose.Schema({    
       
    productName : { type:String},
    orderQuantity : { type: Number },
    unitMeasure : { type: String },
    // currency : {type: Schema.Types.ObjectId, ref: 'currency' },
    deliveryLocation : {type: Schema.Types.ObjectId, ref: 'inventoryLocation' },
    invitationType : {  type: String},    
    paymentTerms : {  type: String},    
    closingDate:{type:String},
    shipping:{type:String},
    status:{ type: String, default:null},
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },

},{collection:'crowdSourcing'})  

module.exports = mongoose.model('crowdSourcing',crowdSourcing);