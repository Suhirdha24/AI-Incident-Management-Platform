"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentComment = void 0;
const mongoose_1 = require("mongoose");
const incidentCommentSchema = new mongoose_1.Schema({
    incidentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Incident', required: true, index: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    isNote: { type: Boolean, default: false }
}, { timestamps: true });
exports.IncidentComment = (0, mongoose_1.model)('IncidentComment', incidentCommentSchema);
