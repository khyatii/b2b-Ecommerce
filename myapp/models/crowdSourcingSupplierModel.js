var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var crowdSourcingSupplier = mongoose.Schema({     
        
    supplierId:{type: Schema.Types.ObjectId, ref: 'trader'},
    buyerId:{type: Schema.Types.ObjectId, ref: 'trader'},
    productId:{type: Schema.Types.ObjectId, ref: 'product'},
    locationId:{type: Schema.Types.ObjectId, ref: 'inventoryLocation'},
    crowdSourcingId:{type: Schema.Types.ObjectId, ref: 'crowdSourcing'},
    txtPaymentModeWithDiscount:{type: String,default:null},
    txtTotalPrice:{type:Number,default:null},
    txtUnitPrice:{type: Number,default:null},
    txtNoOfItems:{type: Number,default:null},
    txtItemPerPackage:{type: Number,default:null},
    txtPackagingWeight:{type: String,default:null},
    txtPackaging:{type: String,default:null},
    shipping:{type: String,default:null},
    txtPaymentModeDiscount:{type: Number,default:null},
    txtEarlyPaymentTermDiscount:{type: String,default:null},
    txtDiscountForEarlyPayment:{type: Number,default:null},
    status:{type:String,default:'pending'},
    createdAt:{type:Date,default:Date.now()},
    updatedAt:{type:Date,default:Date.now()}, 
    userId: { type: Schema.Types.ObjectId, ref: 'user' },

},{collection:'crowdSourcingSupplier'})  

module.exports = mongoose.model('crowdSourcingSupplier', crowdSourcingSupplier);