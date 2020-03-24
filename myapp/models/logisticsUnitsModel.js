var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var logisticsUnits = Schema({
    logistics_type: { type: String, default: null },
    unit: { type: String, default: null },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },

}, { collection: 'logisticsUnits' })

module.exports = mongoose.model('logisticsUnits', logisticsUnits);