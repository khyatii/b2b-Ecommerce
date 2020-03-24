var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var subCategorySchema = mongoose.Schema({
    
    status: { type: String },
    vasServiceId: { type: Schema.Types.ObjectId, ref: 'vasService' },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    
},{collection:'vasServiceSubscribe'})  

module.exports = mongoose.model('vasServiceSubscribe',subCategorySchema);