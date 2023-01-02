"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
exports.Token = mongoose_1.default.model('Token', new Schema({
    tokenString: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ip: { type: String },
    deviceName: { type: String },
    deviceOS: { type: String },
    browser: { type: String },
    browserVersion: { type: String },
    isAPI: { type: String },
    createdDate: { type: Date },
    lastUsedDate: { type: Date },
    isActive: { type: Boolean },
    isForgotPasswordToken: { type: Boolean },
    isEmailToken: { type: Boolean }
}));
exports.Token.createIndexes({ userId: 1 });
exports.Token.createIndexes({ tokenString: 1 });
exports.Token.createIndexes({ deviceOS: 1, deviceName: 1, browser: 1 });
//# sourceMappingURL=token.model.js.map