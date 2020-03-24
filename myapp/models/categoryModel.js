var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var categorySchema = mongoose.Schema({

    name: { type: String },
    industryId: { type: Schema.Types.ObjectId, ref: 'industry' }

}, { collection: 'category', versionKey: false })

module.exports = mongoose.model('category', categorySchema);