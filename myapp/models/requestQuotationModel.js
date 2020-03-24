var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var requestQuotationSchema = mongoose.Schema({

    RFQNumber: { type: String, default: null },
    productName: { type: String },
    orderQuantity: { type: Number },
    unitMeasure: { type: String },
    // currency : {type: Schema.Types.ObjectId, ref: 'currency' },
    deliveryLocation: { type: Schema.Types.ObjectId, ref: 'inventoryLocation' },
    invitationType: { type: String },
    status: { type: String },
    paymentTerms: { type: String },
    closingDate: { type: String },
    shipping: { type: String },
    supplierDetail: [{
        supplierId: { type: Schema.Types.ObjectId, ref: 'trader' },
        productId: { type: Schema.Types.ObjectId, ref: 'product' },
        txtPaymentModeWithDiscount: { type: String, default: null },
        txtTotalPrice: { type: Number, default: null },
        txtUnitPrice: { type: Number, default: null },
        txtNoOfItems: { type: Number, default: null },
        txtItemPerPackage: { type: Number, default: null },
        txtPackagingWeight: { type: String, default: null },
        txtPackaging: { type: String, default: null },
        txtShipping: { type: String, default: null },
        txtPaymentModeDiscount: { type: Number, default: null },
        txtEarlyPaymentTermDiscount: { type: String, default: null },
        txtDiscountForEarlyPayment: { type: Number, default: null },
        status: { type: String, default: 'pending' },
        createdAt: { type: Date, default: Date.now() },
        updatedAt: { type: Date, default: Date.now() }
    }],
    rfqStatus: { type: String, default: 'open' },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },

}, { collection: 'requestQuotation' })

module.exports = mongoose.model('requestQuotation', requestQuotationSchema);