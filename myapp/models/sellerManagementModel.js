var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var SellerManagementSchema = mongoose.Schema({   
        optSupplier: { type: Schema.Types.ObjectId, ref: 'trader' },
        optPriority: { type: String  },
        radioShareStock: { type: String  },
        radioReorder : { type: String },
        radioMovementAlert:{type:String},
        optProduct: { type: Schema.Types.ObjectId, ref: 'product' },
        txtOrderQuantity: { type: String  },
        txtReorderStock: { type: String  },
        optBranchName : { type: String },
        optPurchaseUnit:{type:String},
        txtstartDate: { type: Date },
        txtEndDate: { type: Date  },
        optStorageLocation: { type: String  },
        txtItemSize : { type: String },
        txtItemWeight:{type:String},
        traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
},{collection:'sellerManagement'})  

module.exports = mongoose.model('sellerManagement',SellerManagementSchema);