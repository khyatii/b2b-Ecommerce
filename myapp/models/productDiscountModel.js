var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var priceListSchema = mongoose.Schema({
    
    productId:{ type: Schema.Types.ObjectId, ref: 'product' },
    customerGroupId:{type: Schema.Types.ObjectId, ref: 'customerGroup'},
    discount:{type:String},
    minimumOrder:{type:String},
    start_date:{type:String},
    end_date:{type:String},
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    
},{collection:'productDiscount'})  

module.exports = mongoose.model('productDiscount',priceListSchema);