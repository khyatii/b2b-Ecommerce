var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var inventoryLocationModelSchema = mongoose.Schema({
    locationName: { type: String, default: '' },
    description: { type: String, default: '' },
    branch: { type: String },
    townName: { type: String },
    country: { type: String },
    countryCode: { type: String },
    geoLocation: { type: String },
    status: { type: String },
    ownershipType: { type: String, default: '' },
    size: { type: String },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
}, { collection: 'inventoryLocation' })

module.exports = mongoose.model('inventoryLocation', inventoryLocationModelSchema);