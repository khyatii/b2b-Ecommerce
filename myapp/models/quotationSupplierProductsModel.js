var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var quotationSupplierProducts = mongoose.Schema({

    RFQNumber: { type: String, default: null },
    productId: { type: Schema.Types.ObjectId, ref: 'product' },
    supplierId: { type: Schema.Types.ObjectId, ref: 'trader' },
    buyerId: { type: Schema.Types.ObjectId, ref: 'trader' },
    requestQuotationId: { type: Schema.Types.ObjectId, ref: 'requestQuotation' },
    requestQuotationSupplierId: { type: Schema.Types.ObjectId, ref: 'requestQuotationSupplier' },
    txtPaymentModeWithDiscount: { type: String, default: null },
    txtTotalPrice: { type: Number, default: null },
    txtUnitPrice: { type: Number, default: null },
    txtNoOfItems: { type: Number, default: null },
    txtCurrency: { type: Schema.Types.ObjectId, ref: 'currency' },
    txtItemPerPackage: { type: Number, default: null },
    txtPackagingWeight: { type: String, default: null },
    txtPackaging: { type: String, default: null },
    shipping: { type: String, default: null },
    txtPaymentModeDiscount: { type: Number, default: null },
    txtEarlyPaymentTermDiscount: { type: String, default: null },
    txtDiscountForEarlyPayment: { type: Number, default: null },
    status: { type: String, default: 'pending' },
    statusIssuePo: { type: String, default: 'pending' },
    rejectReasonPo: { type: String, default: null },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },

}, { collection: 'quotationSupplierProducts' })

module.exports = mongoose.model('quotationSupplierProducts', quotationSupplierProducts);