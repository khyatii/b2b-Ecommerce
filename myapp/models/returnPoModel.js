var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var returnPo = mongoose.Schema({

    orderNumber: { type: String, default: null },
    invoiceNumber: { type: String, default: null },
    supplierId: { type: Schema.Types.ObjectId, ref: 'trader' },
    buyerId: { type: Schema.Types.ObjectId, ref: 'trader' },
    issuePoId: { type: Schema.Types.ObjectId, ref: 'issuePo' },
    requestQuotationId: { type: Schema.Types.ObjectId, ref: 'requestQuotation' },
    requestQuotationSupplierId: { type: Schema.Types.ObjectId, ref: 'requestQuotationSupplier' },
    warehouseProvider: { type: String, default: null },
    transportProvider: { type: String, default: null },
    freightRate: { type: String, default: null },
    clearingForwardingAgent: { type: String, default: null },
    insuranceAgent: { type: String, default: null },
    supplierPoStatus: { type: String, default: null },
    buyerPoStatus: { type: String, default: null },

    supplierReturnStatus: { type: String, default: null },
    paymentStatus: { type: String, default: null },

    txtComment: { type: String, default: null },
    txtCreditNote: { type: String, default: null },
    txtReasonForReturn: { type: String, default: null },

    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },

}, { collection: 'returnPo' })

module.exports = mongoose.model('returnPo', returnPo);