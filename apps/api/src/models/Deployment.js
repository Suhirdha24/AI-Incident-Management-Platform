"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deployment = void 0;
const mongoose_1 = require("mongoose");
const deploymentSchema = new mongoose_1.Schema({
    serviceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    serviceKey: { type: String, required: true },
    version: { type: String, required: true },
    environment: { type: String, default: 'Production' },
    deployedAt: { type: Date, required: true },
    deployedBy: { type: String, required: true },
    commitHash: { type: String, required: true },
    changes: { type: String, required: true }
}, { timestamps: true });
exports.Deployment = (0, mongoose_1.model)('Deployment', deploymentSchema);
