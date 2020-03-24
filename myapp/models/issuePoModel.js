const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const issuePo = mongoose.Schema({
    
    orderNumber: { type: String, default: null },
    RFQNumber: { type: String, default: null },
    supplierId: { type: Schema.Types.ObjectId, ref: 'trader' },
    buyerId: { type: Schema.Types.ObjectId, ref: 'trader' },
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

    // location: { type: Schema.Types.ObjectId, ref: 'inventoryLocation' },
    deliveryDate: { type: Date },
    comments: { type: String },

    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },

}, { collection: 'issuePo' })

module.exports = mongoose.model('issuePo', issuePo);