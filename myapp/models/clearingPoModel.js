const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const clearingPo = mongoose.Schema({

    orderNumber: { type: String, default: null },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    issuePoId: { type: Schema.Types.ObjectId, ref: 'issuePo' },
    requestQuotationId: { type: Schema.Types.ObjectId, ref: 'requestQuotation' },
    status: { type: String, default: null },

    warehouseId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },
    transportId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },
    clearingId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },
    insuranceId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },

    warehouseServices: [{ type: String, default: null }],
    transportServices: [{ type: String, default: null }],
    clearingServices: [{ type: String, default: null }],
    insuranceServices: [{ type: String, default: null }],
    
    warehousePoId: { type: Schema.Types.ObjectId, ref: 'warehousePo' },
    transportPoId: { type: Schema.Types.ObjectId, ref: 'transportPo' },
    deliveryLocation: { type: Schema.Types.ObjectId, ref: 'locationModel' },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },

}, { collection: 'clearingPo' })

module.exports = mongoose.model('clearingPo', clearingPo);