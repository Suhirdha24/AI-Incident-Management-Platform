"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@opsai/shared");
const serviceSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    status: { type: String, enum: Object.values(shared_1.ServiceStatus), default: shared_1.ServiceStatus.HEALTHY },
    environment: { type: String, default: 'Production' },
    ownerTeam: { type: String, required: true },
    repository: { type: String, required: true },
    techStack: { type: String, required: true },
    openIncidentsCount: { type: Number, default: 0 }
}, { timestamps: true });
exports.Service = (0, mongoose_1.model)('Service', serviceSchema);
