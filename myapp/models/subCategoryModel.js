var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var subCategorySchema = mongoose.Schema({
    
    name: { type: String },
    industryId: { type: Schema.Types.ObjectId, ref: 'industry' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'category' },
    
},{collection:'subCategory'})  

module.exports = mongoose.model('subCategory',subCategorySchema);