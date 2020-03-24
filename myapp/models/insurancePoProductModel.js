var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var insurancePoProductDetails = mongoose.Schema({

    orderNumber: { type: String, default: null },
    insurancePoId: { type: Schema.Types.ObjectId, ref: 'insurancePo' },
    warehousePoId: { type: Schema.Types.ObjectId, ref: 'warehousePo' },
    issuePoId: { type: Schema.Types.ObjectId, ref: 'issuePo' },
    productId: { type: Schema.Types.ObjectId, ref: 'product' },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    txtTotalPrice: { type: Number, default: null },
    txtUnitPrice: { type: Number, default: null },
    txtNoOfItems: { type: Number, default: null },
    txtItemPerPackage: { type: Number, default: null },
    txtPackagingWeight: { type: String, default: null },
    txtPackaging: { type: String, default: null },
    txtShipping: { type: String, default: null },

    // txtPaymentModeWithDiscount:{type: String,default:null},
    // qunatityDelievered:{type: String,default:null},
    // txtPaymentModeDiscount:{type: Number,default:null},
    // txtEarlyPaymentTermDiscount:{type: String,default:null},
    // txtDiscountForEarlyPayment:{type: Number,default:null},
    // status:{type:String,default:'pending'},
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },

}, { collection: 'insurancePoProductDetails' })

module.exports = mongoose.model('insurancePoProductDetails', insurancePoProductDetails);