var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var invoice = mongoose.Schema({

    invoiceNumber: { type: String, default: null },
    orderNumber: { type: String, default: null },
    supplierId: { type: Schema.Types.ObjectId, ref: 'trader' },
    buyerId: { type: Schema.Types.ObjectId, ref: 'trader' },
    issuePOId: { type: Schema.Types.ObjectId, ref: 'issuePo' },
    requestQuotationId: { type: Schema.Types.ObjectId, ref: 'requestQuotation' },
    requestQuotationSupplierId: { type: Schema.Types.ObjectId, ref: 'requestQuotationSupplier' },
    txtWarehouse: { type: Schema.Types.ObjectId, ref: 'warehouse', default: null },
    txtTransportation: { type: Schema.Types.ObjectId, ref: 'transportManagemnt', default: null },
    txtFrightRate: { type: String, default: null },
    txtClearing: { type: Schema.Types.ObjectId, ref: 'clearingManagemnt', default: null },
    txtInsurance: { type: Schema.Types.ObjectId, ref: 'insuranceManagement', default: null },
    txtWarehouseType: { type: String, default: null },
    txtWarehouseService: [{ type: String, default: null }],
    TransportType: { type: String, default: null },
    TransportName: [{ type: String, default: null }],
    txtClearingType: { type: String, default: null },
    txtClearingName: [{ type: String, default: null }],
    txtInsuranceType: { type: String, default: null },
    txtInsuranceName: [{ type: String, default: null }],
    supplierPoStatus: { type: String, default: null },
    buyerPoStatus: { type: String, default: null },
    shipping: { type: String, default: null },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },

}, { collection: 'invoice' })

module.exports = mongoose.model('invoice', invoice);
