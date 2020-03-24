var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var invoicePaymentSupplier = mongoose.Schema({

    invoiceNumber: { type: String, default: null },
    orderNumber: { type: String, default: null },
    invoiceId:{type: Schema.Types.ObjectId, ref: 'invoice'},
    returnPoId:{type: Schema.Types.ObjectId, ref: 'returnPo'},
    buyerId:{type: Schema.Types.ObjectId, ref: 'trader'},
    supplierId:{type: Schema.Types.ObjectId, ref: 'trader'},
    requestQuotationId:{type: Schema.Types.ObjectId, ref: 'requestQuotation'},
    paymentTerms:{type: String,default:null},
    totalAmount:{type:String,default:null},
    paidAmount:{type: String,default:null},
    dueAmount:{type: String,default:null},
    paymentDate:{type: String,default:null},
    refrenceNo:{type: String,default:null},
    status:{type: String,default:null},
    createdAt:{type:Date,default:Date.now()},
    updatedAt:{type:Date,default:Date.now()},

},{collection:'invoicePaymentSupplier'})

module.exports = mongoose.model('invoicePaymentSupplier', invoicePaymentSupplier);