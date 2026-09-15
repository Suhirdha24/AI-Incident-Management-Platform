"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Postmortem = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@opsai/shared");
const postmortemSchema = new mongoose_1.Schema({
    incidentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Incident', required: true, unique: true, index: true },
    title: { type: String, required: true },
    authorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(shared_1.PostmortemStatus), default: shared_1.PostmortemStatus.DRAFT },
    aiGenerated: { type: Boolean, default: true },
    content: {
        title: String,
        incidentOverview: String,
        impactSummary: String,
        timelineSummary: [String],
        rootCauseAnalysis: String,
        contributingFactors: [String],
        detectionDetails: String,
        resolutionDetails: String,
        correctiveActions: [String],
        preventiveActions: [String]
    }
}, { timestamps: true });
exports.Postmortem = (0, mongoose_1.model)('Postmortem', postmortemSchema);
