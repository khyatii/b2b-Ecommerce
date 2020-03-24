var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var approvalSchema = mongoose.Schema({
    txtProduct: { type: Array,default: [] },
    txtPriceList: { type: Array,default: [] },
    txtDiscount: { type: Array,default: [] },
    txtCategorry: { type: Array,default: [] },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' }
},{collection:'approvalModel'})  

module.exports = mongoose.model('approvalModel',approvalSchema);