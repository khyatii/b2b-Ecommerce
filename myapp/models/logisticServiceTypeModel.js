var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var logisticServiceType = Schema({
    logistics_type: { type: String, default: null },
    service_type: { type: String, default: null },
    service_name: { type: String, default: null },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },

}, { collection: 'logisticServiceType' })

module.exports = mongoose.model('logisticServiceType', logisticServiceType);