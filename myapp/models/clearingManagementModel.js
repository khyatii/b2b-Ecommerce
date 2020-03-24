
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var clearingManagemntSchema = mongoose.Schema({
    txtCountry: { type: String },
    txtCountryCode: { type: String },
    txtTown: { type: String  },
    txtClearingName: {type: String},
    txtClearingId: {type: Schema.Types.ObjectId, ref: 'logisticsUser'},
    txtPriority : { type: Number },
    serviceType:{ type: String },
    serviceName:{ type: String },
    txtShareWarehouseDetails: { type: String },
    statusLogistic: {type:String, default:'pending' },
    txtShareConsignmentDetails: { type: String},
    txtShareTransportServiceDetails: { type: String},
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
},{collection:'clearingManagemnt'})

module.exports = mongoose.model('clearingManagemnt',clearingManagemntSchema);
