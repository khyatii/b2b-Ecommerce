var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var logisticTypes = Schema({
    logistics_type: { type: String, default: null },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },

}, { collection: 'logisticTypes' })

module.exports = mongoose.model('logisticTypes', logisticTypes);