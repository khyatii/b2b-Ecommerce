var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var priceListSchema = mongoose.Schema({
    
    product:{type:String, ref: 'product'},
    customerGroup:{type: Schema.Types.ObjectId, ref: 'customerGroup'},
    price:{type:String},
    currency:{type:String, ref: 'currency'},
    quantity_per_unit:{type:String},
    start_date:{type:Date},
    end_date:{type:Date},
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
},{collection:'priceList'})  

module.exports = mongoose.model('priceList',priceListSchema);