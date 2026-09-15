"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@opsai/shared");
const alertSchema = new mongoose_1.Schema({
    alertId: { type: String, required: true, unique: true, index: true },
    serviceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    serviceKey: { type: String, required: true },
    metric: { type: String, required: true },
    value: { type: Number, required: true },
    threshold: { type: Number, required: true },
    severity: { type: String, enum: Object.values(shared_1.AlertSeverity), required: true, index: true },
    status: { type: String, enum: Object.values(shared_1.AlertStatus), default: shared_1.AlertStatus.TRIGGERED, index: true },
    incidentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Incident', index: true },
    source: { type: String, default: 'Datadog' },
    environment: { type: String, default: 'Production' },
    timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });
exports.Alert = (0, mongoose_1.model)('Alert', alertSchema);
