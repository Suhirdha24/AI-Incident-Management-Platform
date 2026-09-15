"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Incident = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@opsai/shared");
const incidentSchema = new mongoose_1.Schema({
    incidentId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    serviceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    environment: { type: String, default: 'Production' },
    severity: { type: String, enum: Object.values(shared_1.IncidentSeverity), required: true, index: true },
    status: { type: String, enum: Object.values(shared_1.IncidentStatus), default: shared_1.IncidentStatus.DETECTED, index: true },
    assignedEngineerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    resolvedAt: { type: Date },
    durationMinutes: { type: Number },
    impactSummary: { type: String },
    correlatedAlertIds: [{ type: String }],
    recentDeploymentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Deployment' },
    analysisStatus: { type: String, enum: ['NONE', 'PENDING', 'COMPLETED', 'FAILED'], default: 'NONE' },
    analysis: {
        probableCause: String,
        confidence: Number,
        confirmedEvidence: [String],
        hypotheses: [String],
        potentialImpact: String,
        recommendedInvestigation: [String],
        recommendedMitigation: [String]
    },
    resolution: {
        rootCause: String,
        resolutionSummary: String,
        actionsTaken: String,
        impact: String,
        resolvedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        resolvedAt: Date
    }
}, { timestamps: true });
exports.Incident = (0, mongoose_1.model)('Incident', incidentSchema);
