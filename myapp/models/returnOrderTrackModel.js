var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var returnOrderTracking = mongoose.Schema({

    supplierId: { type: Schema.Types.ObjectId, ref: 'trader' },
    buyerId: { type: Schema.Types.ObjectId, ref: 'trader' },
    issuePoId: { type: Schema.Types.ObjectId, ref: 'issuePo' },
    returnPoId: { type: Schema.Types.ObjectId, ref: 'returnPo' },
    requestQuotationId: { type: Schema.Types.ObjectId, ref: 'requestQuotation' },
    requestQuotationSupplierId: { type: Schema.Types.ObjectId, ref: 'requestQuotationSupplier' },
    orderPacked: { type: String, default: null },
    orderShipped: { type: String, default: null },
    orderDelivered: { type: String, default: null },
    orderReceived: { type: String, default: null },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },

}, { collection: 'returnOrderTracking' })

module.exports = mongoose.model('returnOrderTracking', returnOrderTracking);