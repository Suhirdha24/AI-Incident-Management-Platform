"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metric = void 0;
const mongoose_1 = require("mongoose");
const metricSchema = new mongoose_1.Schema({
    serviceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    timestamp: { type: Date, required: true, index: true },
    errorRate: { type: Number, required: true },
    latencyMs: { type: Number, required: true },
    cpuPercent: { type: Number, required: true },
    memoryPercent: { type: Number, required: true },
    dbConnectionsPercent: { type: Number, required: true }
}, { timestamps: true });
exports.Metric = (0, mongoose_1.model)('Metric', metricSchema);
