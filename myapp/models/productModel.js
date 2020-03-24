var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var productSchema = mongoose.Schema({

   txtProductName : { type: String },
   industry : { type: Schema.Types.ObjectId, ref: 'industry' },
   txtProductCategory : { type: Schema.Types.ObjectId, ref: 'category' },
   txtProductSubCategory : { type: Schema.Types.ObjectId, ref: 'subCategory' },

},{collection:'product'})

module.exports = mongoose.model('product',productSchema);
