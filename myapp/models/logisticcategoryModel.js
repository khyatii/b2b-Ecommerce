var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var logisticcategoryModel = mongoose.Schema({
    logisticsId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },
    logisticsType: [{ type: String, require: true }],
    ServiceCategory: { type: String, require: true },
    ServiceName: { type: String, require: true },
    ServiceDescription: { type: String, require: true },
    Unit: { type: String, require: true },
    PricePerUnit: { type: Number, require: true },
    ServiceUrl: { type: String, default: null },
    PriceRules: { type: String, default: null },
}, { collection: 'logisticategory' });
module.exports = mongoose.model('logisticategory', logisticcategoryModel);