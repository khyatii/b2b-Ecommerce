var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var invoiceLogisticsDetails = mongoose.Schema({

    orderNumber: { type: String, default: null },
    invoiceNumber: { type: String, default: null },
    traderId:{type: Schema.Types.ObjectId, ref: 'trader'},
    issuePoId:{type: Schema.Types.ObjectId, ref: 'issuePo'},
    invoiceLogisticsId:{type: Schema.Types.ObjectId, ref: 'invoiceLogistics'},
    logisticsId: { type: Schema.Types.ObjectId, ref: 'logisticsUser' },
    
    serviceType:{ type: String, default: null },
    serviceName:[{ type: String, default: null }],
    units:{ type: String, default: null },
    pricePerUnits:{ type: String, default: null },
    serviceDescription:{ type: String, default: null },
    ServiceUrl: { type: String, default: null },
    PriceRules: { type: String, default: null },

    createdAt:{type:Date,default:Date.now()},
    updatedAt:{type:Date,default:Date.now()},

},{collection:'invoiceLogisticsDetails'})

module.exports = mongoose.model('invoiceLogisticsDetails', invoiceLogisticsDetails);