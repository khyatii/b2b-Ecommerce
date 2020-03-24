var mongoose = require('mongoose')
var Schema = mongoose.Schema;
const serviceSchema = new Schema({
    testNo: String,
});
var logisticsUserSchema = mongoose.Schema({
    company_name: { type: String },
    registration_name: { type: String },
    country_name: { type: String },
    country: { type: String },
    role: { type: String },
    password: { type: String },
    website: { type: String },
    trader_type: { type: String },
    email: { type: String, require: true, unique: true },
    logistics_type: [{ type: String }],
    service: [{ type: String }],
    type: [{ type: String }],
    logistics_type_multiple: { type: Boolean },
    phone_number: { type: String },
    phone_number_code: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    verifyUserToken: { type: String },
    status: { type: Boolean },
}, { collection: 'logisticsUser' })

module.exports = mongoose.model('logisticsUser', logisticsUserSchema);
