var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var productSeller = mongoose.Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'product' },
   traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
   traderName:{type:String},
   txtProductCode: { type: String, require: true },
   txtModelCode: { type: String, require: true },
   txtPartNo: { type: String, require: true },
   txtSerialNo: { type: String },
   txtBrand: { type: String },
   txtSalesUnitOfMeasure: { type: String, default: null },
   txtItemSize: { type: String },
   txtItemWeight: { type: String },
   txtItemColor: { type: String },
   txtItemWarranty: { type: String },
   txtStorageUnitOfMeasure: { type: String, default: null },
   txtPrice: { type: Number },
   txtCurrency: { type: Schema.Types.ObjectId, ref: 'currency' },
   discountId: { type: Schema.Types.ObjectId, ref: 'productDiscount', default: null },
   txtProductCategory: { type: Schema.Types.ObjectId, ref: 'category' },
   txtProductSubCategory:{type:Schema.Types.ObjectId, ref:'subCategory'},
   txtProductName:{type:String},
   txtQuantityPerUnitPrice: { type: Number },
   txtStorageLocation: { type: Schema.Types.ObjectId, ref: 'inventoryLocation' },
   txtStockOnHand: { type: Number },
   txtStockAvailable: { type: Number },
   txtSupplier: { type: String },
   txtDescription: { type: String },
   txtStockReorderLevel: { type: String },
   txtProductVideoUrl: { type: String },
   txtPriceRules: { type: String },
   txtMinimumOrderQuantity: { type: Number },
   txtProductName : { type: String },
   industry : { type: Schema.Types.ObjectId, ref: 'industry' },
   txtProductCategory : { type: Schema.Types.ObjectId, ref: 'category' },
   txtProductSubCategory : { type: Schema.Types.ObjectId, ref: 'subCategory' },
   imageFile: [{
       name: { type: String },
       path: { type: String },
       isdefault: { type: Boolean, default: false },
       createdAt: { type: Date, default: Date.now() },
       default:[]
   }],
   document:[{
       name:{type:String},
       path:{type:String},
       createdAt:{type:Date,default:Date.now()}
   }],
   approvalStatus:{type:Boolean,default:true},
   modificationStatus:{type:String,default:'notModified'},
   txtQuantityChange:{type:Number,default:0},
   txtReason:{type:String,default:null},
   txtComments:{type:String,default:null},
   txtAdjustedDate:{type:Date,default:null}
},{collection:'productSeller'})

module.exports = mongoose.model('productSeller',productSeller);
