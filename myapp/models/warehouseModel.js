var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var warehouseSchema = mongoose.Schema({

    txtCountry: { type: String },
    txtCountryCode: { type: String },
    txtTown: { type: String },
    txtWarehouse: {type: Schema.Types.ObjectId, ref: 'logisticsUser'},
    txtWarehouseName: { type: String },
    serviceType:{ type: String },
    serviceName:{ type: String },
    txtPriority: { type: String },
    statusLogistic: {type:String, default:'pending' },
    txtShareTransportServiceDetails: { type: String },
    txtShareConsignmentDetails: { type: String },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
}, { collection: 'warehouse' })

module.exports = mongoose.model('warehouse', warehouseSchema);
