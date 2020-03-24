var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var traderSchema = mongoose.Schema({
    company_name: { type: String },
    registration_name: { type: String },
    role: { type: String },
    country_name: { type: String },
    // country_code: { type: String },
    website: { type: String },
    trader_type: { type: String },
    email: { type: String, require: true, unique: true },
    phone_number: { type: String },
    shippingStatus: { type: String },
    register_type: { type: String },
}, { collection: 'trader' })

module.exports = mongoose.model('trader', traderSchema);