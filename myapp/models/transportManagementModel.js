
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var transportManagemntSchema = mongoose.Schema({
    txtCountry: { type: String },
    txtCountryCode: { type: String },
    txtTown: { type: String  },
    txtTransporter: {type: Schema.Types.ObjectId, ref: 'logisticsUser'},
    txtTransporterName: {type: String},
    serviceType:{ type: String },
    serviceName:{ type: String },
    txtPriority : { type: Number },
    txtShareTransportServiceDetails: { type: String },
    statusLogistic: {type:String, default:'pending' },
    txtShareWarehouseServiceDetails: { type: String },
    txtShareConsignmentDetails: { type: String},
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
},{collection:'transportManagemnt'})

module.exports = mongoose.model('transportManagemnt',transportManagemntSchema);
