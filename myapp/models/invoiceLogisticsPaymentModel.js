var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var invoiceLogisticsPayment = mongoose.Schema({

    orderNumber: { type: String, default: null },
    invoiceNumber: { type: String, default: null },
    invoiceLogisticsId: { type: Schema.Types.ObjectId, ref: 'invoiceLogistics' },
    issuePoId: { type: Schema.Types.ObjectId, ref: 'issuePo' },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    logisticsId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },
    paymentTerms: { type: String, default: null },
    totalAmount: { type: String, default: null },
    paidAmount: { type: String, default: null },
    dueAmount: { type: String, default: null },
    paymentDate: { type: String, default: null },
    refrenceNo: { type: String, default: null },
    status: { type: String, default: null },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },

}, { collection: 'invoiceLogisticsPayment' })

module.exports = mongoose.model('invoiceLogisticsPayment', invoiceLogisticsPayment);
