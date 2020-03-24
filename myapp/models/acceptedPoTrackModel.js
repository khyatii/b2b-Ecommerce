var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var acceptedPoTracking = mongoose.Schema({

    orderNumber: { type: String, default: null },
    supplierId: { type: Schema.Types.ObjectId, ref: 'trader' },
    buyerId: { type: Schema.Types.ObjectId, ref: 'trader' },
    issuePOId: { type: Schema.Types.ObjectId, ref: 'issuePo' },
    // warehousePoId: { type: Schema.Types.ObjectId, ref: 'warehousePo' },
    // requestQuotationId: { type: Schema.Types.ObjectId, ref: 'requestQuotation' },
    orderPlaced: { type: String, default: null },
    orderPacked: { type: String, default: null },
    orderShipped: { type: String, default: null },
    orderDelivered: { type: String, default: null },
    // supplierPoStatus: { type: String, default: null },
    // buyerPoStatus: { type: String, default: null },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },

}, { collection: 'acceptedPoTracking' })

module.exports = mongoose.model('acceptedPoTracking', acceptedPoTracking);