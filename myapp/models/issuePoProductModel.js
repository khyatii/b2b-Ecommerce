var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var issuePoProductDetails = mongoose.Schema({     
    
    orderNumber: { type: String, default: null },
    RFQNumber: { type: String, default: null },
    issuePoId: { type: Schema.Types.ObjectId, ref: 'issuePo' },
    productId:{type: Schema.Types.ObjectId, ref: 'product'},
    supplierId:{type: Schema.Types.ObjectId, ref: 'trader'}, 
    buyerId:{type: Schema.Types.ObjectId, ref: 'trader'},
    requestQuotationId:{type: Schema.Types.ObjectId, ref: 'requestQuotation'},
    requestQuotationSupplierId:{type: Schema.Types.ObjectId, ref: 'requestQuotationSupplier'},
    txtPaymentModeWithDiscount:{type: String,default:null},
    txtTotalPrice:{type:Number,default:null},
    txtUnitPrice:{type: Number,default:null},
    txtNoOfItems:{type: Number,default:null},
    txtItemPerPackage:{type: Number,default:null},
    txtPackagingWeight:{type: String,default:null},
    txtPackaging:{type: String,default:null},
    txtShipping:{type: String,default:null},
    qunatityDelievered:{type: String,default:null},
    txtPaymentModeDiscount:{type: Number,default:null},
    txtEarlyPaymentTermDiscount:{type: String,default:null},
    txtDiscountForEarlyPayment:{type: Number,default:null},
    status:{type:String,default:'pending'},
    createdAt:{type:Date,default:Date.now()},
    updatedAt:{type:Date,default:Date.now()}, 

},{collection:'issuePoProductDetails'})  

module.exports = mongoose.model('issuePoProductDetails', issuePoProductDetails);