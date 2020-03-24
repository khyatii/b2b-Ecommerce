var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var invoiceLogistics = mongoose.Schema({

    orderNumber: { type: String, default: null },
    invoiceNumber: { type: String, default: null },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    issuePoId: { type: Schema.Types.ObjectId, ref: 'issuePo' },
    logisticsId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },
    serviceType: { type: String, default: null },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    status:{ type: String, default: null },

}, { collection: 'invoiceLogistics' })

module.exports = mongoose.model('invoiceLogistics', invoiceLogistics);