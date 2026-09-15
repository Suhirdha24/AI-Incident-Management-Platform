"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentEvent = void 0;
const mongoose_1 = require("mongoose");
const incidentEventSchema = new mongoose_1.Schema({
    incidentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Incident', required: true, index: true },
    eventType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });
exports.IncidentEvent = (0, mongoose_1.model)('IncidentEvent', incidentEventSchema);
