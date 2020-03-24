var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var customerSchema = mongoose.Schema({
    
    txtBusinessName:{type:String},
    txtBuisnessEmail:{type:String},
    txtTraderType:{type:String},
    txtBuisnessPhone:{type:String},
    txtContactName:{type:String},
    txtContactEmail:{type:String},
    txtPostalAdress:{type:String},
    txtPhysicalAddress:{type:String},
    txtWebsite:{type:String},
    txtPhone:{type:String},
    active:{type:Boolean,default:false},
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    sellerId: { type: Schema.Types.ObjectId, ref: 'trader' },
    txtCustomerGroup:[{
        groupId:{type: Schema.Types.ObjectId, ref: 'customerGroup'}
    }],
    
},{collection:'customer'})  

module.exports = mongoose.model('customer',customerSchema);