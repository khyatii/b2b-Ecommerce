var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var insuranceManagement = mongoose.Schema({
    txtCountry: { type: String },
    txtCountryCode: { type: String },
    txtTown: { type: String },
    txtInsuranceAgentName: { type: String },
    txtPriority: { type: String },
    serviceType:{ type: String },
    serviceName:{ type: String },
    txtInsuranceAgent: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },
    txtShareWarehouseDetails: { type: String },
    txtShareConsignmentDetails: { type: String },
    txtShareTransportServiceDetails: { type: String },
    txtShareClearingAgentsDetails: { type: String },
    statusLogistic: {type:String, default:'pending' },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
}, { collection: 'insuranceManagement' })

module.exports = mongoose.model('insuranceManagement', insuranceManagement);
