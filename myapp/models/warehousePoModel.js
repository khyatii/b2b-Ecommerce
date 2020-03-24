const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const warehousePo = mongoose.Schema({

    orderNumber: { type: String, default: null },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    buyerId: { type: Schema.Types.ObjectId, ref: 'trader' },
    issuePoId: { type: Schema.Types.ObjectId, ref: 'issuePo' },
    status: { type: String, default: null },

    warehouseId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },
    transportId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },
    clearingId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },
    insuranceId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },

    warehouseServices: [{ type: String, default: null }],
    transportServices: [{ type: String, default: null }],
    clearingServices: [{ type: String, default: null }],
    insuranceServices: [{ type: String, default: null }],

    requestQuotationId: { type: Schema.Types.ObjectId, ref: 'requestQuotation' },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    logisticsId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },

}, { collection: 'warehousePo' })

module.exports = mongoose.model('warehousePo', warehousePo);