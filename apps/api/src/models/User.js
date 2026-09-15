"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@opsai/shared");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(shared_1.UserRole), default: shared_1.UserRole.ENGINEER },
    avatar: { type: String },
    status: { type: String, enum: ['ACTIVE', 'DISABLED'], default: 'ACTIVE' }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
