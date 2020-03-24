const mongoose = require('mongoose');
const contactSupplierSchema = new mongoose.Schema({
    name: { type: String, lowercase: true, required: [true, "can't be blank"], index: true },
    email: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    phone: { type: String },
    callingCode: { type: String },
    city: { type: String },
    query: { type: String },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'trader' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    created_at: { type: String }
})

module.exports = mongoose.model('ContactSupplier', contactSupplierSchema, 'contact_supplier');