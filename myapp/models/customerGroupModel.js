var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var priceListSchema = mongoose.Schema({

    name:{type:String},
    member:[{
        CustomerId:{type: Schema.Types.ObjectId, ref: 'customer'}
    }],
    status:{type:String},
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },

},{collection:'customerGroup'})  

module.exports = mongoose.model('customerGroup',priceListSchema);