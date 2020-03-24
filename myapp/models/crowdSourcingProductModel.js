var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var crowdSourcingProducts = mongoose.Schema({

    productId: { type: Schema.Types.ObjectId, ref: 'product' },
    supplierId: { type: Schema.Types.ObjectId, ref: 'trader' },
    buyerId: { type: Schema.Types.ObjectId, ref: 'trader' },
    crowdSourcingId: { type: Schema.Types.ObjectId, ref: 'crowdSourcing' },
    crowdSourcingSupplierId: { type: Schema.Types.ObjectId, ref: 'crowdSourcingSupplier' },
    txtPaymentModeWithDiscount: { type: String, default: null },
    txtTotalPrice: { type: Number, default: null },
    txtUnitPrice: { type: Number, default: null },
    txtNoOfItems: { type: Number, default: null },
    txtItemPerPackage: { type: Number, default: null },
    txtPackagingWeight: { type: String, default: null },
    txtPackaging: { type: String, default: null },
    txtCurrency: { type: Schema.Types.ObjectId, ref: 'currency' },
    shipping: { type: String, default: null },
    txtPaymentModeDiscount: { type: Number, default: null },
    txtEarlyPaymentTermDiscount: { type: String, default: null },
    txtDiscountForEarlyPayment: { type: Number, default: null },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },

}, { collection: 'crowdSourcingProducts' })

module.exports = mongoose.model('crowdSourcingProducts', crowdSourcingProducts);