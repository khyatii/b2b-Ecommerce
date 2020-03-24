var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var logisticWarehouseLocationModel = mongoose.Schema({
    logistics_type: { type: String, default: null },
    serviceType: { type: String, default: null },
    description: { type: String, default: null },
    branch: { type: String, default: null },
    townName: { type: String, default: null },
    country: { type: String, default: null },
    countryCode: { type: String, default: null },
    geoLocation: { type: String, default: null },
    status: { type: String, default: null },
    ownershipType: { type: String, default: null },

    capacity: { type: String, default: null },
    storageLocation: { type: String, default: null },
    packageType: { type: String, default: null },
    dimensions: { type: String, default: null },
    ratePerUnit: { type: String, default: null },

    destinationsTransport: { type: String, default: null },
    destinationsClearing: { type: String, default: null },

    transportServices: { type: String, default: null },
    clearingServices: { type: String, default: null },

    townsCovered: { type: String, default: null },
    insuranceServices: { type: String, default: null },

    logisticsId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },
    logisticsType: { type: String, default: null },

}, { collection: 'logisticWarehouseLocation' })

module.exports = mongoose.model('logisticWarehouseLocation', logisticWarehouseLocationModel);