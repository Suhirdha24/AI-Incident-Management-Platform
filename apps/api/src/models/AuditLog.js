"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@opsai/shared");
const auditLogSchema = new mongoose_1.Schema({
    timestamp: { type: Date, default: Date.now, index: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    action: { type: String, enum: Object.values(shared_1.AuditAction), required: true, index: true },
    resourceType: { type: String, required: true },
    resourceId: { type: String, required: true, index: true },
    metadata: { type: mongoose_1.Schema.Types.Mixed }
}, { timestamps: true });
exports.AuditLog = (0, mongoose_1.model)('AuditLog', auditLogSchema);
